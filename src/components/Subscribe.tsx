"use client";
import { startTransition, useActionState, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { subscribeCommunity, type FormState } from "@/app/actions";
import { LAHORE, LAHORE_AREAS, PK_CITIES, type Place } from "@/content/places";
import type { Lang } from "@/lib/lang";
import { getT } from "@/lib/strings";

const OTHER = "__other__";
const norm = (s: string) => s.toLowerCase().replace(/[\s\-.()/]+/g, "");

/** Searchable list (Urdu or English) with an "Other — type it" choice. Submits the English name or the typed text. */
function PlacePicker({ name, label, places, lang, onPick, placeholder }: {
  name: string; label: string; places: Place[]; lang: Lang; onPick?: (v: string) => void; placeholder: string;
}) {
  const t = getT(lang);
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [other, setOther] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [hi, setHi] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const show = (p: Place) => (lang === "en" ? p.en : `${p.ur} · ${p.en}`);

  const list = useMemo(() => {
    const n = norm(q);
    const hits = n ? places.filter((p) => norm(p.en).includes(n) || norm(p.ur).includes(n)) : places;
    return [...hits.map((p) => ({ v: p.en, text: show(p) })), { v: OTHER, text: `✎ ${t("otherType")}` }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, places, lang]);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function choose(v: string) {
    setOpen(false);
    if (v === OTHER) { setOther(true); setValue(""); setQ(t("otherType")); onPick?.(""); return; }
    const p = places.find((x) => x.en === v)!;
    setOther(false); setValue(v); setQ(show(p)); onPick?.(v);
  }

  return (
    <div className="field picker" ref={box}>
      <label htmlFor={`${id}-q`}>{label}</label>
      <input
        id={`${id}-q`} type="search" role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-autocomplete="list"
        autoComplete="off" placeholder={placeholder} value={q} required={!other}
        onChange={(e) => { setQ(e.target.value); setValue(""); setOther(false); setOpen(true); setHi(0); onPick?.(""); }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Typed without picking: an exact name selects it; anything else counts as "Other".
          if (value || other || !q.trim()) return;
          const exact = places.find((p) => norm(p.en) === norm(q) || norm(p.ur) === norm(q));
          if (exact) choose(exact.en);
          else { setOther(true); setOtherText(q.trim()); onPick?.(q.trim()); }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHi((h) => Math.min(h + 1, list.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
          else if (e.key === "Enter" && open) { e.preventDefault(); choose(list[hi].v); }
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && (
        <ul className="picker-list" id={`${id}-list`} role="listbox">
          {list.map((o, i) => (
            <li key={o.v} role="option" aria-selected={i === hi} className={[i === hi ? "hi" : "", o.v === OTHER ? "other" : ""].join(" ").trim()}
              onMouseDown={(e) => { e.preventDefault(); choose(o.v); }} onMouseEnter={() => setHi(i)}>{o.text}</li>
          ))}
        </ul>
      )}
      {other && (
        <input className="picker-other" aria-label={label} placeholder={t("typeName")} value={otherText} required maxLength={60}
          onChange={(e) => { setOtherText(e.target.value); onPick?.(e.target.value); }} autoFocus />
      )}
      <input type="hidden" name={name} value={other ? otherText : value} />
    </div>
  );
}

function SubscribeForm({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const t = getT(lang);
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeCommunity, { ok: false });
  const [city, setCity] = useState("");
  const isLahore = city === LAHORE.en;

  if (state.ok) {
    return (
      <div className="form-done" role="status">
        <svg className="seal" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="38" /><path d="M26 43l11 11 21-24" /></svg>
        <p>{t("subscribed")}</p>
        <button type="button" className="btn btn-green btn-small" onClick={onDone}>{t("close")}</button>
      </div>
    );
  }
  const err = state.error === "phone" ? t("phoneInvalid") : state.error === "invalid" ? t("formError") : state.error ? t("formErrorGeneric") : "";
  return (
    <form className="form sub-form" onSubmit={(e) => {
      // Submit without React's automatic form reset, so typed details stay if something needs fixing.
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      startTransition(() => action(fd));
    }}>
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="field"><label htmlFor="s-name">{t("fName")}</label><input id="s-name" name="name" required minLength={2} maxLength={100} autoComplete="name" /></div>
      <div className="row-2">
        <div className="field"><label htmlFor="s-age">{t("fAge")}</label><input id="s-age" name="age" type="number" inputMode="numeric" min={5} max={110} required /></div>
        <div className="field">
          <label htmlFor="s-gender">{t("fGender")}</label>
          <select id="s-gender" name="gender" required defaultValue=""><option value="" disabled>{t("select")}</option><option value="M">{t("brother")}</option><option value="F">{t("sister")}</option></select>
        </div>
      </div>
      <div className="field"><label htmlFor="s-phone">{t("fPhone")}</label><input id="s-phone" name="phone" type="tel" inputMode="tel" required placeholder="03XX XXXXXXX" pattern="[0-9+\s\-]{10,16}" autoComplete="tel" /></div>
      <PlacePicker name="city" label={t("fCityAll")} places={PK_CITIES} lang={lang} onPick={setCity} placeholder={t("searchCity")} />
      {isLahore && <PlacePicker name="area" label={t("fArea")} places={LAHORE_AREAS} lang={lang} placeholder={t("searchArea")} />}
      <p className="privacy">{t("subPrivacy")}</p>
      {err && <p className="form-err" role="alert">{err}</p>}
      <button className="btn btn-gold" type="submit" disabled={pending}>{pending ? t("sending") : `🔔 ${t("subscribeNow")}`}</button>
    </form>
  );
}

/** The subscribe-style badge on the home page; opens the Subscribe form in a dialog. */
export default function SubscribeBadge({ lang, count, title, members, cta, href }: {
  lang: Lang; count: string; title: string; members: string; cta: string; href: string;
}) {
  const t = getT(lang);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <a className="sub-badge rise" href={href} style={{ "--d": ".3s" } as React.CSSProperties}
        onClick={(e) => { e.preventDefault(); setOpen(true); }}>
        <span className="sub-avatar" aria-hidden="true">🔔</span>
        <span className="sub-text">
          <b>{title}</b>
          {count !== "0" && <small><span className="sub-count">{count}</span> {members}</small>}
        </span>
        <span className="sub-btn">{cta}</span>
      </a>
      {/* Rendered at <body> level so it covers the header and tab bar and uses normal text colours. */}
      {open && createPortal(
        <div className="share-modal" role="dialog" aria-modal="true" aria-labelledby="sub-title" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="share-sheet sub-sheet" dir={lang === "en" ? "ltr" : "rtl"}>
            <button type="button" className="sub-close" aria-label={t("close")} onClick={() => setOpen(false)}>✕</button>
            <h2 id="sub-title">🔔 {title}</h2>
            <p className="muted">{t("subIntro")}</p>
            <SubscribeForm lang={lang} onDone={() => setOpen(false)} />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
