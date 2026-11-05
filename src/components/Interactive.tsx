"use client";
import { useEffect, useMemo, useState } from "react";
import { QUIZ } from "@/content/site";
import { tr, type Lang } from "@/lib/lang";
import { getT, type StringKey } from "@/lib/strings";

/* ---------- Youth quiz with progress bar and celebration ---------- */
export function Quiz({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  if (i >= QUIZ.length) {
    const bits = Array.from({ length: 18 }, (_, k) => ({ bx: `${Math.round(Math.cos(k) * 160)}px`, by: `${Math.round(Math.sin(k * 1.7) * 90 - 40)}px`, d: `${(k % 6) * 0.04}s` }));
    return (
      <div className="quiz-score">
        <div className="confetti" aria-hidden="true">
          {bits.map((b, k) => <i key={k} style={{ "--bx": b.bx, "--by": b.by, animationDelay: b.d, background: k % 2 ? "#1a7a57" : "#c9a23a" } as React.CSSProperties} />)}
        </div>
        <p className="muted">{t("score")}</p>
        <p className="big ltr">{score} / {QUIZ.length}</p>
        <button className="btn btn-green" type="button" onClick={() => { setI(0); setScore(0); setPicked(null); }}>{t("restart")}</button>
      </div>
    );
  }
  const q = QUIZ[i];
  return (
    <div>
      <div className="quiz-bar"><span style={{ width: `${(i / QUIZ.length) * 100}%` }} /></div>
      <p className="muted">{t("question")} <span className="ltr">{i + 1}/{QUIZ.length}</span></p>
      <p className="quiz-q">{tr(q.q, lang)}</p>
      <div className="quiz-opts">
        {q.options.map((o, k) => (
          <button key={k} type="button" disabled={picked !== null}
            className={picked === null ? "" : k === q.answer ? "right" : k === picked ? "wrong" : ""}
            onClick={() => { setPicked(k); if (k === q.answer) setScore((s) => s + 1); }}>
            {tr(o, lang)}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div style={{ marginTop: 12 }} aria-live="polite">
          <p style={{ fontWeight: 700 }}>{picked === q.answer ? t("correct") : `${t("wrong")} ${tr(q.options[q.answer], lang)}`}</p>
          <button className="btn btn-green btn-small" type="button" autoFocus onClick={() => { setI(i + 1); setPicked(null); }}>{t("nextQ")}</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Women's Corner class browser with filters ---------- */
export type ClassView = { id: string; subject: string; level: string; ageGroup: string; mode: string; when: string; where: string; teacher: string };

export function ClassBrowser({ lang, classes }: { lang: Lang; classes: ClassView[] }) {
  const t = getT(lang);
  const [f, setF] = useState({ level: "all", ageGroup: "all", mode: "all" });
  const list = useMemo(() => classes.filter((c) =>
    (f.level === "all" || c.level === f.level) &&
    (f.ageGroup === "all" || c.ageGroup === f.ageGroup) &&
    (f.mode === "all" || c.mode === f.mode || c.mode === "both")), [classes, f]);
  const sel = (key: keyof typeof f, label: StringKey, opts: string[], prefix = "") => (
    <div className="field">
      <label htmlFor={`flt-${key}`}>{t(label)}</label>
      <select id={`flt-${key}`} value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}>
        <option value="all">{t("all")}</option>
        {opts.map((o) => <option key={o} value={o}>{t(`${prefix}${o}` as StringKey)}</option>)}
      </select>
    </div>
  );
  return (
    <>
      <div className="filter-row" data-reveal>
        {sel("level", "level", ["beginner", "intermediate", "advanced"])}
        {sel("ageGroup", "ageGroup", ["girls", "young", "women"], "age_")}
        {sel("mode", "mode", ["online", "inperson"])}
      </div>
      <div className="grid grid-3">
        {list.length === 0 && <p className="muted">{t("noItems")}</p>}
        {list.map((c) => (
          <article key={c.id} className="card hover card-gold" style={{ animation: "fadeUp .45s var(--ease) both" }}>
            <h3>{t(`subj_${c.subject}` as StringKey)}</h3>
            <span className="pill">{t(c.level as StringKey)}</span>
            <span className="pill">{t(`age_${c.ageGroup}` as StringKey)}</span>
            <span className="pill pill-gold">{t(c.mode as StringKey)}</span>
            <p className="muted" style={{ marginTop: 8 }}>🕒 {c.when}</p>
            <p className="muted">📍 {c.where}</p>
            {c.teacher && <p className="muted">{t("teacher")}: {c.teacher}</p>}
          </article>
        ))}
      </div>
    </>
  );
}

/* ---------- Small helpers ---------- */
export function CopyButton({ value, lang }: { value: string; lang: Lang }) {
  const t = getT(lang);
  const [done, setDone] = useState(false);
  return (
    <button className="btn btn-green btn-small" type="button" onClick={() => {
      navigator.clipboard?.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1800); }, () => {});
    }}>{done ? `✓ ${t("copied")}` : t("copy")}</button>
  );
}

export function MapLoader({ query, title, lang }: { query: string; title: string; lang: Lang }) {
  const t = getT(lang);
  const [show, setShow] = useState(false);
  return (
    <div className="map-box">
      {show ? (
        <iframe title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`} />
      ) : (
        <div>
          <p className="muted">{t("mapNote")}</p>
          <button className="btn btn-green" type="button" onClick={() => setShow(true)}>{t("loadMap")}</button>
        </div>
      )}
    </div>
  );
}

/** Thin gold bar at the top showing how far the reader has scrolled. */
export function ReadProgress() {
  useEffect(() => {
    const el = document.getElementById("read-progress");
    const on = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      el?.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div id="read-progress" className="read-progress" aria-hidden="true" />;
}
