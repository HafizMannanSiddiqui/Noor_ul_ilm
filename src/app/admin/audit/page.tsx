import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { fmt, Shell } from "../_components/ui";

export const metadata = { title: "Activity log" };
export const dynamic = "force-dynamic";

/** Who did what (no personal data of registrants is shown here). */
export default async function Audit() {
  const u = await requireUser(can.manageUsers);
  const logs = await db.auditLog.findMany({ include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 300 });
  return (
    <Shell user={u}>
      <h1>Activity log · ریکارڈ</h1>
      <p className="sub">Last 300 actions, including every time private registrations were opened.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>When</th><th>Who</th><th>Action</th><th>Item</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}><td>{fmt(l.createdAt)}</td><td>{l.user?.name ?? "—"}</td><td><code>{l.action}</code></td><td>{l.entity} {l.entityId && <small>{l.entityId.slice(0, 10)}</small>}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
