import type { Metadata } from "next";
import { PageHead, Section } from "@/components/Cards";
import { QuestionForm } from "@/components/Forms";
import { Quiz } from "@/components/Interactive";
import { STORIES } from "@/content/site";
import { db } from "@/lib/db";
import { pick, tr } from "@/lib/lang";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { SHOW_DRAFTS } from "@/lib/settings";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("youthTitle") };
}

export default async function Youth({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  const questions = await db.question.findMany({
    where: SHOW_DRAFTS ? { OR: [{ published: true }, { questionUr: { not: "" } }] } : { published: true },
    include: { answerer: { select: { name: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const stories = STORIES.filter((s) => SHOW_DRAFTS || s.verified);

  return (
    <>
      <PageHead title={t("youthTitle")} intro={t("youthIntro")} />
      <Section title={t("quiz")} narrow><div className="card card-gold" {...reveal()}><Quiz lang={lang} /></div></Section>
      <Section title={t("stories")}>
        <div className="grid grid-2">
          {stories.map((s, i) => (
            <article key={i} className="card hover card-gold" {...reveal(i * 0.1)}>
              <h3>{tr(s.title, lang)}</h3>
              <p>{tr(s.text, lang)}</p>
              {!s.verified && <p className="warn">{t("draft")}</p>}
            </article>
          ))}
        </div>
      </Section>
      <Section title={t("qa")}>
        <div className="item-list">
          {questions.map((q, i) => {
            const answer = q.published ? pick(q, "answer", lang) : "";
            return (
              <details key={q.id} className="card" {...reveal(i * 0.05)}>
                <summary><strong>{pick(q, "question", lang) || q.question}</strong></summary>
                <p>{answer || <span className="muted">{t("answerPending")}</span>}</p>
                {answer && q.answerer && <p className="muted">{t("reviewedBy")} {q.answerer.title} {q.answerer.name}</p>}
              </details>
            );
          })}
        </div>
        <h3 style={{ marginTop: 24, color: "var(--green-800)" }}>{t("askQ")}</h3>
        <QuestionForm lang={lang} />
      </Section>
    </>
  );
}
