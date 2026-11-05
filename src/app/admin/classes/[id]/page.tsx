import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { deleteClass, saveClass } from "../../_actions/content";
import { Msg, Select, Shell, Tri } from "../../_components/ui";

export const metadata = { title: "Edit class" };

export default async function EditClass({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.sistersSection);
  const { id } = await params;
  const { ok, err } = await searchParams;
  const c = id === "new" ? null : await db.classSession.findUnique({ where: { id } });
  if (id !== "new" && !c) notFound();
  const scholars = await db.scholar.findMany({ orderBy: { sort: "asc" }, select: { id: true, nameEn: true } });
  const row = c as unknown as Record<string, unknown> | null;
  return (
    <Shell user={u}>
      <p><Link href="/admin/classes">← Classes</Link></p>
      <h1>{c ? "Edit class" : "New class · نئی کلاس"}</h1>
      <Msg ok={ok} err={err} />
      <form className="box f" action={saveClass}>
        {c && <input type="hidden" name="id" value={c.id} />}
        <div className="row row-4">
          <Select name="subject" label="Subject" value={c?.subject} opts={[["quran", "Dars-e-Quran"], ["tajweed", "Tajweed"], ["fiqh", "Basic Fiqh"], ["seerat", "Seerat"]]} />
          <Select name="level" label="Level" value={c?.level} opts={[["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"]]} />
          <Select name="ageGroup" label="Age group" value={c?.ageGroup} opts={[["girls", "Girls 13–17"], ["young", "Young women 18–30"], ["women", "Women 30+"]]} />
          <Select name="mode" label="Mode" value={c?.mode} opts={[["inperson", "In person"], ["online", "Online"], ["both", "Both"]]} />
        </div>
        <div className="row row-3">
          <Select name="teacherId" label="Teacher" value={c?.teacherId ?? ""} opts={[["", "—"], ...scholars.map((s): [string, string] => [s.id, s.nameEn])]} />
          <div><label className="l" htmlFor="sort">Order</label><input id="sort" name="sort" type="number" defaultValue={c?.sort ?? 0} /></div>
          <label className="check" style={{ alignSelf: "end" }}><input type="checkbox" name="active" defaultChecked={c ? c.active : true} /> Show on website</label>
        </div>
        <Tri name="when" label="When · وقت" row={row} />
        <Tri name="where" label="Where · مقام" row={row} />
        <div><button className="btn btn-p">Save</button></div>
      </form>
      {c && <form action={deleteClass}><input type="hidden" name="id" value={c.id} /><button className="btn btn-d btn-s">Delete class</button></form>}
    </Shell>
  );
}
