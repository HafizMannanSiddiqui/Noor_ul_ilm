import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import { categoryName, Cover } from "@/components/Cards";
import { CheckIcon, WhatsAppIcon } from "@/components/Icons";
import { ReadProgress } from "@/components/Interactive";
import { db } from "@/lib/db";
import { isLang, LOCALE, pick, type Lang } from "@/lib/lang";
import { publicPostWhere, textsForBodies } from "@/lib/queries";
import { SITE_URL } from "@/lib/settings";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ lang: string; slug: string }> };

async function load(params: P["params"]) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const post = await db.post.findFirst({ where: { slug, ...publicPostWhere() }, include: { reviewer: { select: { name: true, title: true } } } });
  if (!post) notFound();
  return { lang: lang as Lang, post };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, post } = await load(params);
  return { title: pick(post, "title", lang), description: pick(post, "summary", lang), openGraph: { type: "article", title: pick(post, "title", lang), description: pick(post, "summary", lang) } };
}

export default async function PostPage({ params }: P) {
  const { lang, post } = await load(params);
  const t = getT(lang);
  const body = pick(post, "body", lang);
  const texts = await textsForBodies(body);
  const refs = pick(post, "refs", lang).split("\n").map((s) => s.trim()).filter(Boolean);
  const url = `${SITE_URL}/${lang}/posts/${post.slug}`;
  const title = pick(post, "title", lang);
  const date = new Intl.DateTimeFormat(LOCALE[lang], { day: "numeric", month: "long", year: "numeric" }).format(post.publishedAt);
  const approved = post.status === "APPROVED" && post.reviewer;

  return (
    <section className="section">
      <ReadProgress />
      <div className="wrap" style={{ maxWidth: 840 }}>
        <article className="article">
          <Cover kind={post.cover} label={title} id={`hero-${post.id}`} />
          <Link className="pill" href={`/${lang}/posts?cat=${post.category}`}>{categoryName(post.category, lang)}</Link>{" "}
          <span className="muted">{date}</span>
          <h1>{title}</h1>
          <div className={`reviewed${approved ? "" : " pending"}`}>
            <CheckIcon />
            <span>{t("reviewedBy")} {approved ? `${post.reviewer!.title ? post.reviewer!.title + " " : ""}${post.reviewer!.name}` : t("reviewPending")}</span>
          </div>
          {post.status !== "APPROVED" && <p className="warn">{t("draft")}</p>}
          <p><strong>{pick(post, "summary", lang)}</strong></p>
          <RichText source={body} lang={lang} texts={texts} />
          {refs.length > 0 && (
            <>
              <h2>{t("references")}</h2>
              <ol>{refs.map((r, i) => <li key={i}>{r}</li>)}</ol>
            </>
          )}
          <div className="share">
            <strong>{t("share")}:</strong>
            <a className="btn btn-wa btn-small" rel="noopener" target="_blank" href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`}><WhatsAppIcon size={18} /> WhatsApp</a>
            <a className="btn btn-fb btn-small" rel="noopener" target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}>Facebook</a>
          </div>
        </article>
        <p style={{ marginTop: 16 }}><Link className="btn btn-green btn-small" href={`/${lang}/posts`}>{t("back")}</Link></p>
      </div>
    </section>
  );
}
