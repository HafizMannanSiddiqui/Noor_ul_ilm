import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { AREAS } from "@/content/site";
import { deleteEvent, saveEvent } from "../../_actions/content";
import { Msg, Select, Shell, Tri } from "../../_components/ui";

export const metadata = { title: "Edit event" };

export default async function EditEvent({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.anyEvents);
  const { id } = await params;
  const { ok, err } = await searchParams;
  const e = id === "new" ? null : await db.event.findUnique({ where: { id } });
  if (id !== "new" && !e) notFound();
  if (e && !can.eventAudience(u, e.audience)) redirect("/admin/events?err=Not%20allowed");
  const audiences: [string, string][] = [
    ...(can.brothersSection(u) ? ([["all", "Everyone (separate arrangement for sisters)"], ["brothers", "Brothers only"]] as [string, string][]) : []),
    ...(can.sistersContent(u) ? ([["sisters", "Sisters only"]] as [string, string][]) : []),
  ];
  const row = e as unknown as Record<string, unknown> | null;

  return (
    <Shell user={u}>
      <p><Link href="/admin/events">← Events</Link></p>
      <h1>{e ? e.titleEn : "New event · نئی محفل"}</h1>
      <Msg ok={ok} err={err} />
      <form className="box f" action={saveEvent}>
        {e && <input type="hidden" name="id" value={e.id} />}
        <div className="row row-3">
          <Select name="type" label="Type · قسم" value={e?.type} opts={[["naat", "Mehfil-e-Naat"], ["dars", "Dars"], ["ijtima", "Ijtima"], ["milad", "Milad"], ["gyarwi", "Gyarhween Sharif"]]} />
          <Select name="area" label="Area of Lahore · علاقہ" value={e?.area} opts={AREAS.map((a) => [a.id, `${a.en} · ${a.ur}`])} />
          <Select name="audience" label="For · کن کے لیے" value={e?.audience} opts={audiences} />
        </div>
        <div className="row row-2">
          <div><label className="l" htmlFor="date">Date <small>leave empty for a repeating event</small></label><input id="date" name="date" type="date" defaultValue={e?.date} /></div>
          <label className="check" style={{ alignSelf: "end" }}><input type="checkbox" name="published" defaultChecked={e ? e.published : true} /> Show on website</label>
        </div>
        <Tri name="title" label="Title · عنوان" row={row} />
        <Tri name="time" label="Time (e.g. After Isha) · وقت" row={row} required={false} />
        <Tri name="venue" label="Venue · مقام" row={row} required={false} />
        <Tri name="recurring" label="Repeats (only if no date, e.g. Every Tuesday) · ہر ہفتے/مہینے" row={row} required={false} />
        <Tri name="speaker" label="Special talk by (optional) · خصوصی گفتگو" row={row} required={false} />
        <label className="check"><input type="checkbox" name="featured" defaultChecked={e?.featured ?? false} /> Featured: show as the big highlighted banner on the Home and Women's Corner pages (e.g. the monthly Dars) · نمایاں کریں</label>
        <div><button className="btn btn-p">Save · محفوظ کریں</button></div>
      </form>
      {e && <form action={deleteEvent}><input type="hidden" name="id" value={e.id} /><button className="btn btn-d btn-s">Delete event</button></form>}
    </Shell>
  );
}
