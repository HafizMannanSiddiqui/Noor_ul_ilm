/** Prayer-time calculation (standard astronomical method, after PrayTimes.org).
 *  Karachi method (Fajr/Isha 18°) with Hanafi Asr (shadow factor 2).
 *  Returns minutes after local midnight. */
export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
export const PRAYER_ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

export type PrayerSettings = {
  lat: number; lng: number; timezone: number;
  fajrAngle: number; ishaAngle: number; asrFactor: number;
  adjust: Record<PrayerKey, number>;
};

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const sin = (d: number) => Math.sin(rad(d));
const cos = (d: number) => Math.cos(rad(d));
const tan = (d: number) => Math.tan(rad(d));
const fix = (a: number, b: number) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };

function julian(y: number, m: number, d: number) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}
function sunPos(jd: number) {
  const D = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * sin(g) + 0.02 * sin(2 * g), 360);
  const e = 23.439 - 0.00000036 * D;
  const RA = deg(Math.atan2(cos(e) * sin(L), cos(L))) / 15;
  return { decl: deg(Math.asin(sin(e) * sin(L))), eqt: q / 15 - fix(RA, 24) };
}

export function computePrayerTimes(y: number, m: number, d: number, o: PrayerSettings): Record<PrayerKey, number> {
  const { lat, lng, timezone } = o;
  const jDate = julian(y, m, d) - lng / (15 * 24);
  const mid = (t: number) => fix(12 - sunPos(jDate + t / 24).eqt, 24);
  const angleTime = (angle: number, t: number, ccw = false) => {
    const s = sunPos(jDate + t / 24);
    const T = deg(Math.acos((-sin(angle) - sin(s.decl) * sin(lat)) / (cos(s.decl) * cos(lat)))) / 15;
    return mid(t) + (ccw ? -T : T);
  };
  const asrTime = (f: number, t: number) => {
    const s = sunPos(jDate + t / 24);
    return angleTime(-deg(Math.atan(1 / (f + tan(Math.abs(lat - s.decl))))), t);
  };
  let t: Record<PrayerKey, number> = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 18 };
  for (let i = 0; i < 2; i++) {
    t = {
      fajr: angleTime(o.fajrAngle, t.fajr, true),
      sunrise: angleTime(0.833, t.sunrise, true),
      dhuhr: mid(t.dhuhr),
      asr: asrTime(o.asrFactor, t.asr),
      maghrib: angleTime(0.833, t.maghrib),
      isha: angleTime(o.ishaAngle, t.isha),
    };
  }
  const out = {} as Record<PrayerKey, number>;
  for (const k of PRAYER_ORDER) out[k] = fix(Math.round((t[k] + timezone - lng / 15) * 60 + (o.adjust[k] || 0)), 1440);
  return out;
}
