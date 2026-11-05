import Link from "next/link";
import type { Event, Post } from "@prisma/client";
import { AREAS, CATEGORIES } from "@/content/site";
import { fmtDate, pick, tr, type Lang } from "@/lib/lang";
import { getT, type StringKey } from "@/lib/strings";
import Ornament from "./Ornament";

/* ---------- Post cover art (geometric, no photos) ---------- */
const MOTIFS: Record<string, React.ReactNode> = {
  star: (
    <g fill="none" stroke="#c9a23a" strokeWidth="2">
      <rect x="150" y="30" width="60" height="60" />
      <rect x="150" y="30" width="60" height="60" transform="rotate(45 180 60)" />
      <circle cx="180" cy="60" r="10" fill="#f3d98a" stroke="none" />
    </g>
  ),
  drop: <path d="M180 22c20 28 32 44 32 60a32 32 0 0 1-64 0c0-16 12-32 32-60z" fill="none" stroke="#c9a23a" strokeWidth="3" />,
  moon: (
    <g>
      <path d="M196 24a38 38 0 1 0 0 72 32 32 0 1 1 0-72z" fill="#c9a23a" />
      <path d="M222 44l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#f3d98a" />
    </g>
  ),
};
export function Cover({ kind, label, id }: { kind: string; label: string; id: string }) {
  return (
    <svg className="cover" viewBox="0 0 360 120" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <defs>
        <pattern id={`pt-${id}`} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M15 3l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="none" stroke="#c9a23a" strokeOpacity=".22" />
        </pattern>
        <radialGradient id={`rg-${id}`} cx="50%" cy="50%">
          <stop offset="0" stopColor="#1d7354" />
          <stop offset="1" stopColor="#0a3a2b" />
        </radialGradient>
      </defs>
      <rect width="360" height="120" fill={`url(#rg-${id})`} />
      <rect width="360" height="120" fill={`url(#pt-${id})`} />
      <path d="M140 120V70c0-24 22-38 40-58 18 20 40 34 40 58v50" fill="rgba(6,42,31,.55)" stroke="#c9a23a" strokeWidth="1.5" />
      {MOTIFS[kind] || MOTIFS.star}
    </svg>
  );
}

export const categoryName = (id: string, lang: Lang) => tr(CATEGORIES.find((c) => c.id === id), lang);

export function PostCard({ post, lang, delay = 0 }: { post: Post; lang: Lang; delay?: number }) {
  const t = getT(lang);
  return (
    <Link href={`/${lang}/posts/${post.slug}`} className="card post-card" data-reveal style={{ "--rd": `${delay}s` } as React.CSSProperties}>
      <div className="cover-wrap"><Cover kind={post.cover} label={pick(post, "title", lang)} id={post.id} /></div>
      <div className="body">
        <span><span className="pill">{categoryName(post.category, lang)}</span></span>
        <h3>{pick(post, "title", lang)}</h3>
        <p>{pick(post, "summary", lang)}</p>
        {post.status !== "APPROVED" && <p className="warn">{t("draft")}</p>}
        <span className="more">{t("readMore")}</span>
      </div>
    </Link>
  );
}

export function EventItem({ e, lang, delay = 0 }: { e: Event; lang: Lang; delay?: number }) {
  const t = getT(lang);
  const area = AREAS.find((a) => a.id === e.area);
  return (
    <article className="card hover event" data-reveal style={{ "--rd": `${delay}s` } as React.CSSProperties}>
      {e.date ? (
        <div className="date-badge">
          <span className="d">{Number(e.date.slice(8))}</span>
          <span className="m">{fmtDate(e.date, lang, { month: "short" })}</span>
        </div>
      ) : (
        <div className="date-badge rec">{pick(e, "recurring", lang)}</div>
      )}
      <div>
        <h3>{pick(e, "title", lang)}</h3>
        <p className="meta">
          {e.date ? `${fmtDate(e.date, lang, { weekday: "long", day: "numeric", month: "long" })} · ` : ""}
          {pick(e, "time", lang)}
        </p>
        <p className="meta">📍 {pick(e, "venue", lang)}</p>
        {pick(e, "speaker", lang) && <p className="meta"><b>{t("specialTalk")}:</b> {pick(e, "speaker", lang)}</p>}
        <span className="pill">{t(`ev_${e.type}` as StringKey)}</span>
        <span className="pill pill-gold">{t(`aud_${e.audience}` as StringKey)}</span>
        {area && <span className="pill">{tr(area, lang)}</span>}
      </div>
    </article>
  );
}

/** Big gold banner for the next featured gathering (e.g. the monthly Dars-e-Quran). */
export function FeaturedEvent({ e, lang, today }: { e: Event; lang: Lang; today: string }) {
  const t = getT(lang);
  const days = Math.round((Date.parse(e.date) - Date.parse(today)) / 86400_000);
  const when = days <= 0 ? t("evToday") : days === 1 ? t("evTomorrow") : null;
  const speaker = pick(e, "speaker", lang);
  return (
    <section className="featured" aria-label={t("featuredEv")}>
      <div className="wrap">
        <article className="featured-card" data-reveal>
          <div className="featured-glow" aria-hidden="true" />
          <span className="featured-tag">✦ {t("featuredEv")} ✦</span>
          <h2>{pick(e, "title", lang)}</h2>
          <div className="featured-when">
            <div className="featured-count">
              {when ? <span className="featured-soon">{when}</span> : (<><b>{days}</b><span>{t("evDaysLeft")}</span></>)}
            </div>
            <div>
              <p className="featured-date">{fmtDate(e.date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              <p>{pick(e, "time", lang)}</p>
            </div>
          </div>
          {speaker && (
            <div className="featured-speaker">
              <span>{t("specialTalk")}</span>
              <p>{speaker}</p>
            </div>
          )}
          <p className="featured-venue">📍 {pick(e, "venue", lang)}</p>
          {e.audience === "sisters" && <p className="featured-transport">🚐 {t("transportShort")}</p>}
          <span className="pill pill-gold">{t(`aud_${e.audience}` as StringKey)}</span>
        </article>
      </div>
    </section>
  );
}

export function PageHead({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="page-head">
      <div className="hero-pattern" aria-hidden="true" />
      <div className="wrap">
        <h1>{title}</h1>
        <Ornament />
        {intro && <p>{intro}</p>}
      </div>
    </section>
  );
}

export function Section({ title, children, id, narrow }: { title: string; children: React.ReactNode; id?: string; narrow?: boolean }) {
  return (
    <section className="section" id={id}>
      <div className="wrap" style={narrow ? { maxWidth: 760 } : undefined}>
        <h2 className="section-title" data-reveal>{title}</h2>
        {children}
      </div>
    </section>
  );
}
