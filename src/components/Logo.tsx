/** Noor-ul-Ilm mark: a mihrab arch framing an 8-pointed star of light (Noor)
 *  rising from an open book (Ilm). Pure SVG — no image download. */
type Props = { size?: number; animated?: boolean; id?: string; title?: string };

const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = ((22.5 + i * 45) * Math.PI) / 180;
  const r = (n: number) => Math.round(n * 100) / 100;
  return { x1: r(60 + Math.cos(a) * 25), y1: r(50 + Math.sin(a) * 25), x2: r(60 + Math.cos(a) * 31), y2: r(50 + Math.sin(a) * 31) };
});

export default function Logo({ size = 46, animated = true, id = "logo", title = "Noor-ul-Ilm" }: Props) {
  const glow = `${id}Glow`;
  return (
    <svg className={`logo${animated ? " logo--animated" : ""}`} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={title}>
      <defs>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset=".45" stopColor="#f3d98a" />
          <stop offset="1" stopColor="#c9a23a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path className="l-arch" d="M16 112V60C16 36 41 24 60 5c19 19 44 31 44 55v52z" />
      <path className="l-arch-inner" d="M25 112V62c0-20 21-31 35-46 14 15 35 26 35 46v50" />
      <g className="l-rays">
        {RAYS.map((r, i) => (
          <line key={i} {...r} />
        ))}
      </g>
      <g className="l-star">
        <rect x="47" y="37" width="26" height="26" />
        <rect x="47" y="37" width="26" height="26" transform="rotate(45 60 50)" />
      </g>
      <circle className="l-core" cx="60" cy="50" r="10" style={{ fill: `url(#${glow})` }} />
      <g className="l-book">
        <path d="M60 104c-10-6-24-7-34-4V84c10-3 24-2 34 4z" />
        <path className="page-r" d="M60 104c10-6 24-7 34-4V84c-10-3-24-2-34 4z" />
      </g>
    </svg>
  );
}
