import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { AREAS } from "@/content/site";
import { Shell } from "../_components/ui";

export const metadata = { title: "Community" };
export const dynamic = "force-dynamic";

const ROLE: Record<string, string> = {
  follower: "Follower (updates only) · فالوور", vbrother: "Volunteer brother · رضاکار بھائی", vsister: "Volunteer sister · رضاکار بہن",
  student: "Student · طالب علم", supporter: "Supporter · معاون",
};
const HEARD: Record<string, string> = {
  whatsapp: "WhatsApp", family: "Family / friends · گھر والے", dars: "Dars / gathering · درس", masjid: "Masjid · مسجد",
  facebook: "Facebook / social", poster: "Poster · پوسٹر", other: "Other · دیگر", "": "Not answered",
};

function Bars({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="box">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {rows.length === 0 && <p className="sub">No data yet.</p>}
      {rows.map(([label, n]) => (
        <div className="cbar" key={label}>
          <span className="cbar-l">{label}</span>
          <span className="cbar-track"><span style={{ width: `${(n / max) * 100}%` }} /></span>
          <b>{n}</b>
        </div>
      ))}
    </div>
  );
}

/**
 * Who is joining and from where — counts only, no names.
 * Breakdowns cover only the sections this admin may see (sisters' details stay with female admins);
 * the overall total includes everyone.
 */
export default async function Community() {
  const u = await requireUser((x) => can.sistersSection(x) || can.brothersSection(x));
  const sections = [...(can.brothersSection(u) ? ["BROTHERS"] : []), ...(can.sistersSection(u) ? ["SISTERS"] : [])];
  const active = { status: { not: "CLOSED" } };
  const mine = { ...active, section: { in: sections } };

  const [total, rows] = await Promise.all([
    db.memberApplication.count({ where: active }),
    db.memberApplication.findMany({ where: mine, select: { area: true, city: true, role: true, heardFrom: true, createdAt: true } }),
  ]);

  const tally = (key: (r: (typeof rows)[number]) => string) => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(key(r), (m.get(key(r)) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const areaName = (id: string) => { const a = AREAS.find((x) => x.id === id); return a ? `${a.en} · ${a.ur}` : id; };
  const byArea = tally((r) => r.area).map(([k, n]): [string, number] => [areaName(k), n]);
  const byCity = tally((r) => (r.city.trim() ? r.city.trim().replace(/\b\w/g, (c) => c.toUpperCase()) : "Lahore (default) · لاہور")).slice(0, 15);
  const byRole = tally((r) => r.role).map(([k, n]): [string, number] => [ROLE[k] || k, n]);
  const byHeard = tally((r) => r.heardFrom).map(([k, n]): [string, number] => [HEARD[k] || k, n]);

  // Last 12 months, oldest first (Lahore time)
  const months: [string, number][] = [];
  const now = new Date(Date.now() + 5 * 3600_000);
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = d.toISOString().slice(0, 7);
    const n = rows.filter((r) => new Date(r.createdAt.getTime() + 5 * 3600_000).toISOString().slice(0, 7) === key).length;
    months.push([d.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }), n]);
  }
  const thisMonth = months[months.length - 1][1];

  return (
    <Shell user={u}>
      <h1>Community · کمیونٹی</h1>
      <p className="sub">Counts only — no names. Breakdowns show the <b>{sections.join(" + ").toLowerCase()}</b> section{sections.length > 1 ? "s" : ""} you are allowed to see.</p>
      <div className="stat-tiles">
        <div className="box"><span className="tile-n">{total}</span><span>Whole community (all sections) · کل ممبرز</span></div>
        <div className="box"><span className="tile-n">{rows.length}</span><span>In your section · آپ کا شعبہ</span></div>
        <div className="box"><span className="tile-n">{thisMonth}</span><span>Joined this month · اس ماہ</span></div>
        <div className="box"><span className="tile-n">{rows.filter((r) => r.role === "follower").length}</span><span>Followers (updates only) · فالوورز</span></div>
      </div>
      <Bars title="New members per month · ماہانہ اضافہ" rows={months} />
      <div className="grid-2a">
        <Bars title="Area of Lahore · علاقہ" rows={byArea} />
        <Bars title="City · شہر" rows={byCity} />
        <Bars title="How they joined · حیثیت" rows={byRole} />
        <Bars title="How they heard about us · ذریعہ" rows={byHeard} />
      </div>
      <p className="sub">Website visitors (countries, pages, devices): see <b>Analytics</b> in your Vercel project. · ویب سائٹ وزٹرز کی تفصیل Vercel میں۔</p>
    </Shell>
  );
}
