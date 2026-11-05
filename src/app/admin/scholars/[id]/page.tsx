import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { deleteScholar, saveScholar } from "../../_actions/content";
import { Msg, Shell, Tri } from "../../_components/ui";

export const metadata = { title: "Edit scholar profile" };

export default async function EditScholar({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.sistersContent);
  const { id } = await params;
  const { ok, err } = await searchParams;
  const s = id === "new" ? null : await db.scholar.findUnique({ where: { id } });
  if (id !== "new" && !s) notFound();
  const row = s as unknown as Record<string, unknown> | null;
  return (
    <Shell user={u}>
      <p><Link href="/admin/scholars">← Female scholars</Link></p>
      <h1>{s ? s.nameEn : "New profile"}</h1>
      <p className="lock">No photos — text only, unless written permission is on file. · تصویر شامل نہ کریں۔</p>
      <Msg ok={ok} err={err} />
      <form className="box f" action={saveScholar} style={{ marginTop: 12 }}>
        {s && <input type="hidden" name="id" value={s.id} />}
        <Tri name="name" label="Name · نام" row={row} />
        <Tri name="title" label="Title (Aalimah, Muballighah, Qariah…) · لقب" row={row} required={false} />
        <Tri name="subjects" label="Subjects · مضامین" row={row} required={false} />
        <Tri name="bio" label="Short bio · تعارف" row={row} textarea required={false} />
        <div className="row row-2">
          <div><label className="l" htmlFor="sort">Order</label><input id="sort" name="sort" type="number" defaultValue={s?.sort ?? 0} /></div>
          <label className="check" style={{ alignSelf: "end" }}><input type="checkbox" name="active" defaultChecked={s ? s.active : true} /> Show on website</label>
        </div>
        <div><button className="btn btn-p">Save</button></div>
      </form>
      {s && <form action={deleteScholar}><input type="hidden" name="id" value={s.id} /><button className="btn btn-d btn-s">Delete profile</button></form>}
    </Shell>
  );
}
