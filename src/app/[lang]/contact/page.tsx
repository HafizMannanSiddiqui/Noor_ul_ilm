import type { Metadata } from "next";
import { PageHead } from "@/components/Cards";
import { waLink } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/Icons";
import { MapLoader } from "@/components/Interactive";
import { CONTACT } from "@/content/site";
import { tr } from "@/lib/lang";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { getT } from "@/lib/strings";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("contactTitle") };
}

export default async function Contact({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  return (
    <>
      <PageHead title={t("contactTitle")} />
      <section className="section">
        <div className="wrap grid grid-2">
          <div className="card card-gold" {...reveal()}>
            <p><a className="btn btn-wa" rel="noopener" href={waLink(CONTACT.whatsappGeneral)}><WhatsAppIcon size={20} /> {t("waChat")}</a></p>
            <p>{t("sisterContact")}<br />
              <a className="btn btn-wa btn-small" rel="noopener" href={waLink(CONTACT.whatsappSisters)}><WhatsAppIcon size={18} /> {t("sisters")}</a>
            </p>
            <p><strong>{t("phone")}:</strong> <a className="ltr" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a></p>
            <p><strong>{t("email")}:</strong> <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
            <p><strong>{t("address")}:</strong> {tr(CONTACT.address, lang)}</p>
            {CONTACT.facebook && <p><a href={CONTACT.facebook} rel="noopener">Facebook</a></p>}
          </div>
          <div {...reveal(0.1)}><MapLoader query={CONTACT.mapQuery} title={tr(CONTACT.address, lang)} lang={lang} /></div>
        </div>
      </section>
    </>
  );
}
