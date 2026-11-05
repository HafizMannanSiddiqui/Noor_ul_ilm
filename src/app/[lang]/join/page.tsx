import type { Metadata } from "next";
import { PageHead } from "@/components/Cards";
import CountUp from "@/components/CountUp";
import { JoinForm } from "@/components/Forms";
import { WhatsAppIcon } from "@/components/Icons";
import { getConfig } from "@/lib/config";
import { langOf, reveal, type LangParams } from "@/lib/page";
import { communityCount } from "@/lib/queries";
import { getT } from "@/lib/strings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("joinTitle") };
}

export default async function Join({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  const [members, { contact: CONTACT }] = await Promise.all([communityCount(), getConfig()]);
  return (
    <>
      <PageHead title={t("joinTitle")} intro={t("joinIntro")} />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          {members > 0 && (
            <div className="community-count" {...reveal()}>
              <span className="stat-num"><CountUp to={members} /></span>
              <span>{t("communityCount")} — {t("joinThem")}</span>
            </div>
          )}
          {CONTACT.whatsappCommunity && (
            <p className="center-row" {...reveal()}>
              <a className="btn btn-wa" href={CONTACT.whatsappCommunity} target="_blank" rel="noopener"><WhatsAppIcon size={20} /> {t("waCommunity")}</a>
            </p>
          )}
          <JoinForm lang={lang} />
        </div>
      </section>
    </>
  );
}
