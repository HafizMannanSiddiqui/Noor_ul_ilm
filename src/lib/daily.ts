import "server-only";
import { DAILY_AYAT, GIVING, NAWAWI_COUNT, NAWAWI_UR } from "@/content/daily";
import type { Tri } from "./lang";

/** One verse or hadith, ready to display and share. Not stored anywhere. */
export type DailyText = {
  kind: "AYAH" | "HADITH";
  arabic: string;
  ur: string;
  en: string;
  ref: Tri;
  grading?: string;
  partial?: boolean;
  verified: boolean;
  /** Where the text comes from, shown under the card. */
  source?: Tri;
};

const WEEK = 60 * 60 * 24 * 7;

/** Fetch JSON with a timeout; the response is cached by Next.js (Vercel Data Cache), not in our database. */
async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: WEEK }, signal: AbortSignal.timeout(5000) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** Day number in Lahore time, so the text changes at Pakistani midnight. */
export const dayIndex = () => Math.floor((Date.now() + 5 * 3600_000) / 86400_000);

const stripTashkeel = (s: string) => s.replace(/[ً-ٰٟۖ-ۭ]/g, "");
/** The source prefixes the first verse of each surah with Bismillah; compare without diacritics to remove it. */
function withoutBismillah(text: string) {
  const words = text.split(" ");
  const norm = (w: string) => stripTashkeel(w).replace(/ٱ/g, "ا");
  return words.slice(0, 4).map(norm).join(" ") === "بسم الله الرحمن الرحيم" ? words.slice(4).join(" ") : text;
}

type AyahApi = { data: { text: string; numberInSurah: number; surah: { number: number; name: string; englishName: string } }[] };

const KANZ_SOURCE: Tri = {
  ur: "عربی متن: تنزیل (رسمِ عثمانی) · ترجمہ: کنز الایمان، امام احمد رضا خان",
  en: "Arabic: Tanzil (Uthmani script) · Translation: Kanz-ul-Iman, Imam Ahmad Raza Khan",
  ar: "النص: تنزيل (الرسم العثماني) · الترجمة: كنز الإيمان، الإمام أحمد رضا خان",
};

/** One verse (e.g. "2:261"): Uthmani Arabic + Kanz-ul-Iman in Urdu and English. */
export async function fetchAyah(ref: string): Promise<DailyText | null> {
  const j = await getJson<AyahApi>(`https://api.alquran.cloud/v1/ayah/${ref}/editions/quran-uthmani,ur.kanzuliman,en.ahmedraza`);
  if (!j || j.data?.length !== 3) return null;
  const [ar, ur, en] = j.data;
  const s = ar.surah;
  // Bismillah is not part of the first verse (except in Al-Fatiha).
  const arabic = ar.numberInSurah === 1 && s.number !== 1 ? withoutBismillah(ar.text) : ar.text;
  const name = stripTashkeel(s.name).replace(/^\S*سورة/, "").replace(/\s+/g, " ").trim();
  const n = `${s.number}:${ar.numberInSurah}`;
  return {
    kind: "AYAH", arabic, ur: ur.text, en: en.text, verified: true,
    ref: { ur: `سورۃ ${name} ${n}`, en: `Surah ${s.englishName} ${n}`, ar: `سورة ${name} ${n}` },
    source: KANZ_SOURCE,
  };
}

export const ayahOfDay = (list: string[] = DAILY_AYAT, day = dayIndex()) => {
  const refs = list.length ? list : DAILY_AYAT;
  return fetchAyah(refs[day % refs.length]);
};

type HadithApi = { hadiths: { hadithnumber: number; text: string }[] };

/** The source sometimes contains HTML line breaks; show plain text. */
const cleanHadith = (s: string) => s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/[ \t]+\n/g, "\n").trim();

/** One hadith in Arabic + English from the hadith-api (by that source's hadith number). */
export async function fetchHadith(book: string, n: number, ref: Tri, ur: string, source: Tri): Promise<DailyText | null> {
  const base = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
  const [ar, en] = await Promise.all([getJson<HadithApi>(`${base}/ara-${book}/${n}.json`), getJson<HadithApi>(`${base}/eng-${book}/${n}.json`)]);
  const a = ar?.hadiths?.[0]?.text;
  const e = en?.hadiths?.[0]?.text;
  if (!a || !e) return null;
  return { kind: "HADITH", arabic: cleanHadith(a), en: cleanHadith(e), ur, ref, source, verified: true };
}

export function hadithOfDay(day = dayIndex()) {
  const n = (day % NAWAWI_COUNT) + 1;
  return fetchHadith(
    "nawawi", n,
    { ur: `اربعینِ نووی، حدیث ${n}`, en: `Imam an-Nawawi's Forty Hadith, No. ${n}`, ar: `الأربعون النووية، الحديث ${n}` },
    NAWAWI_UR[n] || "",
    { ur: "ماخذ: الاربعین النوویہ (امام نووی) — عربی و انگریزی", en: "Source: Al-Arba'in an-Nawawiyyah (Imam an-Nawawi)", ar: "المصدر: الأربعون النووية (الإمام النووي)" },
  );
}

/** Verses and hadith on giving, for the Donate page (list in src/content/daily.ts). */
export async function givingTexts(): Promise<DailyText[]> {
  const all = await Promise.all([
    ...GIVING.ayat.map((r) => fetchAyah(r)),
    ...GIVING.hadith.map((h) => fetchHadith(h.book, h.n, h.ref, h.ur, { ur: "عربی و انگریزی متن: hadith-api", en: "Arabic and English text: hadith-api", ar: "النص العربي والإنجليزي: hadith-api" })),
  ]);
  return all.filter((x): x is DailyText => x !== null);
}
