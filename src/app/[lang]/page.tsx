import Link from "next/link";
import Hero from "@/components/Hero";
import DateWidget from "@/components/DateWidget";
import PrayerWidget from "@/components/PrayerWidget";
import CountUp from "@/components/CountUp";
import SacredCard, { PlaceholderCard } from "@/components/SacredCard";
import { EventItem, FeaturedEvent, PostCard, Section } from "@/components/Cards";
import { ORG } from "@/content/site";
import { db } from "@/lib/db";
import { todayPK, tr } from "@/lib/lang";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { nextFeaturedEvent, publicPostWhere, publicTextWhere, upcomingEvents } from "@/lib/queries";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";

export default async function Home({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  const p = (s: string) => `/${lang}${s}`;

  const [ayat, hadith, events, posts, classCount, scholarCount, featured] = await Promise.all([
    db.sacredText.findMany({ where: { kind: "AYAH", showOnHome: true, ...publicTextWhere() }, orderBy: { key: "asc" } }),
    db.sacredText.findMany({ where: { kind: "HADITH", showOnHome: true, ...publicTextWhere() }, orderBy: { key: "asc" } }),
    upcomingEvents(),
    db.post.findMany({ where: publicPostWhere(), orderBy: { publishedAt: "desc" }, take: 3 }),
    db.classSession.count({ where: { active: true } }),
    db.scholar.count({ where: { active: true } }),
    nextFeaturedEvent(),
  ]);
  const areaCount = new Set(events.map((e) => e.area)).size || 1;
  const day = Math.floor((Date.now() + 5 * 3600_000) / 86400_000); // rotates daily (Lahore time)
  const ayah = ayat.length ? ayat[day % ayat.length] : null;
  const hd = hadith.length ? hadith[day % hadith.length] : null;

  const stats = [
    { n: classCount, label: t("stats_classes") },
    { n: scholarCount, label: t("stats_scholars") },
    { n: areaCount, label: t("stats_areas") },
    { n: events.length, label: t("stats_events") },
  ];

  return (
    <>
      <Hero
        calligraphy={ORG.calligraphy}
        subName={lang === "en" ? tr(ORG.name, lang) : undefined}
        tagline={tr(ORG.tagline, lang)}
        lead={t("heroIntro")}
        scrollLabel={t("scrollDown")}
        cta={{
          join: { href: p("/join"), label: t("joinUs") },
          register: { href: p("/sisters#register"), label: t("registerClass") },
          donate: { href: p("/donate"), label: t("donateBtn") },
        }}
      />

      <section className="stats" aria-label="Noor-ul-Ilm">
        <div className="wrap stats-grid">
          {stats.map((s, i) => (
            <div className="stat" key={i} {...reveal(i * 0.08)}>
              <span className="stat-num"><CountUp to={s.n} /></span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {featured && <FeaturedEvent e={featured} lang={lang} today={todayPK()} />}

      <section className="section" id="today">
        <div className="wrap grid grid-2">
          <div className="card card-gold" {...reveal()}>
            <h2 className="section-title">{t("today")}</h2>
            <DateWidget lang={lang} />
          </div>
          <div className="card card-gold" {...reveal(0.1)}>
            <h2 className="section-title">{t("prayerTimes")}</h2>
            <PrayerWidget lang={lang} />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid grid-2">
          {ayah ? <SacredCard text={ayah} lang={lang} label={t("ayatOfDay")} /> : <PlaceholderCard label={t("ayatOfDay")} lang={lang} />}
          {hd ? <SacredCard text={hd} lang={lang} label={t("hadithOfDay")} /> : <PlaceholderCard label={t("hadithOfDay")} lang={lang} />}
        </div>
      </section>

      <Section title={t("upcoming")}>
        <div className="item-list">
          {events.length === 0 && <p className="muted">{t("noItems")}</p>}
          {events.slice(0, 4).map((e, i) => <EventItem key={e.id} e={e} lang={lang} delay={i * 0.08} />)}
        </div>
        <p style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="btn btn-green btn-small" href={p("/events")}>{t("viewAll")}</Link>
          <Link className="btn btn-green btn-small" href={p("/sisters")}>{t("schedule")}</Link>
        </p>
      </Section>

      <Section title={t("latestPosts")}>
        <div className="grid grid-3">
          {posts.map((post, i) => <PostCard key={post.id} post={post} lang={lang} delay={i * 0.1} />)}
        </div>
      </Section>
    </>
  );
}
