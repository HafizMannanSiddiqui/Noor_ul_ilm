import type { Metadata } from "next";
import { PageHead, Section } from "@/components/Cards";
import { waLink } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/Icons";
import { CopyButton } from "@/components/Interactive";
import { DONATE } from "@/content/site";
import { tr } from "@/lib/lang";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { getT } from "@/lib/strings";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("donateTitle") };
}

export default async function Donate({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  const label = { jazzcash: "JazzCash", easypaisa: "Easypaisa", bank: t("bankT") };
  const purposes = [
    { h: t("sadaqah"), p: t("sadaqahD") },
    { h: t("atiyat"), p: t("atiyatD") },
    { h: t("zakat"), p: DONATE.zakatAccepted ? t("zakatYes") : t("zakatNo") },
  ];
  return (
    <>
      <PageHead title={t("donateTitle")} intro={t("donateIntro")} />
      <Section title={t("purposes")}>
        <div className="grid grid-3">
          {purposes.map((x, i) => <div key={i} className="card hover card-gold" {...reveal(i * 0.08)}><h3>{x.h}</h3><p>{x.p}</p></div>)}
        </div>
      </Section>
      <Section title={t("howToGive")}>
        <div className="grid grid-3">
          {DONATE.accounts.map((a, i) => (
            <div key={i} className="card hover acct" {...reveal(i * 0.08)}>
              <h3>{label[a.type]}</h3>
              <span className="muted">{t("accTitle")}</span><span>{a.title}</span>
              {a.bank && <span>{a.bank}</span>}
              <span className="muted">{t("accNumber")}</span><span className="num">{a.number}</span>
              {a.iban && (<><span className="muted">IBAN</span><span className="num">{a.iban}</span></>)}
              <div><CopyButton value={a.iban || a.number} lang={lang} /></div>
            </div>
          ))}
        </div>
        <p className="note-box" {...reveal()}>{t("afterGive")}</p>
        <a className="btn btn-wa" rel="noopener" href={waLink(DONATE.receiptWhatsapp)}><WhatsAppIcon size={20} /> WhatsApp</a>
        <p className="muted" style={{ marginTop: 12 }}>{tr(DONATE.registration, lang)}</p>
      </Section>
      <Section title={t("transparency")}>
        <div className="card" {...reveal()}>
          <p className="muted">{t("transNote")} — {tr(DONATE.funds.period, lang)}</p>
          {DONATE.funds.items.map((it, i) => (
            <div className="bar-row" key={i}>
              <div className="bar-label"><span>{tr(it.label, lang)}</span><span className="ltr">{it.percent}%</span></div>
              <div className="meter"><span style={{ "--w": `${it.percent}%`, animationDelay: `${i * 0.12}s` } as React.CSSProperties} /></div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
