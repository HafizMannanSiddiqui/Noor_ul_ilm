import { notFound } from "next/navigation";
import { isLang, type Lang } from "./lang";

export type LangParams = { params: Promise<{ lang: string }> };

/** Resolve and validate the [lang] route segment. */
export async function langOf(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return lang;
}

export const reveal = (delay = 0) => ({ "data-reveal": true, style: { "--rd": `${delay}s` } as React.CSSProperties });
