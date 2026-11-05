import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { Badge, Msg, Shell } from "../_components/ui";

export const metadata = { title: "Classes" };

export default async function Classes({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.sistersContent);
  const { ok, err } = await searchParams;
  const classes = await db.classSession.findMany({ include: { teacher: { select: { nameEn: true } } }, orderBy: { sort: "asc" } });
  return (
    <Shell user={u}>
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <div><h1>Classes · کلاسیں</h1><p className="sub">Women&apos;s Corner schedule (sisters&apos; admins only).</p></div>
        <Link className="btn btn-p" href="/admin/classes/new">+ New class</Link>
      </div>
      <Msg ok={ok} err={err} />
      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Subject</th><th>Level / Age / Mode</th><th>When</th><th>Teacher</th><th>Shown</th></tr></thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td>{c.sort}</td>
                <td><Link href={`/admin/classes/${c.id}`}><b>{c.subject}</b></Link></td>
                <td>{c.level} · {c.ageGroup} · {c.mode}</td>
                <td>{c.whenEn}</td>
                <td>{c.teacher?.nameEn ?? "—"}</td>
                <td><Badge v={c.active ? "yes" : "no"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
