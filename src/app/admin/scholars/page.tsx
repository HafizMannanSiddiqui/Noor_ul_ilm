import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { Badge, Msg, Shell } from "../_components/ui";

export const metadata = { title: "Female scholars" };

export default async function Scholars({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.sistersContent);
  const { ok, err } = await searchParams;
  const list = await db.scholar.findMany({ orderBy: { sort: "asc" } });
  return (
    <Shell user={u}>
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <div><h1>Female scholars · عالمات</h1><p className="sub">Text profiles only. Never add a photo without written permission.</p></div>
        <Link className="btn btn-p" href="/admin/scholars/new">+ New profile</Link>
      </div>
      <Msg ok={ok} err={err} />
      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Title</th><th>Subjects</th><th>Shown</th></tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.sort}</td>
                <td><Link href={`/admin/scholars/${s.id}`}><b>{s.nameEn}</b></Link><div className="ur" dir="rtl">{s.nameUr}</div></td>
                <td>{s.titleEn}</td><td>{s.subjectsEn}</td><td><Badge v={s.active ? "yes" : "no"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
