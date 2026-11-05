"use server";
/* Admin > Site settings: contact numbers, donation details, team and the Ayah of the Day list. Super admin only. */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit, requireUser } from "@/lib/auth";
import { saveConfig, type Account, type Contact, type Donate, type TeamMember } from "@/lib/config";
import type { Tri } from "@/lib/lang";
import { can } from "@/lib/roles";

const s = (fd: FormData, k: string, max = 300) => String(fd.get(k) ?? "").trim().slice(0, max);
const tri = (fd: FormData, k: string, max = 300): Tri => ({ ur: s(fd, `${k}_ur`, max), en: s(fd, `${k}_en`, max), ar: s(fd, `${k}_ar`, max) });
const back = (msg: string, err = false): never => redirect(`/admin/settings?${err ? "err" : "ok"}=${encodeURIComponent(msg)}`);

/** "0331 4375356" / "+92 331 4375356" -> "923314375356" (WhatsApp links need this form). Empty stays empty. */
function intl(v: string) {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  const n = d.startsWith("0") ? `92${d.slice(1)}` : d;
  if (!/^92\d{10}$/.test(n)) back(`Phone/WhatsApp number "${v}" is not a valid Pakistani mobile number (e.g. 0331 4375356).`, true);
  return n;
}
const rows = (fd: FormData, prefix: string, max = 30) => Array.from({ length: max }, (_, i) => i).filter((i) => fd.has(`${prefix}_${i}_present`));

export async function saveSettings(fd: FormData) {
  const u = await requireUser(can.manageUsers);
  const section = s(fd, "section");

  if (section === "contact") {
    const c: Contact = {
      whatsappGeneral: intl(s(fd, "whatsappGeneral")),
      phone: s(fd, "phone", 30),
      email: s(fd, "email", 120),
      whatsappSisters: intl(s(fd, "whatsappSisters")),
      whatsappCommunity: s(fd, "whatsappCommunity", 300),
      facebook: s(fd, "facebook", 300),
      address: tri(fd, "address"),
      mapQuery: s(fd, "mapQuery", 200),
    };
    for (const url of [c.whatsappCommunity, c.facebook]) if (url && !/^https:\/\//.test(url)) back("Links must start with https://", true);
    await saveConfig("contact", c);
  } else if (section === "donate") {
    const accounts: Account[] = rows(fd, "acc").map((i) => ({
      type: (["jazzcash", "easypaisa", "bank"].includes(s(fd, `acc_${i}_type`)) ? s(fd, `acc_${i}_type`) : "jazzcash") as Account["type"],
      title: s(fd, `acc_${i}_title`), number: s(fd, `acc_${i}_number`, 40), bank: s(fd, `acc_${i}_bank`), iban: s(fd, `acc_${i}_iban`, 40),
    })).filter((a) => a.title && a.number);
    const spending = rows(fd, "sp").map((i) => tri(fd, `sp_${i}`)).filter((x) => x.ur || x.en);
    const items = rows(fd, "fund").map((i) => ({ label: tri(fd, `fund_${i}`), percent: Math.max(0, Math.min(100, Number(s(fd, `fund_${i}_pct`, 3)) || 0)) }))
      .filter((x) => (x.label.ur || x.label.en) && x.percent > 0);
    const d: Donate = {
      zakatAccepted: fd.get("zakatAccepted") === "on",
      receiptWhatsapp: intl(s(fd, "receiptWhatsapp")),
      registration: tri(fd, "registration"),
      accounts, spending, funds: { period: tri(fd, "period"), items },
    };
    await saveConfig("donate", d);
  } else if (section === "team") {
    const team: TeamMember[] = rows(fd, "tm").map((i) => ({ name: tri(fd, `tm_${i}_name`), role: tri(fd, `tm_${i}_role`), phone: intl(s(fd, `tm_${i}_phone`)) }))
      .filter((m) => m.name.ur || m.name.en);
    await saveConfig("team", team);
  } else if (section === "dailyAyat") {
    const refs = s(fd, "refs", 5000).split(/[\s,]+/).filter(Boolean);
    const bad = refs.filter((r) => !/^\d{1,3}:\d{1,3}$/.test(r) || Number(r.split(":")[0]) < 1 || Number(r.split(":")[0]) > 114);
    if (bad.length) back(`Not a verse reference (use surah:ayah, e.g. 2:255): ${bad.join(", ")}`, true);
    if (!refs.length) back("Add at least one verse reference.", true);
    await saveConfig("dailyAyat", refs);
  } else {
    back("Unknown section.", true);
  }

  await audit(u.id, `settings.${section}`, "Setting", section);
  revalidatePath("/", "layout");
  back("Saved. The website is updated.");
}
