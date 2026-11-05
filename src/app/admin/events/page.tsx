import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { AREAS } from "@/content/site";
import { Badge, Msg, Shell } from "../_components/ui";

export const metadata = { title: "Events" };

export default async function Events({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.anyEvents);
  const { ok, err } = await searchParams;
  const audiences = [...(can.sistersContent(u) ? ["sisters"] : []), ...(can.brothersSection(u) ? ["brothers", "all"] : [])];
  const events = await db.event.findMany({ where: { audience: { in: audiences } }, orderBy: [{ date: "desc" }] });
  return (
    <Shell user={u}>
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <div><h1>Events · محافل</h1><p className="sub">You can manage: {audiences.join(", ")} events. Past dated events disappear from the site automatically.</p></div>
        <Link className="btn btn-p" href="/admin/events/new">+ New event · نئی محفل</Link>
      </div>
      <Msg ok={ok} err={err} />
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Title</th><th>Type</th><th>Area</th><th>Audience</th><th>Shown</th></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{e.date || <i>{e.recurringEn}</i>}</td>
                <td><Link href={`/admin/events/${e.id}`}><b>{e.titleEn}</b></Link><div className="ur" dir="rtl">{e.titleUr}</div></td>
                <td>{e.type}</td>
                <td>{AREAS.find((a) => a.id === e.area)?.en}</td>
                <td>{e.audience}</td>
                <td><Badge v={e.published ? "yes" : "no"} /></td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={6}>No events.</td></tr>}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
