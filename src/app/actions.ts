"use server";
/* Public form submissions. Stored in the database; never shown publicly.
   Sisters' data is readable only by female SISTERS_ADMIN accounts (see lib/roles.ts). */
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { AREAS } from "@/content/site";

export type FormState = { ok: boolean; error?: "invalid" | "phone" | "rate" | "server" };

const AREA_IDS = AREAS.map((a) => a.id) as [string, ...string[]];
const HEARD_FROM = ["whatsapp", "family", "dars", "masjid", "facebook", "poster", "other"] as const;
const phone = z.string().transform((s) => s.replace(/[\s-]/g, "")).refine((s) => /^(\+92|92|0)3\d{9}$/.test(s), "phone");
const text = (max: number) => z.string().trim().max(max);

/* Simple per-IP rate limit (in memory): max 5 submissions / 10 minutes. */
const hits = new Map<string, number[]>();
async function limited() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || h.get("x-real-ip") || "local").split(",")[0].trim();
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

function fail(e: z.ZodError): FormState {
  return { ok: false, error: e.issues.some((i) => i.message === "phone") ? "phone" : "invalid" };
}

const sisterSchema = z.object({
  name: text(100).min(2),
  phone,
  ageGroup: z.enum(["girls", "young", "women"]),
  area: z.enum(AREA_IDS),
  subject: z.enum(["quran", "tajweed", "fiqh", "seerat"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  mode: z.enum(["online", "inperson"]),
  notes: text(1000).optional().default(""),
  guardian: z.string().optional(),
  transport: z.string().optional(),
  pickupPoint: text(200).optional().default(""),
});

export async function registerSister(_: FormState, fd: FormData): Promise<FormState> {
  if (fd.get("website")) return { ok: true }; // honeypot: silently drop bots
  if (await limited()) return { ok: false, error: "rate" };
  const p = sisterSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error);
  try {
    const { guardian, transport, pickupPoint, ...d } = p.data;
    const needsTransport = transport === "on";
    await db.sisterRegistration.create({ data: { ...d, guardianConsent: guardian === "on", needsTransport, pickupPoint: needsTransport ? pickupPoint : "" } });
    return { ok: true };
  } catch {
    return { ok: false, error: "server" };
  }
}

const joinSchema = z.object({
  name: text(100).min(2),
  phone,
  gender: z.enum(["M", "F"]),
  area: z.enum(AREA_IDS),
  role: z.enum(["follower", "vbrother", "vsister", "student", "supporter"]),
  city: text(60).optional().default(""),
  heardFrom: z.enum(["", ...HEARD_FROM]).optional().default(""),
  notes: text(1000).optional().default(""),
});

export async function joinCommunity(_: FormState, fd: FormData): Promise<FormState> {
  if (fd.get("website")) return { ok: true };
  if (await limited()) return { ok: false, error: "rate" };
  const p = joinSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error);
  const d = p.data;
  // Anything from a sister goes to the sisters' section (female admins only).
  const section = d.gender === "F" || d.role === "vsister" ? "SISTERS" : "BROTHERS";
  try {
    await db.memberApplication.create({ data: { ...d, gender: section === "SISTERS" ? "F" : d.gender, section } });
    return { ok: true };
  } catch {
    return { ok: false, error: "server" };
  }
}

const questionSchema = z.object({ question: text(800).min(8), lang: z.enum(["ur", "en", "ar"]) });

export async function askQuestion(_: FormState, fd: FormData): Promise<FormState> {
  if (fd.get("website")) return { ok: true };
  if (await limited()) return { ok: false, error: "rate" };
  const p = questionSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error);
  try {
    await db.question.create({ data: { question: p.data.question, lang: p.data.lang } });
    return { ok: true };
  } catch {
    return { ok: false, error: "server" };
  }
}
