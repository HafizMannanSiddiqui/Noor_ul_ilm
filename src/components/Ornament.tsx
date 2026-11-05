/** Gold divider: line · diamonds · 8-pointed star · line (draws itself in). */
export default function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 240 24" aria-hidden="true">
      <g fill="none" stroke="#c9a23a" strokeWidth="1.5">
        <path d="M4 12h84M152 12h84" />
        <path d="M90 12l8-4 8 4-8 4zM134 12l8-4 8 4-8 4z" fill="#c9a23a" />
        <rect x="112" y="4" width="16" height="16" />
        <rect x="112" y="4" width="16" height="16" transform="rotate(45 120 12)" />
      </g>
      <circle cx="120" cy="12" r="2.5" fill="#c9a23a" />
    </svg>
  );
}
