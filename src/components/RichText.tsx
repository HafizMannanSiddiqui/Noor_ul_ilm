import type { SacredText } from "@prisma/client";
import SacredCard from "./SacredCard";
import type { Lang } from "@/lib/lang";

/**
 * Renders the simple post markup used in the admin panel:
 *   blank line           -> new paragraph
 *   ## Heading           -> sub-heading
 *   - item               -> list item (consecutive lines form one list)
 *   > text               -> yellow note box (instructions / placeholders)
 *   [[ayah:alaq-1]]      -> verse card from the Verses & Hadith library
 *   [[hadith:ibnmajah-224]] -> hadith card
 * Everything is rendered as text (React escapes it) — no HTML injection possible.
 */
export default function RichText({ source, lang, texts }: { source: string; lang: Lang; texts: Map<string, SacredText> }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => {
        const embed = b.match(/^\[\[(ayah|hadith):([\w-]+)\]\]$/);
        if (embed) {
          const t = texts.get(embed[2]);
          return t ? <SacredCard key={i} text={t} lang={lang} /> : null;
        }
        if (b.startsWith("## ")) return <h2 key={i}>{b.slice(3)}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
          return <ol key={i}>{lines.map((l, j) => <li key={j}>{l.replace(/^\s*[-•]\s+/, "")}</li>)}</ol>;
        }
        if (lines.every((l) => l.startsWith(">"))) {
          return <div key={i} className="note-box">{lines.map((l) => l.replace(/^>\s?/, "")).join(" ")}</div>;
        }
        return <p key={i}>{lines.join(" ")}</p>;
      })}
    </>
  );
}
