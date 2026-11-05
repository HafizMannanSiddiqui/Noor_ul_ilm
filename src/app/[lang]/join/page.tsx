import type { Metadata } from "next";
import { PageHead } from "@/components/Cards";
import { JoinForm } from "@/components/Forms";
import { langOf, type LangParams } from "@/lib/page";
import { getT } from "@/lib/strings";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getT(await langOf(params))("joinTitle") };
}

export default async function Join({ params }: LangParams) {
  const lang = await langOf(params);
  const t = getT(lang);
  return (
    <>
      <PageHead title={t("joinTitle")} intro={t("joinIntro")} />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}><JoinForm lang={lang} /></div>
      </section>
    </>
  );
}
