import type { Metadata } from "next";
import Logo from "@/components/Logo";
import SacredCard from "@/components/SacredCard";
import { PageHead, Section } from "@/components/Cards";
import { waLink } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/Icons";
import { TEAM } from "@/content/site";
import { db } from "@/lib/db";
import { tr } from "@/lib/lang";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { publicTextWhere } from "@/lib/queries";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("aboutTitle") };
}

export default async function About({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  const [texts, reviewers] = await Promise.all([
    db.sacredText.findMany({ where: { key: { in: ["alaq-1", "zumar-9", "ibnmajah-224"] }, ...publicTextWhere() } }),
    db.user.findMany({ where: { active: true, roles: { contains: "SCHOLAR" } }, select: { id: true, name: true, title: true }, orderBy: { name: "asc" } }),
  ]);
  const by = (k: string) => texts.find((x) => x.key === k);

  return (
    <>
      <PageHead title={t("aboutTitle")} intro={t("heroIntro")} />
      <Section title={t("missionTitle")}><div className="card" {...reveal()}><p>{t("mission")}</p></div></Section>
      <Section title={t("maslakTitle")}><div className="card" {...reveal()}><p>{t("maslak")}</p></div></Section>
      <Section title={t("whyTitle")}>
        <div style={{ marginBottom: 16 }}><div className="card" {...reveal()}><p>{t("why")}</p></div></div>
        <div className="grid grid-2">
          {["alaq-1", "zumar-9"].map((k) => { const x = by(k); return x ? <SacredCard key={k} text={x} lang={lang} /> : null; })}
        </div>
        {by("ibnmajah-224") && <div style={{ marginTop: 16 }}><SacredCard text={by("ibnmajah-224")!} lang={lang} /></div>}
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
