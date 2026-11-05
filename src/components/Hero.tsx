import Link from "next/link";
import Ornament from "./Ornament";

/** Deterministic "random" particle layout (same on server and client). */
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: `${Math.round(r(1) * 100)}%`, s: `${3 + Math.round(r(2) * 4)}px`, t: `${10 + Math.round(r(3) * 10)}s`, d: `${-Math.round(r(4) * 18)}s`, dx: `${Math.round(r(5) * 60 - 30)}px` };
});

/** 16-point girih rosette, drawn from rotated squares and a ring of petals. */
function Rosette() {
  return (
    <svg className="rosette" viewBox="-200 -200 400 400" aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={`a${i}`} x="-120" y="-120" width="240" height="240" transform={`rotate(${i * 22.5})`} />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={`b${i}`} x="-70" y="-70" width="140" height="140" transform={`rotate(${i * 22.5 + 11.25})`} />
      ))}
      <circle r="190" />
      <circle r="170" />
      <circle r="40" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={`p${i}`} d="M0-170 C14-150 14-135 0-120 C-14-135 -14-150 0-170z" transform={`rotate(${i * 22.5})`} />
      ))}
    </svg>
  );
}

function Lantern({ cls }: { cls: string }) {
  return (
    <svg className={`lantern ${cls}`} viewBox="0 0 60 200" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
      <defs>
        <radialGradient id={`lg-${cls}`} cx="50%" cy="60%">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset=".5" stopColor="#f0c95a" stopOpacity=".9" />
          <stop offset="1" stopColor="#c9a23a" stopOpacity=".15" />
        </radialGradient>
      </defs>
      <line x1="30" y1="0" x2="30" y2="110" stroke="#c9a23a" strokeWidth="1.2" />
      <path d="M22 110h16l4 8H18z" fill="#c9a23a" />
      <path d="M18 118c-8 8-10 22-6 36 3 8 10 14 18 16 8-2 15-8 18-16 4-14 2-28-6-36z" fill={`url(#lg-${cls})`} stroke="#c9a23a" strokeWidth="1.5" />
      <path d="M30 118v52M20 124c-4 12-4 26 2 38M40 124c4 12 4 26-2 38" stroke="#a8841f" strokeWidth="1" fill="none" opacity=".7" />
      <ellipse className="flame" cx="30" cy="146" rx="5" ry="9" fill="#fffbe8" />
      <path d="M22 170h16l-3 8h-10z" fill="#c9a23a" />
      <path d="M30 178v10" stroke="#c9a23a" strokeWidth="1.5" />
      <circle cx="30" cy="191" r="3" fill="#c9a23a" />
    </svg>
  );
}

type Props = {
  calligraphy: string;
  subName?: string;
  tagline: string;
  lead: string;
  cta: { join: { href: string; label: string }; register: { href: string; label: string }; donate: { href: string; label: string } };
  scrollLabel: string;
};

export default function Hero({ calligraphy, subName, tagline, lead, cta, scrollLabel }: Props) {
  return (
    <section className="hero">
      <div className="hero-pattern" aria-hidden="true" />
      <Rosette />
      <Lantern cls="l1" />
      <Lantern cls="l2" />
      <Lantern cls="l3" />
      <Lantern cls="l4" />
      <div className="particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span key={i} style={{ "--x": p.x, "--s": p.s, "--t": p.t, "--d": p.d, "--dx": p.dx } as React.CSSProperties} />
        ))}
      </div>
      <div className="wrap">
        <div className="arch">
          <p className="bismillah rise" lang="ar" style={{ "--d": ".1s" } as React.CSSProperties}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <h1>
            <span className="calli" lang="ar">{calligraphy}</span>
            {subName && <span className="h1-sub rise" style={{ "--d": ".5s" } as React.CSSProperties}>{subName}</span>}
          </h1>
          <Ornament />
          <p className="tag rise" style={{ "--d": ".7s" } as React.CSSProperties}>{tagline}</p>
          <p className="lead rise" style={{ "--d": ".85s" } as React.CSSProperties}>{lead}</p>
          <div className="cta rise" style={{ "--d": "1s" } as React.CSSProperties}>
            <Link className="btn btn-gold" href={cta.join.href}>{cta.join.label}</Link>
            <Link className="btn btn-light" href={cta.register.href}>{cta.register.label}</Link>
            <Link className="btn btn-outline" href={cta.donate.href}>{cta.donate.label}</Link>
          </div>
          <a className="scroll-cue rise" href="#today" style={{ "--d": "1.3s" } as React.CSSProperties}>{scrollLabel}</a>
        </div>
      </div>
    </section>
  );
}
