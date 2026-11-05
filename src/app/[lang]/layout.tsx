import "../globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabBar from "@/components/TabBar";
import RevealObserver from "@/components/RevealObserver";
import { ORG } from "@/content/site";
import { fontVars } from "@/lib/fonts";
import { dirOf, LANGS, tr } from "@/lib/lang";
import { langOf, type LangParams } from "@/lib/page";
import { SITE_URL } from "@/lib/settings";
import { getT } from "@/lib/strings";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await langOf(params);
  const name = tr(ORG.name, lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${name} — ${tr(ORG.tagline, lang)}`, template: `%s — ${name}` },
    description: getT(lang)("heroIntro"),
    alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, `/${l}`])) },
    openGraph: { siteName: name, locale: lang, type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#0a3a2b", width: "device-width", initialScale: 1 };

export default async function SiteLayout({ children, params }: LangParams & { children: React.ReactNode }) {
  const lang = await langOf(params);
  const t = getT(lang);
  const p = (s: string) => `/${lang}${s}`;
  const nav = [
    { href: p(""), label: t("home") },
    { href: p("/about"), label: t("about") },
    { href: p("/posts"), label: t("posts") },
    { href: p("/sisters"), label: t("sisters") },
    { href: p("/youth"), label: t("youth") },
    { href: p("/events"), label: t("events") },
    { href: p("/join"), label: t("join") },
    { href: p("/donate"), label: t("donate") },
    { href: p("/contact"), label: t("contact") },
  ];
  return (
    <html lang={lang} dir={dirOf(lang)} className={fontVars} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JavaScript runs, so content is never hidden without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Header lang={lang} name={tr(ORG.name, lang)} tagline={tr(ORG.tagline, lang)} menuLabel={t("menu")} langLabel={t("language")} skipLabel={t("skip")} nav={nav} />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer lang={lang} nav={nav.slice(1, 7)} />
        <TabBar
          home={p("")}
          tabs={[
            { href: p(""), label: t("home"), icon: "home" },
            { href: p("/posts"), label: t("posts"), icon: "posts" },
            { href: p("/sisters"), label: t("sisters"), icon: "sisters" },
            { href: p("/events"), label: t("events"), icon: "events" },
            { href: p("/join"), label: t("tab_join"), icon: "join" },
          ]}
        />
        <RevealObserver />
      </body>
    </html>
  );
}
