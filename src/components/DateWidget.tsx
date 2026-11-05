"use client";
import { useEffect, useState } from "react";
import { HIJRI_ADJUST_DAYS } from "@/content/site";
import { getT } from "@/lib/strings";
import { LOCALE, type Lang } from "@/lib/lang";

/** Hijri + Gregorian date for Lahore, computed in the browser. */
export default function DateWidget({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const [d, setD] = useState<{ h: string; g: string } | null>(null);
  useEffect(() => {
    const hijriLoc = { ur: "ur-PK", en: "en-GB", ar: "ar-SA" }[lang] + "-u-ca-islamic-umalqura";
    const opt: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" };
    let h = "";
    try { h = new Intl.DateTimeFormat(hijriLoc, opt).format(new Date(Date.now() + HIJRI_ADJUST_DAYS * 86400000)); } catch {}
    const g = new Intl.DateTimeFormat(LOCALE[lang], { ...opt, weekday: "long" }).format(new Date());
    setD({ h, g });
  }, [lang]);
  return (
    <div className="dates" style={{ minHeight: 170 }}>
      <span className="muted">{t("hijri")}</span>
      <span className="big">{d?.h ?? "…"}</span>
      <span className="muted">{t("gregorian")}</span>
      <span className="big">{d?.g ?? "…"}</span>
      <span className="muted" style={{ fontSize: ".8rem" }}>{t("hijriNote")}</span>
    </div>
  );
}
