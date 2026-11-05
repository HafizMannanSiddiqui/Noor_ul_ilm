import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { deleteText, saveText, verifyText } from "../../_actions/content";
import { fmt, Msg, Select, Shell } from "../../_components/ui";

export const metadata = { title: "Edit verse / hadith" };

export default async function EditText({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.editTexts);
  const { id } = await params;
  const { ok, err } = await searchParams;
  const x = id === "new" ? null : await db.sacredText.findUnique({ where: { id }, include: { verifier: { select: { name: true } } } });
  if (id !== "new" && !x) notFound();

  return (
    <Shell user={u}>
      <p><Link href="/admin/texts">← Verses &amp; Hadith</Link></p>
      <h1>{x ? x.key : "Add verse / hadith"}</h1>
      <Msg ok={ok} err={err} />
      {x && (
        <div className="box">
          {x.verified
            ? <p className="alert alert-ok" style={{ margin: 0 }}>✓ Verified by {x.verifier?.name} on {fmt(x.verifiedAt!)}</p>
            : <p className="lock">Not verified yet. Shown on the website only while preview mode is on, with a warning.</p>}
          {can.verifyTexts(u) && (
            <form action={verifyText} className="actions" style={{ marginTop: 10 }}>
              <input type="hidden" name="id" value={x.id} />
              {x.verified
                ? <button className="btn btn-o" name="verified" value="0">Remove verification</button>
                : <button className="btn btn-p" name="verified" value="1">✓ I have checked this against verified sources · تصدیق کرتا/کرتی ہوں</button>}
            </form>
          )}
        </div>
      )}
      <form className="box f" action={saveText}>
        {x && <input type="hidden" name="id" value={x.id} />}
        <div className="row row-2">
          <div><label className="l" htmlFor="key">Key <small>used in posts, e.g. baqarah-286</small></label><input id="key" name="key" defaultValue={x?.key} required /></div>
          <Select name="kind" label="Type" value={x?.kind} opts={[["AYAH", "Quranic verse · آیت"], ["HADITH", "Hadith · حدیث"]]} />
        </div>
        <div><label className="l" htmlFor="arabic">Arabic (Uthmani, full tashkeel) · عربی متن</label><textarea id="arabic" name="arabic" dir="rtl" className="ar-font" style={{ fontSize: "1.4rem" }} defaultValue={x?.arabic} required /></div>
        <div><label className="l" htmlFor="ur">Urdu — Kanz-ul-Iman (for verses) · اردو ترجمہ</label><textarea id="ur" name="ur" dir="rtl" defaultValue={x?.ur} required /></div>
        <div><label className="l" htmlFor="en">English translation</label><textarea id="en" name="en" defaultValue={x?.en} required /></div>
        <div className="row row-3">
          <div><label className="l" htmlFor="refUr">Reference (Urdu)</label><input id="refUr" name="refUr" dir="rtl" defaultValue={x?.refUr} placeholder="سورۃ العلق 96:1" required /></div>
          <div><label className="l" htmlFor="refEn">Reference (English)</label><input id="refEn" name="refEn" defaultValue={x?.refEn} placeholder="Surah Al-Alaq 96:1 / Sahih al-Bukhari, 3" required /></div>
          <div><label className="l" htmlFor="refAr">Reference (Arabic)</label><input id="refAr" name="refAr" dir="rtl" className="ar-font" defaultValue={x?.refAr} /></div>
        </div>
        <div><label className="l" htmlFor="grading">Hadith grading (as advised by your scholar)</label><input id="grading" name="grading" defaultValue={x?.grading} /></div>
        <div className="actions">
          <label className="check"><input type="checkbox" name="partial" defaultChecked={x?.partial} /> Part of a verse</label>
          <label className="check"><input type="checkbox" name="showOnHome" defaultChecked={x?.showOnHome} /> Show in &ldquo;Ayah/Hadith of the Day&rdquo;</label>
        </div>
        <div><button className="btn btn-p">Save · محفوظ کریں</button></div>
      </form>
      {x && can.verifyTexts(u) && (
        <form action={deleteText}><input type="hidden" name="id" value={x.id} /><button className="btn btn-d btn-s">Delete</button></form>
      )}
    </Shell>
  );
}
