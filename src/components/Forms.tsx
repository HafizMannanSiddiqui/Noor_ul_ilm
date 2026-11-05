"use client";
import { useActionState } from "react";
import { askQuestion, joinCommunity, registerSister, type FormState } from "@/app/actions";
import { AREAS } from "@/content/site";
import { tr, type Lang } from "@/lib/lang";
import { getT, type StringKey, type TFn } from "@/lib/strings";

type Opt = [string, string];

function Select({ name, label, opts, required = true }: { name: string; label: string; opts: Opt[]; required?: boolean }) {
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      <select id={`f-${name}`} name={name} required={required} defaultValue={opts[0][0]}>
        {opts.map(([v, n]) => <option key={v} value={v} disabled={v === ""}>{n}</option>)}
      </select>
    </div>
  );
}
function Input({ name, label, type = "text", required = true, auto }: { name: string; label: string; type?: string; required?: boolean; auto?: string }) {
  const tel = type === "tel";
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      <input id={`f-${name}`} name={name} type={type} required={required} autoComplete={auto} minLength={tel ? 10 : 2} maxLength={tel ? 16 : 100}
        inputMode={tel ? "tel" : undefined} placeholder={tel ? "03XX XXXXXXX" : undefined} pattern={tel ? "[0-9+\\s\\-]{10,16}" : undefined} />
    </div>
  );
}
const Honeypot = () => (
  <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
);

function Done({ msg }: { msg: string }) {
  return (
    <div className="card form-done" role="status">
      <svg className="seal" viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="42" r="38" />
        <path d="M26 43l11 11 21-24" />
      </svg>
      <p style={{ fontWeight: 700 }}>{msg}</p>
    </div>
  );
}
function errorText(s: FormState, t: TFn) {
  if (s.ok || !s.error) return null;
  return <p className="form-err" role="alert">{s.error === "phone" ? t("phoneInvalid") : s.error === "invalid" ? t("formError") : t("formErrorGeneric")}</p>;
}
const areaOpts = (lang: Lang, t: TFn): Opt[] => [["", t("select")], ...AREAS.map((a): Opt => [a.id, tr(a, lang)])];
const init: FormState = { ok: false };

export function SisterForm({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const [state, action, pending] = useActionState(registerSister, init);
  if (state.ok) return <Done msg={t("sent")} />;
  const o = (keys: string[], prefix = ""): Opt[] => keys.map((k) => [k, t(`${prefix}${k}` as StringKey)]);
  return (
    <form className="card form" action={action} data-reveal>
      <Honeypot />
      <Input name="name" label={t("fName")} auto="name" />
      <Input name="phone" label={t("fPhone")} type="tel" auto="tel" />
      <Select name="ageGroup" label={t("ageGroup")} opts={[["", t("select")], ...o(["girls", "young", "women"], "age_")]} />
      <Select name="area" label={t("fArea")} opts={areaOpts(lang, t)} />
      <Select name="subject" label={t("fSubject")} opts={o(["quran", "tajweed", "fiqh", "seerat"], "subj_")} />
      <Select name="level" label={t("level")} opts={o(["beginner", "intermediate", "advanced"])} />
      <Select name="mode" label={t("mode")} opts={o(["online", "inperson"])} />
      <div className="field">
        <label htmlFor="f-notes">{t("fNotes")}</label>
        <textarea id="f-notes" name="notes" rows={2} maxLength={1000} />
      </div>
      <label className="check"><input type="checkbox" name="guardian" /> <span>{t("fGuardian")}</span></label>
      <p className="privacy">{t("sistersPrivacy")}</p>
      {errorText(state, t)}
      <button className="btn btn-green" type="submit" disabled={pending}>{pending ? t("sending") : t("submit")}</button>
    </form>
  );
}

export function JoinForm({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const [state, action, pending] = useActionState(joinCommunity, init);
  if (state.ok) return <Done msg={t("sent")} />;
  return (
    <form className="card form" action={action} data-reveal>
      <Honeypot />
      <Input name="name" label={t("fName")} auto="name" />
      <Input name="phone" label={t("fPhone")} type="tel" auto="tel" />
      <Select name="gender" label={t("fGender")} opts={[["", t("select")], ["M", t("brother")], ["F", t("sister")]]} />
      <Select name="area" label={t("fArea")} opts={areaOpts(lang, t)} />
      <Select name="role" label={t("fRole")} opts={[["", t("select")], ["vbrother", t("role_vbrother")], ["vsister", t("role_vsister")], ["student", t("role_student")], ["supporter", t("role_supporter")]]} />
      <div className="field">
        <label htmlFor="f-notes">{t("fNotes")}</label>
        <textarea id="f-notes" name="notes" rows={2} maxLength={1000} />
      </div>
      <p className="privacy">{t("joinPrivacy")}</p>
      {errorText(state, t)}
      <button className="btn btn-green" type="submit" disabled={pending}>{pending ? t("sending") : t("submit")}</button>
    </form>
  );
}

export function QuestionForm({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const [state, action, pending] = useActionState(askQuestion, init);
  if (state.ok) return <Done msg={t("qSent")} />;
  return (
    <form className="card form" action={action} data-reveal>
      <Honeypot />
      <input type="hidden" name="lang" value={lang} />
      <div className="field">
        <label htmlFor="f-question">{t("yourQuestion")}</label>
        <textarea id="f-question" name="question" rows={3} required minLength={8} maxLength={800} />
      </div>
      {errorText(state, t)}
      <button className="btn btn-green" type="submit" disabled={pending}>{pending ? t("sending") : t("askQ")}</button>
    </form>
  );
}
