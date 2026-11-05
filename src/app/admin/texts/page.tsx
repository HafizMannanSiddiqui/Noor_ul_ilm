import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { Badge, Msg, Shell } from "../_components/ui";

export const metadata = { title: "Verses & Hadith" };

export default async function Texts({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.editTexts);
  const { ok, err } = await searchParams;
  const texts = await db.sacredText.findMany({ include: { verifier: { select: { name: true } } }, orderBy: [{ kind: "asc" }, { key: "asc" }] });
  return (
    <Shell user={u}>
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <div><h1>Verses &amp; Hadith · آیات و احادیث</h1><p className="sub">The single source for every verse and hadith on the site. Editing the text removes its verification.</p></div>
        <Link className="btn btn-p" href="/admin/texts/new">+ Add · نیا</Link>
      </div>
      <Msg ok={ok} err={err} />
      <div className="help" style={{ marginBottom: 12 }}>
        Arabic: copy the Uthmani text with full tashkeel from a verified Mushaf (e.g. tanzil.net). Urdu: copy word-for-word from <b>Kanz-ul-Iman</b>. Hadith: book and number. Never type from memory.
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Key</th><th>Type</th><th>Reference</th><th>Arabic</th><th>Verified</th><th>Home</th></tr></thead>
          <tbody>
            {texts.map((x) => (
              <tr key={x.id}>
                <td><Link href={`/admin/texts/${x.id}`}><code>{x.key}</code></Link></td>
                <td>{x.kind}</td>
                <td>{x.refEn}</td>
                <td className="ar-font" dir="rtl" style={{ fontSize: "1.1rem" }}>{x.arabic.slice(0, 60)}</td>
                <td>{x.verified ? <><Badge v="yes" /> {x.verifier?.name}</> : <Badge v="no" />}</td>
                <td>{x.showOnHome ? "★" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
