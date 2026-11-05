import type { SacredText } from "@prisma/client";
import { getT } from "@/lib/strings";
import type { Lang } from "@/lib/lang";

/** Quran verse or Hadith in a Mushaf-style frame: Arabic + Urdu + English + reference. */
export default function SacredCard({ text, lang, label }: { text: SacredText; lang: Lang; label?: string }) {
  const t = getT(lang);
  const isAyah = text.kind === "AYAH";
  const ref = lang === "ur" ? text.refUr : lang === "ar" ? text.refAr || text.refEn : text.refEn;
  const part = text.partial ? (lang === "en" ? " (part)" : lang === "ar" ? " (جزء)" : " (حصہ)") : "";
  return (
    <article className="text-card" data-reveal="zoom">
      {label && <div className="label">{label}</div>}
      <div className="inner">
        <p className={isAyah ? "quran" : "arabic-text"} lang="ar">{text.arabic}</p>
        <div className="tr tr-ur" lang="ur">
          <span className="tr-label">{isAyah ? t("urduKanz") : t("urduTr")}</span>
          {text.ur}
        </div>
        <div className="tr tr-en" lang="en">
          <span className="tr-label">{t("english")}</span>
          {text.en}
        </div>
        <p className="ref">
          {isAyah ? (lang === "en" ? `— ${ref}${part}` : `﴿ ${ref}${part} ﴾`) : `${t("source")}: ${ref}${text.grading ? ` · ${text.grading}` : ""}`}
        </p>
        {!text.verified && <p className="warn">{t("verifyPending")}</p>}
      </div>
    </article>
  );
}

export function PlaceholderCard({ label, lang }: { label: string; lang: Lang }) {
  return (
    <article className="text-card">
      <div className="label">{label}</div>
      <div className="inner"><p className="muted">{getT(lang)("noVerifiedText")}</p></div>
    </article>
  );
}
