import Link from "next/link";
import { ORG } from "@/content/site";
import type { Contact } from "@/lib/config";
import { tr, type Lang } from "@/lib/lang";
import { getT } from "@/lib/strings";
import Logo from "./Logo";
import { WhatsAppIcon } from "./Icons";

export const waLink = (num: string, text?: string) => `https://wa.me/${num}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export default function Footer({ lang, nav, contact: CONTACT }: { lang: Lang; nav: { href: string; label: string }[]; contact: Contact }) {
  const t = getT(lang);
  return (
    <>
      <footer className="site-footer">
        <div className="wrap">
          <div className="cols">
            <div>
              <div className="foot-brand">
                <Logo id="ftr" size={60} animated={false} />
                <span className="calli" lang="ar">{ORG.calligraphy}</span>
              </div>
              <p>{tr(ORG.tagline, lang)}</p>
              <p>{t("footerReview")}</p>
            </div>
            <div>
              <h4>{t("menu")}</h4>
              <ul>{nav.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}</ul>
            </div>
            <div>
              <h4>{t("contact")}</h4>
              <ul>
                <li><a href={waLink(CONTACT.whatsappGeneral)} rel="noopener">WhatsApp</a></li>
                {CONTACT.phone && <li><a className="ltr" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a></li>}
                {CONTACT.email && <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>}
                <li>{tr(CONTACT.address, lang)}</li>
              </ul>
            </div>
          </div>
          <p className="foot-note">{t("footerPrivacy")} · © {new Date().getFullYear()} {tr(ORG.name, lang)}</p>
        </div>
      </footer>
      <a className="wa-float" href={waLink(CONTACT.whatsappGeneral)} rel="noopener" aria-label={t("waChat")}>
        <WhatsAppIcon />
      </a>
    </>
  );
}
