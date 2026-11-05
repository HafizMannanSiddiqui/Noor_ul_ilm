import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { SHOW_DRAFTS } from "@/lib/settings";
import { Shell } from "./_components/ui";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const u = await requireUser();
  const { denied } = await searchParams;
  const tiles: { href: string; n: number; label: string }[] = [];
  if (can.approvePosts(u)) tiles.push({ href: "/admin/posts?status=PENDING_REVIEW", n: await db.post.count({ where: { status: "PENDING_REVIEW" } }), label: "Posts waiting for your review · نظرِ ثانی کے منتظر" });
  if (can.editPosts(u)) tiles.push({ href: "/admin/posts", n: await db.post.count({ where: { status: "APPROVED" } }), label: "Published posts · شائع شدہ مضامین" });
  if (can.verifyTexts(u)) tiles.push({ href: "/admin/texts", n: await db.sacredText.count({ where: { verified: false } }), label: "Verses/Hadith to verify · تصدیق باقی" });
  if (can.answerQuestions(u)) tiles.push({ href: "/admin/questions", n: await db.question.count({ where: { published: false } }), label: "Unanswered questions · جواب باقی" });
  if (can.sistersSection(u)) tiles.push({ href: "/admin/registrations", n: await db.sisterRegistration.count({ where: { status: "NEW" } }), label: "New sisters' registrations · نئے داخلے" });
  if (can.sistersSection(u)) tiles.push({ href: "/admin/members", n: await db.memberApplication.count({ where: { section: "SISTERS", status: "NEW" } }), label: "New sisters' join requests" });
  if (can.brothersSection(u)) tiles.push({ href: "/admin/members", n: await db.memberApplication.count({ where: { section: "BROTHERS", status: "NEW" } }), label: "New brothers' join requests · نئی درخواستیں" });
  if (can.anyEvents(u)) tiles.push({ href: "/admin/events", n: await db.event.count({ where: { published: true } }), label: "Events listed · محافل" });

  return (
    <Shell user={u}>
      <h1>Assalamu Alaikum, {u.name}</h1>
      <p className="sub ur" dir="rtl">السلام علیکم — آج کیا کرنا ہے؟</p>
      {denied && <p className="alert alert-err">You don&apos;t have permission for that section. · آپ کو اس حصے کی اجازت نہیں۔</p>}
      {SHOW_DRAFTS && <p className="alert alert-info">Preview mode is ON: unapproved posts and unverified texts are visible on the website with a &ldquo;Draft&rdquo; warning. Set <code>SHOW_DRAFTS=&quot;false&quot;</code> in <code>.env</code> before launch.</p>}
      <div className="tiles">
        {tiles.map((t) => (
          <Link key={t.label} className="tile" href={t.href}><b>{t.n}</b><span>{t.label}</span></Link>
        ))}
      </div>
      <h2>Quick start · فوری رہنمائی</h2>
      <div className="box">
        <ul>
          {can.editPosts(u) && <li><Link href="/admin/posts/new">Write a new post</Link> → &ldquo;Send for review&rdquo; → a scholar approves → it appears on the site.</li>}
          {can.anyEvents(u) && <li><Link href="/admin/events/new">Add an event</Link> (Mehfil-e-Naat, Dars, Ijtima, Milad…).</li>}
          {can.sistersContent(u) && <li><Link href="/admin/classes/new">Add a class</Link> for the Women&apos;s Corner · <Link href="/admin/scholars/new">Add a female scholar</Link>.</li>}
          {can.manageUsers(u) && <li><Link href="/admin/settings">Site settings</Link>: phone numbers, donation accounts, team, WhatsApp community link, Ayah of the Day list.</li>}
          <li>Full instructions: <code>ADMIN-GUIDE.md</code> (Urdu &amp; English).</li>
        </ul>
      </div>
    </Shell>
  );
}
