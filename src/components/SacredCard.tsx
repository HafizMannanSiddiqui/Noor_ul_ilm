import type { SacredText } from "@prisma/client";
import type { DailyText } from "@/lib/daily";
import { getT } from "@/lib/strings";
import { tr, type Lang } from "@/lib/lang";
import { ORG } from "@/content/site";
import ShareVerse from "./ShareVerse";

/** Scholar-entered texts (admin panel) and live daily texts share one shape. */
function normalize(t: SacredText | DailyText): DailyText {
  if ("refUr" in t) {
    return {
      kind: t.kind === "HADITH" ? "HADITH" : "AYAH", arabic: t.arabic, ur: t.ur, en: t.en,
      grading: t.grading, partial: t.partial, verified: t.verified,
      ref: { ur: t.refUr, en: t.refEn, ar: t.refAr || t.refEn },
    };
  }
  return t;
}

/** Quran verse or Hadith in a Mushaf-style frame: Arabic + Urdu + English + reference (+ share buttons). */
export default function SacredCard({ text, lang, label, share = false, siteUrl = "" }: {
  text: SacredText | DailyText; lang: Lang; label?: string; share?: boolean; siteUrl?: string;
}) {
  const t = getT(lang);
  const x = normalize(text);
  const isAyah = x.kind === "AYAH";
  const ref = tr(x.ref, lang);
  const part = x.partial ? (lang === "en" ? " (part)" : lang === "ar" ? " (جزء)" : " (حصہ)") : "";
  const refLine = isAyah ? (lang === "en" ? `— ${ref}${part}` : `﴿ ${ref}${part} ﴾`) : `${t("source")}: ${ref}${x.grading ? ` · ${x.grading}` : ""}`;
  return (
    <article className="text-card" data-reveal="zoom">
      {label && <div className="label">{label}</div>}
      <div className="inner">
        <p className={isAyah ? "quran" : "arabic-text"} lang="ar">{x.arabic}</p>
        {x.ur && (
          <div className="tr tr-ur" lang="ur">
            <span className="tr-label">{isAyah ? t("urduKanz") : t("urduTr")}</span>
            {x.ur}
          </div>
        )}
        <div className="tr tr-en" lang="en">
          <span className="tr-label">{isAyah && x.source ? t("englishKanz") : t("english")}</span>
          {x.en}
        </div>
        <p className="ref">{refLine}</p>
        {x.source && <p className="src-note">{tr(x.source, lang)}</p>}
        {!x.verified && <p className="warn">{t("verifyPending")}</p>}
        {share && (
          <ShareVerse
            lang={lang}
            kind={x.kind}
            label={label || ""}
            arabic={x.arabic}
            translation={lang === "en" ? x.en : x.ur || x.en}
            translationLang={lang === "en" || !x.ur ? "en" : "ur"}
            refText={refLine}
            siteName={tr(ORG.name, lang)}
            siteUrl={siteUrl}
          />
        )}
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
