/* =====================================================================
   AYAH & HADITH OF THE DAY — fetched live from free public sources,
   nothing is stored in the database. Ask your scholars to approve this list.
   روزانہ آیت و حدیث — مستند ذرائع سے براہِ راست، ڈیٹا بیس میں محفوظ نہیں ہوتیں۔
   ===================================================================== */

/**
 * Verses shown as "Ayah of the Day", one per day in this order (surah:ayah).
 * Only the reference is kept here. The Arabic (Tanzil, Uthmani script) and the
 * Kanz-ul-Iman translations (Urdu and English) are loaded from api.alquran.cloud.
 * Add or remove references with your scholars' approval.
 */
export const DAILY_AYAT: string[] = [
  "96:1", "20:114", "39:9", "33:56", "21:107", "68:4", "33:21", "9:128", "3:31",
  "2:152", "2:153", "2:186", "13:28", "14:7", "94:5", "94:6", "39:53", "3:139",
  "2:45", "29:69", "16:97", "3:103", "49:10", "49:13", "58:11", "17:23", "3:190",
  "3:191", "2:255", "2:286",
];

/**
 * Hadith of the Day: Imam an-Nawawi's Forty Hadith (42), one per day.
 * Arabic and English are loaded from the hadith-api (cdn.jsdelivr.net/gh/fawazahmed0/hadith-api).
 * That source has no Urdu, so scholars add the approved Urdu translation here, by hadith number:
 *   1: "اعمال کا دار و مدار نیتوں پر ہے ...",
 * Until a number has Urdu here, the card shows the Arabic and English only.
 * Never type a translation from memory — copy it from a book your scholars approve.
 */
export const NAWAWI_COUNT = 42;
export const NAWAWI_UR: Record<number, string> = {};

/**
 * Donate page: Quran and Hadith on giving. Text is loaded from the same sources (not typed here).
 * `n` is the hadith-api number; `ref` is the standard reference shown to readers.
 * `ur`: Urdu translation approved by your scholars (empty = Arabic + English only).
 */
export const GIVING = {
  ayat: ["2:261", "3:92"],
  hadith: [
    { book: "bukhari", n: 1417, ur: "",
      ref: { ur: "صحیح بخاری، حدیث 1417", en: "Sahih al-Bukhari 1417", ar: "صحيح البخاري، الحديث 1417" } },
    { book: "muslim", n: 6592, ur: "",
      ref: { ur: "صحیح مسلم، حدیث 2588", en: "Sahih Muslim 2588", ar: "صحيح مسلم، الحديث 2588" } },
  ],
};
