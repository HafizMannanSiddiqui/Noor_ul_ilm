import type { Metadata } from "next";
import Logo from "@/components/Logo";
import SacredCard from "@/components/SacredCard";
import { PageHead, Section } from "@/components/Cards";
import { waLink } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/Icons";
import { getConfig } from "@/lib/config";
import { db } from "@/lib/db";
import { tr } from "@/lib/lang";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { fetchAyah, fetchHadith } from "@/lib/daily";
import { SITE_URL } from "@/lib/settings";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("aboutTitle") };
}

export default async function About({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  // Verses and hadith load live from verified sources (Tanzil + Kanz-ul-Iman; hadith-api).
  const [a1, a2, hd, reviewers, { team: TEAM }] = await Promise.all([
    fetchAyah("96:1"),
    fetchAyah("39:9"),
    fetchHadith("ibnmajah", 224, { ur: "سنن ابن ماجہ، حدیث 224", en: "Sunan Ibn Majah 224", ar: "سنن ابن ماجه، الحديث 224" }, "", { ur: "عربی و انگریزی متن: hadith-api", en: "Arabic and English text: hadith-api", ar: "النص العربي والإنجليزي: hadith-api" }),
    db.user.findMany({ where: { active: true, roles: { contains: "SCHOLAR" } }, select: { id: true, name: true, title: true }, orderBy: { name: "asc" } }),
    getConfig(),
  ]);

  return (
    <>
      <PageHead title={t("aboutTitle")} intro={t("heroIntro")} />
      <Section title={t("missionTitle")}><div className="card" {...reveal()}><p>{t("mission")}</p></div></Section>
      <Section title={t("maslakTitle")}><div className="card" {...reveal()}><p>{t("maslak")}</p></div></Section>
      <Section title={t("whyTitle")}>
        <div style={{ marginBottom: 16 }}><div className="card" {...reveal()}><p>{t("why")}</p></div></div>
        <div className="grid grid-2">
          {[a1, a2].map((x, i) => (x ? <SacredCard key={i} text={x} lang={lang} share siteUrl={SITE_URL} /> : null))}
        </div>
        {hd && <div style={{ marginTop: 16 }}><SacredCard text={hd} lang={lang} share siteUrl={SITE_URL} /></div>}
      </Section>
      <Section title={t("scholarsBoard")}>
        <div className="grid grid-2">
          {reviewers.map((r, i) => (
            <div key={r.id} className="card hover profile" {...reveal(i * 0.08)}>
              <div className="monogram"><Logo size={40} animated={false} id={`rv${i}`} /></div>
              <div><h3>{r.name}</h3><p className="muted">{r.title}</p></div>
            </div>
          ))}
        </div>
      </Section>
      <Section title={t("teamTitle")}>
        <p className="muted" {...reveal()}>{t("teamNote")}</p>
        <div className="grid grid-3">
          {TEAM.map((m, i) => (
            <div key={i} className="card hover" {...reveal(i * 0.08)}>
              <h3>{tr(m.name, lang)}</h3>
              <p className="muted">{tr(m.role, lang)}</p>
              {m.phone && (
                <p className="team-contact">
                  <a className="ltr" href={`tel:+${m.phone}`} aria-label={`${t("call")} ${tr(m.name, lang)}`}>+{m.phone.slice(0, 2)} {m.phone.slice(2, 5)} {m.phone.slice(5)}</a>
                  <a className="btn btn-wa btn-small" rel="noopener" href={waLink(m.phone)}><WhatsAppIcon size={16} /> WhatsApp</a>
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
