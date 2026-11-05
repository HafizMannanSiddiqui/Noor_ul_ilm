import { Amiri_Quran, Aref_Ruqaa, Noto_Naskh_Arabic, Noto_Nastaliq_Urdu } from "next/font/google";

/* Self-hosted at build time (no request to Google from visitors' phones).
   preload:false — the browser downloads only the fonts a page actually uses. */
export const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-nastaliq", display: "swap", preload: false });
export const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-naskh", display: "swap", preload: false });
export const quran = Amiri_Quran({ subsets: ["arabic"], weight: "400", variable: "--font-quran", display: "swap", preload: false });
export const ruqaa = Aref_Ruqaa({ subsets: ["arabic"], weight: "700", variable: "--font-ruqaa", display: "swap", preload: false });

export const fontVars = [nastaliq.variable, naskh.variable, quran.variable, ruqaa.variable].join(" ");
