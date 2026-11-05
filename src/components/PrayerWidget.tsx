"use client";
import { useEffect, useState } from "react";
import { computePrayerTimes, PRAYER_ORDER, type PrayerKey } from "@/lib/prayer";
import { PRAYER } from "@/content/site";
import { getT } from "@/lib/strings";
import type { Lang } from "@/lib/lang";

const DAY = 1440;
/** Lahore wall-clock (UTC+5, no DST) as {y,m,d, minutes, seconds}. */
function lahoreNow() {
  const n = new Date(Date.now() + PRAYER.timezone * 3600_000);
  return { y: n.getUTCFullYear(), m: n.getUTCMonth() + 1, d: n.getUTCDate(), min: n.getUTCHours() * 60 + n.getUTCMinutes(), sec: n.getUTCSeconds() };
}
const fmt = (mins: number, lang: Lang) => {
  const h = Math.floor(mins / 60), m = mins % 60;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${lang === "en" ? (h >= 12 ? " PM" : " AM") : ""}`;
};

/** Live prayer times with a countdown ring to the next prayer. Rendered after mount (uses the visitor's clock). */
export default function PrayerWidget({ lang }: { lang: Lang }) {
  const t = getT(lang);
  const [now, setNow] = useState<ReturnType<typeof lahoreNow> | null>(null);
  useEffect(() => {
    setNow(lahoreNow());
    const id = setInterval(() => setNow(lahoreNow()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div style={{ minHeight: 230 }} aria-busy="true" />;

  const times = computePrayerTimes(now.y, now.m, now.d, PRAYER);
  const salah = PRAYER_ORDER.filter((k) => k !== "sunrise");
  const cur = now.min + now.sec / 60;
  let next: PrayerKey = salah.find((k) => times[k] > cur) || "fajr";
  const nextAt = times[next] > cur ? times[next] : times.fajr + DAY;
  const prevKey = [...salah].reverse().find((k) => times[k] <= cur) || "isha";
  const prevAt = times[prevKey] <= cur ? times[prevKey] : times.isha - DAY;
  const span = nextAt - prevAt || 1;
  const progress = Math.min(1, Math.max(0, (cur - prevAt) / span));
  const left = Math.max(0, Math.round((nextAt - cur) * 60));
  const hh = Math.floor(left / 3600), mm = Math.floor((left % 3600) / 60), ss = left % 60;
  const C = 2 * Math.PI * 48;
  if (times[next] <= cur) next = "fajr";

  return (
    <div>
      <div className="prayer-top">
        <div className="ring" role="timer" aria-label={`${t("untilNext")}: ${t(next)}`}>
          <svg viewBox="0 0 112 112">
            <defs>
              <linearGradient id="ringGold" x1="0" x2="1">
                <stop offset="0" stopColor="#e6c66d" />
                <stop offset="1" stopColor="#a8841f" />
              </linearGradient>
            </defs>
            <circle className="track" cx="56" cy="56" r="48" />
            <circle className="prog" cx="56" cy="56" r="48" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
          </svg>
          <div className="ring-center">
            <span className="nm">{t(next)}</span>
            <span className="cd">{`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`}</span>
          </div>
        </div>
        <div>
          <strong>{t("untilNext")}</strong>
          <div className="muted">{t(next)} · <span className="ltr">{fmt(times[next], lang)}</span></div>
        </div>
      </div>
      <ul className="prayer-list">
        {PRAYER_ORDER.map((k) => (
          <li key={k} className={`${k === next ? "is-next" : ""}${k === "sunrise" ? " is-sun" : ""}`}>
            <span className="pn">{t(k)}{k === next ? ` · ${t("next")}` : ""}</span>
            <span className="pt">{fmt(times[k], lang)}</span>
          </li>
        ))}
      </ul>
      <p className="muted" style={{ marginTop: 10 }}>{t("prayerNote")}</p>
    </div>
  );
}
