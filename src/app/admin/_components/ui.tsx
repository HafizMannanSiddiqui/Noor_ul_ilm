import Link from "next/link";
import Logo from "@/components/Logo";
import type { SessionUser } from "@/lib/auth";
import { can, ROLE_LABEL } from "@/lib/roles";
import { logout } from "../_actions/auth";

/** Admin page frame with a sidebar that only shows sections the user may access. */
export function Shell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const links: ([string, string] | string)[] = ["Content · مواد", ["/admin", "Dashboard · ڈیش بورڈ"]];
  if (can.editPosts(user)) links.push(["/admin/posts", "Posts · مضامین"]);
  if (can.editTexts(user)) links.push(["/admin/texts", "Verses & Hadith · آیات و احادیث"]);
  if (can.answerQuestions(user)) links.push(["/admin/questions", "Youth Q&A · سوال و جواب"]);
  if (can.anyEvents(user)) links.push(["/admin/events", "Events · محافل"]);
  if (can.sistersSection(user)) {
    links.push("Sisters' section · بہنیں");
    links.push(["/admin/classes", "Classes · کلاسیں"], ["/admin/scholars", "Female scholars · عالمات"], ["/admin/registrations", "Registrations · داخلے"]);
  }
  if (can.sistersSection(user) || can.brothersSection(user)) links.push(["/admin/members", "Join requests · رکنیت"]);
  if (can.manageUsers(user)) links.push("Settings · ترتیبات", ["/admin/users", "Admin accounts · منتظمین"], ["/admin/audit", "Activity log · ریکارڈ"]);

  return (
    <div className="a-shell">
      <aside className="a-side">
        <Link className="a-brand" href="/admin">
          <Logo size={40} id="adm" animated={false} />
          <span>Noor-ul-Ilm<small>Admin panel</small></span>
        </Link>
        <nav>
          {links.map((l, i) => (typeof l === "string" ? <div key={i} className="sec">{l}</div> : <Link key={l[0]} href={l[0]}>{l[1]}</Link>))}
          <Link href="/ur" target="_blank">↗ View website · ویب سائٹ</Link>
        </nav>
        <div className="a-user">
          <div><b>{user.name}</b></div>
          <div>{user.roles.map((r) => ROLE_LABEL[r]).join(", ")}</div>
          <form action={logout}><button className="btn btn-o btn-s" type="submit">Sign out · لاگ آؤٹ</button></form>
        </div>
      </aside>
      <main className="a-main">{children}</main>
    </div>
  );
}

export const Badge = ({ v }: { v: string }) => <span className={`badge b-${v}`}>{v.replace("_", " ")}</span>;

export function Msg({ ok, err }: { ok?: string; err?: string }) {
  return (
    <>
      {ok && <p className="alert alert-ok">✓ {ok}</p>}
      {err && <p className="alert alert-err">{err}</p>}
    </>
  );
}

/** Three inputs for the same field in Urdu / English / Arabic (e.g. titleUr, titleEn, titleAr). */
export function Tri({ name, label, row, textarea, tall, required = true, help }: {
  name: string; label: string; row?: Record<string, unknown> | null; textarea?: boolean; tall?: boolean; required?: boolean; help?: string;
}) {
  const val = (s: string) => (row && typeof row[name + s] === "string" ? (row[name + s] as string) : "");
  const parts: [string, string, "rtl" | "ltr", boolean][] = [["Ur", "اردو", "rtl", required], ["En", "English", "ltr", required], ["Ar", "عربی (optional)", "rtl", false]];
  return (
    <fieldset className="tri">
      <legend>{label}</legend>
      {help && <p className="help" style={{ marginTop: 0 }}>{help}</p>}
      <div className={textarea ? "row" : "row row-3"}>
        {parts.map(([s, l, dir, req]) => (
          <div key={s}>
            <label className="l" htmlFor={name + s}>{l}</label>
            {textarea ? (
              <textarea id={name + s} name={name + s} dir={dir} defaultValue={val(s)} required={req} className={`${tall ? "tall" : ""} ${s === "Ar" ? "ar-font" : ""}`} />
            ) : (
              <input id={name + s} name={name + s} dir={dir} defaultValue={val(s)} required={req} className={s === "Ar" ? "ar-font" : ""} />
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export function Select({ name, label, value, opts }: { name: string; label: string; value?: string; opts: [string, string][] }) {
  return (
    <div>
      <label className="l" htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={value ?? opts[0]?.[0]} required>
        {opts.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
      </select>
    </div>
  );
}

export const fmt = (d: Date) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" }).format(d);
