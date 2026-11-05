import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { FeaturedEvent, PageHead, Section } from "@/components/Cards";
import { SisterForm } from "@/components/Forms";
import { ClassBrowser } from "@/components/Interactive";
import { db } from "@/lib/db";
import { pick, todayPK } from "@/lib/lang";
import { nextFeaturedEvent } from "@/lib/queries";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("sistersTitle") };
}

export default async function Sisters({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  const [classes, scholars, featured] = await Promise.all([
    db.classSession.findMany({ where: { active: true }, include: { teacher: true }, orderBy: { sort: "asc" } }),
    db.scholar.findMany({ where: { active: true }, orderBy: { sort: "asc" } }),
    nextFeaturedEvent(),
  ]);
  const view = classes.map((c) => ({
    id: c.id, subject: c.subject, level: c.level, ageGroup: c.ageGroup, mode: c.mode,
    when: pick(c, "when", lang), where: pick(c, "where", lang), teacher: c.teacher ? pick(c.teacher, "name", lang) : "",
  }));

  return (
    <>
      <PageHead title={t("sistersTitle")} intro={t("sistersIntro")} />
      {featured && <FeaturedEvent e={featured} lang={lang} today={todayPK()} />}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap"><p className="transport-note" {...reveal()}><span aria-hidden="true">🚐</span> {t("transportNote")}</p></div>
      </section>
      <Section title={t("schedule")}><ClassBrowser lang={lang} classes={view} /></Section>
      <Section title={t("regTitle")} id="register" narrow><SisterForm lang={lang} /></Section>
      <Section title={t("scholarsTitle")}>
        <p className="muted" {...reveal()}>{t("noPhotos")}</p>
        <div className="grid grid-3">
          {scholars.map((s, i) => (
            <article key={s.id} className="card hover profile" {...reveal(i * 0.08)}>
              <div className="monogram"><Logo size={40} animated={false} id={`sc${i}`} /></div>
              <div>
                <h3>{pick(s, "name", lang)}</h3>
                <p className="muted">{pick(s, "title", lang)}</p>
                {pick(s, "subjects", lang) && <p>{pick(s, "subjects", lang)}</p>}
                {pick(s, "bio", lang) && <p className="muted">{pick(s, "bio", lang)}</p>}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
