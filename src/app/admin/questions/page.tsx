import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/roles";
import { answerQuestion, deleteQuestion } from "../_actions/content";
import { Badge, fmt, Msg, Shell, Tri } from "../_components/ui";

export const metadata = { title: "Youth Q&A" };

export default async function Questions({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.answerQuestions);
  const { ok, err } = await searchParams;
  const qs = await db.question.findMany({ orderBy: [{ published: "asc" }, { createdAt: "desc" }], take: 100 });
  return (
    <Shell user={u}>
      <h1>Youth Q&amp;A · سوال و جواب</h1>
      <p className="sub">Questions sent by young people. Write the question (cleaned up) and answer in each language, then publish.</p>
      <Msg ok={ok} err={err} />
      {qs.map((q) => {
        const row = { ...q, questionUr: q.questionUr || (q.lang === "ur" ? q.question : ""), questionEn: q.questionEn || (q.lang === "en" ? q.question : "") } as unknown as Record<string, unknown>;
        return (
          <details key={q.id} className="box" open={!q.published && !q.answerUr}>
            <summary><Badge v={q.published ? "APPROVED" : "NEW"} /> <b>{q.question.slice(0, 120)}</b> <small>· {fmt(q.createdAt)}</small></summary>
            <form className="f" action={answerQuestion} style={{ marginTop: 12 }}>
              <input type="hidden" name="id" value={q.id} />
              <Tri name="question" label="Question (as it will appear)" row={row} textarea required={false} />
              <Tri name="answer" label="Answer · جواب" row={row} textarea required={false} />
              <label className="check"><input type="checkbox" name="published" defaultChecked={q.published} /> Publish on the Youth page (with my name as reviewer)</label>
              <div className="actions"><button className="btn btn-p">Save</button></div>
            </form>
            <form action={deleteQuestion} style={{ marginTop: 8 }}><input type="hidden" name="id" value={q.id} /><button className="btn btn-d btn-s">Delete</button></form>
          </details>
        );
      })}
      {qs.length === 0 && <p>No questions yet.</p>}
    </Shell>
  );
}
