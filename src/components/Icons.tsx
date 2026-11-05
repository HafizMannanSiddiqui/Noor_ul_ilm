/* Small inline icons (no icon-font download). */
type P = { size?: number };

export const WhatsAppIcon = ({ size = 26 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
  </svg>
);

export const CheckIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M5 12l5 5 9-10" />
  </svg>
);

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export const TabIcons = {
  home: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...S}>
      <path d="M4 21V11c0-3 3-5 8-8 5 3 8 5 8 8v10z" />
      <path d="M9 21v-5a3 3 0 0 1 6 0v5" />
    </svg>
  ),
  posts: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...S}>
      <path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5C17 4 14 4.5 12 6z" />
      <path d="M12 6v14.5" />
    </svg>
  ),
  sisters: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...S}>
      <rect x="6" y="6" width="12" height="12" />
      <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),
  events: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...S}>
      <path d="M8 3v4M16 3v4M4 9h16M5 5h14v15H5z" />
      <path d="M14 13a2.5 2.5 0 1 0 1.8 4.2A3 3 0 0 1 14 13z" />
    </svg>
  ),
  join: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...S}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  ),
};
