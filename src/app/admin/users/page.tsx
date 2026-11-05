import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can, parseRoles, ROLE_LABEL, ROLES } from "@/lib/roles";
import { createUser, updateUser } from "../_actions/content";
import { Badge, Msg, Shell } from "../_components/ui";

export const metadata = { title: "Admin accounts" };

function RoleBoxes({ current = [] as string[] }) {
  return (
    <div className="actions">
      {ROLES.map((r) => (
        <label key={r} className="check" style={{ fontWeight: 400 }}><input type="checkbox" name={`role_${r}`} defaultChecked={current.includes(r)} /> {ROLE_LABEL[r]}</label>
      ))}
    </div>
  );
}

export default async function Users({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.manageUsers);
  const { ok, err } = await searchParams;
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <Shell user={u}>
      <h1>Admin accounts · منتظمین</h1>
      <p className="sub">Privacy rule: the <b>Sisters&apos; admin</b> role can only be given to a woman. Super admins cannot see sisters&apos; data.</p>
      <Msg ok={ok} err={err} />
      <h2>Create account</h2>
      <form className="box f" action={createUser}>
        <div className="row row-4">
          <div><label className="l" htmlFor="n-name">Name</label><input id="n-name" name="name" required /></div>
          <div><label className="l" htmlFor="n-email">Email</label><input id="n-email" name="email" type="email" required /></div>
          <div><label className="l" htmlFor="n-title">Title <small>(Mufti, Aalimah…)</small></label><input id="n-title" name="title" /></div>
          <div><label className="l" htmlFor="n-gender">Gender</label><select id="n-gender" name="gender"><option value="M">Male</option><option value="F">Female</option></select></div>
        </div>
        <RoleBoxes />
        <div className="row row-2">
          <div><label className="l" htmlFor="n-pw">Temporary password <small>(10+ characters — share privately)</small></label><input id="n-pw" name="password" type="text" minLength={10} required autoComplete="new-password" /></div>
          <div style={{ alignSelf: "end" }}><button className="btn btn-p">Create</button></div>
        </div>
      </form>
      <h2>Existing accounts</h2>
      {users.map((x) => (
        <details key={x.id} className="box">
          <summary><b>{x.name}</b> · {x.email} · {x.gender === "F" ? "Female" : "Male"} · {parseRoles(x.roles).join(", ")} <Badge v={x.active ? "yes" : "no"} /></summary>
          <form className="f" action={updateUser} style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={x.id} />
            <input type="hidden" name="email" value={x.email} />
            <div className="row row-3">
              <div><label className="l">Name</label><input name="name" defaultValue={x.name} required /></div>
              <div><label className="l">Title</label><input name="title" defaultValue={x.title} /></div>
              <div><label className="l">Gender</label><select name="gender" defaultValue={x.gender}><option value="M">Male</option><option value="F">Female</option></select></div>
            </div>
            <RoleBoxes current={parseRoles(x.roles)} />
            <div className="row row-2">
              <div><label className="l">New password <small>(leave empty to keep)</small></label><input name="password" type="text" minLength={10} autoComplete="new-password" /></div>
              <label className="check" style={{ alignSelf: "end" }}><input type="checkbox" name="active" defaultChecked={x.active} /> Account active</label>
            </div>
            <div><button className="btn btn-p">Update</button></div>
          </form>
        </details>
      ))}
    </Shell>
  );
}
