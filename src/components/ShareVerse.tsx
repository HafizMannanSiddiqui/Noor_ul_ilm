"use client";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/lang";
import { getT } from "@/lib/strings";
import { WhatsAppIcon } from "./Icons";

type Props = {
  lang: Lang;
  kind: "AYAH" | "HADITH";
  label: string;
  arabic: string;
  translation: string;
  translationLang: "ur" | "en";
  refText: string;
  siteName: string;
  siteUrl: string;
};

const W = 1080, H = 1920;
const cssFont = (v: string, fallback: string) =>
  (typeof window !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue(v).trim()) || fallback;

/** Greedy word wrap that works for RTL and LTR text. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  for (const para of text.split(/\n+/)) {
    let line = "";
    for (const w of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > max && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
  }
  return lines;
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  for (const rot of [0, Math.PI / 4]) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeRect(-r, -r, r * 2, r * 2); ctx.restore();
  }
}

/** Draws a WhatsApp-Status-sized (9:16) image of the verse/hadith. */
async function drawImage(p: Props, t: ReturnType<typeof getT>): Promise<Blob> {
  const fQuran = cssFont("--font-quran", "serif");
  const fNaskh = cssFont("--font-naskh", "serif");
  const fUrdu = cssFont("--font-nastaliq", "serif");
  const fRuqaa = cssFont("--font-ruqaa", "serif");
  const fUi = 'system-ui, "Segoe UI", Roboto, Arial, sans-serif';
  const fArabic = p.kind === "AYAH" ? fQuran : fNaskh;
  const fTrans = p.translationLang === "ur" ? fUrdu : fUi;
  await Promise.all(
    [`72px ${fArabic}`, `46px ${fUrdu}`, `64px ${fRuqaa}`].map((f) => document.fonts.load(f, "بسم الله نور").catch(() => [])),
  );

  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // Background: deep green with a lantern glow and faint girih stars
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#136346"); bg.addColorStop(0.45, "#0a3a2b"); bg.addColorStop(1, "#04201a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 230, 10, W / 2, 230, 520);
  glow.addColorStop(0, "rgba(255, 230, 150, .32)"); glow.addColorStop(1, "rgba(255, 230, 150, 0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, 800);
  ctx.strokeStyle = "rgba(201, 162, 58, .09)"; ctx.lineWidth = 1.5;
  for (let y = 60; y < H; y += 120) for (let x = (y / 120) % 2 ? 60 : 0; x < W + 60; x += 120) star(ctx, x, y, 16);

  // Frame
  ctx.strokeStyle = "#c9a23a"; ctx.lineWidth = 5; ctx.strokeRect(44, 44, W - 88, H - 88);
  ctx.strokeStyle = "rgba(230, 198, 109, .5)"; ctx.lineWidth = 1.5; ctx.strokeRect(62, 62, W - 124, H - 124);
  ctx.strokeStyle = "#e6c66d"; ctx.lineWidth = 3; star(ctx, W / 2, 175, 34);
  ctx.fillStyle = "#fff3c4"; ctx.beginPath(); ctx.arc(W / 2, 175, 10, 0, Math.PI * 2); ctx.fill();

  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  // Label
  ctx.direction = p.lang === "en" ? "ltr" : "rtl";
  ctx.fillStyle = "#e6c66d";
  ctx.font = `${p.lang === "en" ? 44 : 46}px ${p.lang === "ur" ? fUrdu : p.lang === "ar" ? fNaskh : fUi}`;
  ctx.fillText(p.label, W / 2, 290);

  // Fit the text: shrink, then drop the translation, then shorten the Arabic.
  const top = 380, bottom = 1590, maxW = W - 260;
  const measure = (s: number, withTr: boolean) => {
    ctx.direction = "rtl"; ctx.font = `${72 * s}px ${fArabic}`;
    const arLines = wrap(ctx, p.arabic, maxW); const arLH = 72 * s * (p.kind === "AYAH" ? 1.95 : 1.75);
    let trLines: string[] = [], trLH = 0;
    if (withTr && p.translation) {
      ctx.direction = p.translationLang === "ur" ? "rtl" : "ltr";
      ctx.font = `${(p.translationLang === "ur" ? 44 : 40) * s}px ${fTrans}`;
      trLines = wrap(ctx, p.translation, maxW);
      trLH = (p.translationLang === "ur" ? 44 * 2.15 : 40 * 1.45) * s;
    }
    const refH = 64;
    const total = arLines.length * arLH + (trLines.length ? 70 + trLines.length * trLH : 0) + 50 + refH;
    return { s, arLines, arLH, trLines, trLH, total };
  };
  let L = measure(1, true);
  for (let s = 1; s >= 0.5 && L.total > bottom - top; s -= 0.05) L = measure(s, true);
  let truncated = false;
  if (L.total > bottom - top) {
    for (let s = 1; s >= 0.5; s -= 0.05) { L = measure(s, false); if (L.total <= bottom - top) break; }
    if (L.total > bottom - top) {
      const fit = Math.max(3, Math.floor((bottom - top - 160) / L.arLH));
      L.arLines = L.arLines.slice(0, fit); L.arLines[fit - 1] += " …"; truncated = true;
      L.total = L.arLines.length * L.arLH + 50 + 64;
    }
  }

  let y = top + (bottom - top - L.total) / 2;
  ctx.direction = "rtl"; ctx.fillStyle = "#fffaf0"; ctx.font = `${72 * L.s}px ${fArabic}`;
  for (const line of L.arLines) { ctx.fillText(line, W / 2, y + L.arLH / 2); y += L.arLH; }
  if (L.trLines.length) {
    y += 22;
    ctx.strokeStyle = "rgba(201, 162, 58, .8)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 160, y); ctx.lineTo(W / 2 - 22, y); ctx.moveTo(W / 2 + 22, y); ctx.lineTo(W / 2 + 160, y); ctx.stroke();
    ctx.fillStyle = "#c9a23a"; ctx.save(); ctx.translate(W / 2, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-9, -9, 18, 18); ctx.restore();
    y += 48;
    ctx.direction = p.translationLang === "ur" ? "rtl" : "ltr"; ctx.fillStyle = "#f6edd2";
    ctx.font = `${(p.translationLang === "ur" ? 44 : 40) * L.s}px ${fTrans}`;
    for (const line of L.trLines) { ctx.fillText(line, W / 2, y + L.trLH / 2); y += L.trLH; }
  }
  y += 50;
  ctx.direction = p.lang === "en" ? "ltr" : "rtl"; ctx.fillStyle = "#e6c66d";
  ctx.font = `36px ${p.lang === "ur" ? fUrdu : p.lang === "ar" ? fNaskh : fUi}`;
  ctx.fillText(p.refText, W / 2, y + 20);
  if (truncated) { ctx.fillStyle = "#cfe0d7"; ctx.font = `30px ${p.lang === "ur" ? fUrdu : fUi}`; ctx.fillText(t("fullOnSite"), W / 2, y + 80); }

  // Footer: name + address
  ctx.direction = "rtl"; ctx.fillStyle = "#e6c66d"; ctx.font = `68px ${fRuqaa}`;
  ctx.fillText("نُورُ العِلْم", W / 2, 1700);
  ctx.direction = "ltr"; ctx.fillStyle = "#cfe0d7"; ctx.font = `32px ${fUi}`;
  ctx.fillText(p.siteUrl.replace(/^https?:\/\//, ""), W / 2, 1782);

  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"));
}

export default function ShareVerse(p: Props) {
  const t = getT(p.lang);
  const [busy, setBusy] = useState(false);
  const [img, setImg] = useState<{ url: string; file: File } | null>(null);
  const [copied, setCopied] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const siteUrl = p.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const plain = `${p.arabic}\n\n${p.translation}\n${p.refText}\n\n${p.siteName} · ${siteUrl}`;

  useEffect(() => {
    if (!img) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img]);

  function close() {
    if (img) URL.revokeObjectURL(img.url);
    setImg(null);
  }

  async function make() {
    setBusy(true);
    try {
      const blob = await drawImage({ ...p, siteUrl }, t);
      const file = new File([blob], `noor-ul-ilm-${p.kind === "AYAH" ? "ayah" : "hadith"}.png`, { type: "image/png" });
      setCanShareFiles(Boolean(navigator.canShare?.({ files: [file] })));
      setImg({ url: URL.createObjectURL(blob), file });
    } finally {
      setBusy(false);
    }
  }

  async function shareImage() {
    if (!img) return;
    try {
      await navigator.share({ files: [img.file], title: p.label });
    } catch (e) {
      if ((e as Error).name !== "AbortError") download();
    }
  }

  function download() {
    if (!img) return;
    const a = document.createElement("a");
    a.href = img.url; a.download = img.file.name; a.click();
  }

  return (
    <div className="share-verse">
      <button type="button" className="btn btn-gold btn-small" onClick={make} disabled={busy}>
        {busy ? t("preparing") : `✦ ${t("shareImage")}`}
      </button>
      <a className="btn btn-wa btn-small" rel="noopener" target="_blank" href={`https://wa.me/?text=${encodeURIComponent(plain)}`}>
        <WhatsAppIcon size={16} /> WhatsApp
      </a>
      <button type="button" className="btn btn-green btn-small" onClick={() => navigator.clipboard?.writeText(plain).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }, () => {})}>
        {copied ? `✓ ${t("copied")}` : t("copy")}
      </button>

      {img && (
        <div className="share-modal" role="dialog" aria-modal="true" aria-label={t("shareImage")} onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="share-sheet">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={`${p.label} — ${p.refText}`} />
            <div className="share-actions">
              {canShareFiles && (
                <button type="button" className="btn btn-wa" onClick={shareImage}><WhatsAppIcon size={20} /> {t("shareNow")}</button>
              )}
              <button type="button" className={canShareFiles ? "btn btn-green btn-small" : "btn btn-wa"} onClick={download}>⬇ {t("saveImage")}</button>
              <button type="button" ref={closeRef} className="btn btn-green btn-small" onClick={close}>{t("close")}</button>
            </div>
            <p className="share-help">{t("statusHelp")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
