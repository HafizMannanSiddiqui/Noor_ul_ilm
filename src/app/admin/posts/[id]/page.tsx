import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { CATEGORIES } from "@/content/site";
import { deletePost, reviewPost, savePost } from "../../_actions/content";
import { Badge, fmt, Msg, Select, Shell, Tri } from "../../_components/ui";

export const metadata = { title: "Edit post" };

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.editPosts);
  const { id } = await params;
  const { ok, err } = await searchParams;
  const isNew = id === "new";
  const post = isNew ? null : await db.post.findUnique({ where: { id }, include: { reviewer: { select: { name: true, title: true } } } });
  if (!isNew && !post) notFound();
  const texts = await db.sacredText.findMany({ select: { key: true, kind: true, refEn: true, verified: true }, orderBy: { key: "asc" } });
  const row = post as unknown as Record<string, unknown> | null;

  return (
    <Shell user={u}>
      <p><Link href="/admin/posts">← All posts</Link></p>
      <h1>{isNew ? "New post · نیا مضمون" : post!.titleEn}</h1>
      {post && (
        <p className="sub">
          Status: <Badge v={post.status} />{" "}
          {post.status === "APPROVED" && post.reviewer && <>· Approved by <b>{post.reviewer.title} {post.reviewer.name}</b> on {fmt(post.reviewedAt!)}</>}
          {post.status === "APPROVED" && <> · <Link href={`/ur/posts/${post.slug}`} target="_blank">View on site ↗</Link></>}
        </p>
      )}
      <Msg ok={ok} err={err} />
      {post?.reviewNote && <p className="alert alert-info"><b>Scholar&apos;s note:</b> {post.reviewNote}</p>}
      {post?.status === "APPROVED" && <p className="lock">🔒 Editing this post will un-publish it until a scholar approves the new version. · ترمیم کے بعد دوبارہ منظوری ضروری ہے۔</p>}

      {can.approvePosts(u) && post && post.status !== "APPROVED" && (
        <form className="box f" action={reviewPost}>
          <h2 style={{ marginTop: 0 }}>Scholar review · نظرِ ثانی</h2>
          <p className="help">Approve only after checking every verse, hadith and masala against verified sources. Your name will be shown as &ldquo;Reviewed by&rdquo;.</p>
          <input type="hidden" name="id" value={post.id} />
          <div><label className="l" htmlFor="note">Note to the writer (optional)</label><textarea id="note" name="note" defaultValue={post.reviewNote} /></div>
          <div className="actions">
            <button className="btn btn-p" name="decision" value="approve">✓ Approve &amp; publish · منظور کریں</button>
            <button className="btn btn-o" name="decision" value="changes">Return for changes · واپس بھیجیں</button>
          </div>
        </form>
      )}
      {can.approvePosts(u) && post?.status === "APPROVED" && (
        <form className="box" action={reviewPost}>
          <input type="hidden" name="id" value={post.id} />
          <button className="btn btn-o" name="decision" value="unpublish">Un-publish · اشاعت روکیں</button>
        </form>
      )}

      <form className="box f" action={savePost}>
        {post && <input type="hidden" name="id" value={post.id} />}
        <div className="row row-3">
          <div>
            <label className="l" htmlFor="slug">Web address (slug) <small>e.g. namaz-ka-tariqa</small></label>
            <input id="slug" name="slug" defaultValue={post?.slug} required pattern="[a-z0-9\-]{3,80}" />
          </div>
          <Select name="category" label="Category · زمرہ" value={post?.category} opts={CATEGORIES.map((c) => [c.id, `${c.en} · ${c.ur}`])} />
          <Select name="cover" label="Cover design" value={post?.cover} opts={[["star", "Star ✦"], ["drop", "Water drop (Taharat)"], ["moon", "Crescent"]]} />
        </div>
        <Tri name="title" label="Title · عنوان" row={row} />
        <Tri name="summary" label="Short summary · خلاصہ" row={row} textarea />
        <div className="help">
          <b>How to write the body · متن لکھنے کا طریقہ</b><br />
          Empty line = new paragraph · <code>## Heading</code> · <code>- list item</code> · <code>&gt; note for the scholar</code><br />
          Insert a verse or hadith from the library on its own line: <code>[[ayah:alaq-1]]</code> or <code>[[hadith:ibnmajah-224]]</code>.
          Never type a verse or hadith by hand — add it in <Link href="/admin/texts">Verses &amp; Hadith</Link> first.
          <br />Available: {texts.map((x) => <code key={x.key} style={{ marginInlineEnd: 6 }}>[[{x.kind === "AYAH" ? "ayah" : "hadith"}:{x.key}]]{x.verified ? " ✓" : ""}</code>)}
        </div>
        <Tri name="body" label="Body · مضمون" row={row} textarea tall />
        <Tri name="refs" label="References (one per line) · حوالہ جات" row={row} textarea required={false} />
        <div className="actions">
          <button className="btn btn-o" name="intent" value="draft">Save draft · محفوظ کریں</button>
          <button className="btn btn-g" name="intent" value="submit">Save &amp; send for scholar review · منظوری کے لیے بھیجیں</button>
        </div>
      </form>

      {post && (can.manageUsers(u) || can.approvePosts(u)) && (
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <button className="btn btn-d btn-s">Delete post permanently</button>
        </form>
      )}
    </Shell>
  );
}
