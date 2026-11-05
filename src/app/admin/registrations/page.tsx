import { db } from "@/lib/db";
import { audit, requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { AREAS } from "@/content/site";
import { deleteRegistration, setRegistrationStatus } from "../_actions/content";
import { Badge, fmt, Msg, Shell } from "../_components/ui";

export const metadata = { title: "Sisters' registrations" };
export const dynamic = "force-dynamic";

/** PRIVATE: female sisters' admins only. Every view is recorded in the activity log. */
export default async function Registrations({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string; status?: string }> }) {
  const u = await requireUser(can.sistersSection);
  const { ok, err, status } = await searchParams;
  const regs = await db.sisterRegistration.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 300 });
  await audit(u.id, "registrations.view", "SisterRegistration");
  const area = (id: string) => AREAS.find((a) => a.id === id)?.en ?? id;
  return (
    <Shell user={u}>
      <h1>Sisters&apos; registrations · داخلے</h1>
      <p className="lock">🔒 Private. Visible only to female sisters&apos; admins. Do not copy, screenshot or share this list. Each visit is logged.</p>
      <Msg ok={ok} err={err} />
      <div className="actions" style={{ margin: "12px 0" }}>
        {["", "NEW", "CONTACTED", "ENROLLED", "CLOSED"].map((s) => (
          <a key={s} className={`btn btn-s ${(status ?? "") === s ? "btn-p" : "btn-o"}`} href={`/admin/registrations${s ? `?status=${s}` : ""}`}>{s || "All"}</a>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Received</th><th>Name &amp; phone</th><th>Class wanted</th><th>Area</th><th>Pick &amp; drop</th><th>Notes</th><th>Status</th><th /></tr></thead>
          <tbody>
            {regs.map((r) => (
              <tr key={r.id}>
                <td>{fmt(r.createdAt)}</td>
                <td><b>{r.name}</b><br /><a href={`https://wa.me/${r.phone.replace(/^0/, "92").replace(/\D/g, "")}`} target="_blank" rel="noopener">{r.phone}</a></td>
                <td>{r.subject} · {r.level} · {r.mode}<br /><small>{r.ageGroup}{r.ageGroup === "girls" ? (r.guardianConsent ? " · guardian ✓" : " · guardian ✗") : ""}</small></td>
                <td>{area(r.area)}</td>
                <td>{r.needsTransport ? <><b>🚐 Yes</b>{r.pickupPoint ? <><br /><small>{r.pickupPoint}</small></> : null}</> : "—"}</td>
                <td>{r.notes}</td>
                <td>
                  <Badge v={r.status} />
                  <form action={setRegistrationStatus} className="actions" style={{ marginTop: 6 }}>
                    <input type="hidden" name="id" value={r.id} />
                    <select name="status" defaultValue={r.status} style={{ minHeight: 32, padding: 2 }}>
                      {["NEW", "CONTACTED", "ENROLLED", "CLOSED"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button className="btn btn-o btn-s">Set</button>
                  </form>
                </td>
                <td><form action={deleteRegistration}><input type="hidden" name="id" value={r.id} /><button className="btn btn-d btn-s" title="Delete">✕</button></form></td>
              </tr>
            ))}
            {regs.length === 0 && <tr><td colSpan={7}>No registrations.</td></tr>}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
