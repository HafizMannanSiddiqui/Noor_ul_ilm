import { db } from "@/lib/db";
import { audit, requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { AREAS } from "@/content/site";
import { setMemberStatus } from "../_actions/content";
import { Badge, fmt, Msg, Shell } from "../_components/ui";

export const metadata = { title: "Join requests" };
export const dynamic = "force-dynamic";

/** Brothers' admins see only BROTHERS; female sisters' admins see only SISTERS. */
export default async function Members({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser((x) => can.sistersSection(x) || can.brothersSection(x));
  const { ok, err } = await searchParams;
  const sections = [...(can.brothersSection(u) ? ["BROTHERS"] : []), ...(can.sistersSection(u) ? ["SISTERS"] : [])];
  const list = await db.memberApplication.findMany({ where: { section: { in: sections } }, orderBy: { createdAt: "desc" }, take: 300 });
  await audit(u.id, "members.view", "MemberApplication", sections.join(","));
  return (
    <Shell user={u}>
      <h1>Join requests · رکنیت کی درخواستیں</h1>
      <p className="lock">🔒 Private. You see: {sections.join(" + ").toLowerCase()} section. Never share these details publicly.</p>
      <Msg ok={ok} err={err} />
      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table>
          <thead><tr><th>Received</th><th>Name &amp; phone</th><th>Role</th><th>Area</th><th>Notes</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td>{fmt(m.createdAt)}<br /><small>{m.section}</small></td>
                <td><b>{m.name}</b><br /><a href={`https://wa.me/${m.phone.replace(/^0/, "92").replace(/\D/g, "")}`} target="_blank" rel="noopener">{m.phone}</a></td>
                <td>{m.role}</td>
                <td>{AREAS.find((a) => a.id === m.area)?.en}</td>
                <td>{m.notes}</td>
                <td>
                  <Badge v={m.status} />
                  <form action={setMemberStatus} className="actions" style={{ marginTop: 6 }}>
                    <input type="hidden" name="id" value={m.id} />
                    <select name="status" defaultValue={m.status} style={{ minHeight: 32, padding: 2 }}>
                      {["NEW", "CONTACTED", "ENROLLED", "CLOSED"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button className="btn btn-o btn-s">Set</button>
                    <button className="btn btn-d btn-s" name="delete" value="1" title="Delete">✕</button>
                  </form>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6}>No requests.</td></tr>}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
