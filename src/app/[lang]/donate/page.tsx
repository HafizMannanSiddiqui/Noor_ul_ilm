import type { Metadata } from "next";
import { PageHead, Section } from "@/components/Cards";
import { waLink } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/Icons";
import { CopyButton } from "@/components/Interactive";
import SacredCard from "@/components/SacredCard";
import { givingTexts } from "@/lib/daily";
import { getConfig } from "@/lib/config";
import { tr } from "@/lib/lang";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { SITE_URL } from "@/lib/settings";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("donateTitle") };
}

export default async function Donate({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  const [texts, { donate: DONATE }] = await Promise.all([givingTexts(), getConfig()]);
  const label = { jazzcash: "JazzCash", easypaisa: "Easypaisa", bank: t("bankT") };
  const purposes = [
    { h: t("sadaqah"), p: t("sadaqahD") },
    { h: t("atiyat"), p: t("atiyatD") },
    { h: t("zakat"), p: DONATE.zakatAccepted ? t("zakatYes") : t("zakatNo") },
  ];
  const registration = tr(DONATE.registration, lang);
  return (
    <>
      <PageHead title={t("donateTitle")} intro={t("donateIntro")} />

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="any-amount" {...reveal()}>
            <span className="any-amount-rs ltr">Rs 100</span>
            <div>
              <h2>{t("anyAmountTitle")}</h2>
              <p>{t("anyAmount")}</p>
            </div>
          </div>
        </div>
      </section>

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
        {registration && <p className="muted" style={{ marginTop: 12 }}>{registration}</p>}
      </Section>

      {DONATE.spending.length > 0 && (
        <Section title={t("spendingTitle")}>
          <ol className="spend-list">
            {DONATE.spending.map((x, i) => <li key={i} {...reveal(i * 0.08)}>{tr(x, lang)}</li>)}
          </ol>
        </Section>
      )}

      {texts.length > 0 && (
        <Section title={t("givingTitle")}>
          <div className="grid grid-2">
            {texts.map((x, i) => <SacredCard key={i} text={x} lang={lang} share siteUrl={SITE_URL} />)}
          </div>
        </Section>
      )}

      <Section title={t("purposes")}>
        <div className="grid grid-3">
          {purposes.map((x, i) => <div key={i} className="card hover card-gold" {...reveal(i * 0.08)}><h3>{x.h}</h3><p>{x.p}</p></div>)}
        </div>
      </Section>

      {DONATE.funds.items.length > 0 && (
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
      )}
    </>
  );
}
