export const LANGS = ["ur", "en", "ar"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "ur";
export const isLang = (x: unknown): x is Lang => typeof x === "string" && (LANGS as readonly string[]).includes(x);
export const dirOf = (l: Lang) => (l === "en" ? "ltr" : "rtl");
export const LOCALE: Record<Lang, string> = { ur: "ur-PK", en: "en-GB", ar: "ar" };

export type Tri = { ur: string; en: string; ar?: string };

/** Pick a string from a {ur,en,ar} object, falling back to English, then Urdu. */
export const tr = (o: Tri | undefined, l: Lang) => (o ? (l === "ar" ? o.ar || o.en : o[l]) || o.en || o.ur : "");

/** Pick a localized DB column: pick(post, "title", "ur") -> post.titleUr (with fallback). */
export function pick(row: object, field: string, l: Lang): string {
  const r = row as Record<string, unknown>;
  const get = (s: string) => (typeof r[field + s] === "string" ? (r[field + s] as string) : "");
  return get(l === "ur" ? "Ur" : l === "en" ? "En" : "Ar") || get("En") || get("Ur");
}

export function fmtDate(iso: string, l: Lang, opts: Intl.DateTimeFormatOptions) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(LOCALE[l], { timeZone: "UTC", ...opts }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Today's date in Lahore (YYYY-MM-DD). */
export const todayPK = () => new Date(Date.now() + 5 * 3600_000).toISOString().slice(0, 10);
