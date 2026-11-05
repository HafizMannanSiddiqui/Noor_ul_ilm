import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { CATEGORIES } from "@/content/site";
import { Badge, fmt, Msg, Shell } from "../_components/ui";

export const metadata = { title: "Posts" };

export default async function Posts({ searchParams }: { searchParams: Promise<{ status?: string; ok?: string; err?: string }> }) {
  const u = await requireUser(can.editPosts);
  const { status, ok, err } = await searchParams;
  const posts = await db.post.findMany({
    where: status ? { status } : {},
    include: { reviewer: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  const filters: [string, string][] = [["", "All"], ["DRAFT", "Drafts"], ["PENDING_REVIEW", "Waiting review"], ["APPROVED", "Published"]];
  return (
    <Shell user={u}>
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <div><h1>Posts · مضامین</h1><p className="sub">Only scholar-approved posts appear on the website.</p></div>
        <Link className="btn btn-p" href="/admin/posts/new">+ New post · نیا مضمون</Link>
      </div>
      <Msg ok={ok} err={err} />
      <div className="actions" style={{ marginBottom: 12 }}>
        {filters.map(([v, l]) => <Link key={v} className={`btn btn-s ${status === v || (!status && !v) ? "btn-p" : "btn-o"}`} href={`/admin/posts${v ? `?status=${v}` : ""}`}>{l}</Link>)}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Reviewed by</th><th>Updated</th></tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td><Link href={`/admin/posts/${p.id}`}><b>{p.titleEn}</b></Link><div className="ur" dir="rtl">{p.titleUr}</div></td>
                <td>{CATEGORIES.find((c) => c.id === p.category)?.en}</td>
                <td><Badge v={p.status} /></td>
                <td>{p.reviewer?.name ?? "—"}</td>
                <td>{fmt(p.updatedAt)}</td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={5}>No posts.</td></tr>}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
