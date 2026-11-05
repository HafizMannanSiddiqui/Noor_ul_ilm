"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { type Lang, LANGS } from "@/lib/lang";

type Props = {
  lang: Lang;
  name: string;
  tagline: string;
  menuLabel: string;
  langLabel: string;
  skipLabel: string;
  nav: { href: string; label: string }[];
};

const LANG_NAME: Record<Lang, string> = { ur: "اردو", en: "EN", ar: "عربي" };

export default function Header({ lang, name, tagline, menuLabel, langLabel, skipLabel, nav }: Props) {
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const swap = (l: Lang) => pathname.replace(/^\/(ur|en|ar)(?=\/|$)/, `/${l}`);
  const isActive = (href: string) => (href === `/${lang}` ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <a className="skip" href="#main">{skipLabel}</a>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="wrap">
          <div className="bar">
            <Link className="brand" href={`/${lang}`}>
              <Logo id="hdr" title={name} />
              <span className="brand-text">
                <span className="brand-name">{name}</span>
                <span className="brand-tag">{tagline}</span>
              </span>
            </Link>
            <nav className="lang-switch" aria-label={langLabel}>
              {LANGS.map((l) => (
                <Link key={l} href={swap(l)} lang={l} className={`l-${l}`} aria-current={l === lang} prefetch={false}
                  onClick={() => { document.cookie = `lang=${l};path=/;max-age=31536000;samesite=lax`; }}>
                  {LANG_NAME[l]}
                </Link>
              ))}
            </nav>
            <button className="menu-btn" type="button" aria-expanded={open} aria-controls="nav" aria-label={menuLabel} onClick={() => setOpen((o) => !o)}>
              {open ? "✕" : "☰"}
            </button>
          </div>
          <nav className={`site-nav${open ? " open" : ""}`} id="nav" aria-label={menuLabel}>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
