import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PageHead, PostCard } from "@/components/Cards";
import { CATEGORIES, FIQH_GROUP } from "@/content/site";
import { db } from "@/lib/db";
import { tr } from "@/lib/lang";
import { langOf, type LangParams } from "@/lib/page";
import { publicPostWhere } from "@/lib/queries";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("postsTitle") };
}

export default async function Posts({ params, searchParams }: LangParams & { searchParams: Promise<{ cat?: string }> }) {
  const lang = await langOf(params);
  const t = getT(lang);
  const cat = (await searchParams).cat || "all";
  const isFiqh = cat === "fiqh" || cat.startsWith("fiqh-");

  const where: Prisma.PostWhereInput = { ...publicPostWhere() };
  if (cat === "fiqh") where.category = { startsWith: "fiqh-" };
  else if (cat !== "all") where.category = cat;
  const posts = await db.post.findMany({ where, orderBy: { publishedAt: "desc" } });

  const groups: [string, string][] = [["all", t("all")]];
  for (const c of CATEGORIES) {
    if (c.group === "fiqh") { if (!groups.some((g) => g[0] === "fiqh")) groups.push(["fiqh", tr(FIQH_GROUP, lang)]); }
    else groups.push([c.id, tr(c, lang)]);
  }
  const href = (id: string) => `/${lang}/posts${id === "all" ? "" : `?cat=${id}`}`;

  return (
    <>
      <PageHead title={t("postsTitle")} intro={t("postsIntro")} />
      <section className="section">
        <div className="wrap">
          <nav className="filters" aria-label={t("category")}>
            {groups.map(([id, n]) => (
              <Link key={id} className="chip" href={href(id)} aria-current={cat === id || (id === "fiqh" && isFiqh) ? "page" : undefined}>{n}</Link>
            ))}
          </nav>
          {isFiqh && (
            <nav className="filters">
              {CATEGORIES.filter((c) => c.group === "fiqh").map((c) => (
                <Link key={c.id} className="chip" href={href(c.id)} aria-current={cat === c.id ? "page" : undefined}>{tr(c, lang)}</Link>
              ))}
            </nav>
          )}
          <div className="grid grid-3">
            {posts.length === 0 && <p className="muted">{t("noItems")}</p>}
            {posts.map((p, i) => <PostCard key={p.id} post={p} lang={lang} delay={(i % 3) * 0.08} />)}
          </div>
        </div>
      </section>
    </>
  );
}
