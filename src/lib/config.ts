import "server-only";
import { cache } from "react";
import { db } from "./db";
import type { Tri } from "./lang";
import { CONTACT, DONATE, TEAM } from "@/content/site";
import { DAILY_AYAT } from "@/content/daily";

/*
 * Website settings that admins change in Admin > Site settings (no code needed).
 * Each section is stored as JSON in the Setting table; anything not saved yet
 * falls back to the defaults in src/content/site.ts and src/content/daily.ts.
 */

export type Contact = {
  whatsappGeneral: string; phone: string; email: string; whatsappSisters: string;
  whatsappCommunity: string; facebook: string; address: Tri; mapQuery: string;
};
export type Account = { type: "jazzcash" | "easypaisa" | "bank"; title: string; number: string; bank?: string; iban?: string };
export type Donate = {
  zakatAccepted: boolean; receiptWhatsapp: string; registration: Tri; accounts: Account[]; spending: Tri[];
  funds: { period: Tri; items: { label: Tri; percent: number }[] };
};
export type TeamMember = { name: Tri; role: Tri; phone?: string };
export type SiteConfig = { contact: Contact; donate: Donate; team: TeamMember[]; dailyAyat: string[] };

export const DEFAULTS: SiteConfig = {
  contact: { ...CONTACT },
  donate: { ...DONATE },
  team: TEAM,
  dailyAyat: DAILY_AYAT,
};

export type ConfigKey = keyof SiteConfig;

/** Settings for this request (one database read, shared by every component). */
export const getConfig = cache(async (): Promise<SiteConfig> => {
  const cfg: SiteConfig = structuredClone(DEFAULTS);
  try {
    const rows = await db.setting.findMany();
    for (const r of rows) {
      const k = r.key as ConfigKey;
      if (!(k in cfg)) continue;
      const v = JSON.parse(r.value);
      (cfg as Record<ConfigKey, unknown>)[k] = Array.isArray(v) ? v : { ...(cfg[k] as object), ...v };
    }
  } catch {
    // Database unavailable: the site still works with the defaults.
  }
  return cfg;
});

export async function saveConfig<K extends ConfigKey>(key: K, value: SiteConfig[K]) {
  const json = JSON.stringify(value);
  await db.setting.upsert({ where: { key }, update: { value: json }, create: { key, value: json } });
}
