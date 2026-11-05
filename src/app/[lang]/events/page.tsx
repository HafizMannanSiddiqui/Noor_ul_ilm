import type { Metadata } from "next";
import Link from "next/link";
import { EventItem, PageHead } from "@/components/Cards";
import { AREAS } from "@/content/site";
import { db } from "@/lib/db";
import { tr } from "@/lib/lang";
import { langOf, type LangParams } from "@/lib/page";
import { upcomingEvents } from "@/lib/queries";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("eventsTitle") };
}

export default async function Events({ params, searchParams }: LangParams & { searchParams: Promise<{ area?: string }> }) {
  const lang = await langOf(params);
  const t = getT(lang);
  const area = (await searchParams).area || "all";
  const [events, used] = await Promise.all([
    upcomingEvents(area === "all" ? {} : { area }),
    db.event.findMany({ where: { published: true }, select: { area: true }, distinct: ["area"] }),
  ]);
  const areas = AREAS.filter((a) => used.some((u) => u.area === a.id));

  return (
    <>
      <PageHead title={t("eventsTitle")} intro={t("eventsIntro")} />
      <section className="section">
        <div className="wrap">
          <nav className="filters" aria-label={t("area")}>
            <Link className="chip" href={`/${lang}/events`} aria-current={area === "all" ? "page" : undefined}>{t("all")}</Link>
            {areas.map((a) => (
              <Link key={a.id} className="chip" href={`/${lang}/events?area=${a.id}`} aria-current={area === a.id ? "page" : undefined}>{tr(a, lang)}</Link>
            ))}
          </nav>
          <div className="item-list">
            {events.length === 0 && <p className="muted">{t("noItems")}</p>}
            {events.map((e, i) => <EventItem key={e.id} e={e} lang={lang} delay={Math.min(i, 5) * 0.06} />)}
          </div>
          <p className="muted" style={{ marginTop: 16 }}>{t("moreAreas")}</p>
        </div>
      </section>
    </>
  );
}
