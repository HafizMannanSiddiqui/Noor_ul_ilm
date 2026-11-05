import "server-only";
import type { Prisma, SacredText } from "@prisma/client";
import { db } from "./db";
import { SHOW_DRAFTS } from "./settings";
import { todayPK } from "./lang";

/** Posts visible to the public: approved only (plus pending drafts when SHOW_DRAFTS is on). */
export const publicPostWhere = (): Prisma.PostWhereInput =>
  SHOW_DRAFTS ? { status: { in: ["APPROVED", "PENDING_REVIEW"] } } : { status: "APPROVED" };

export const publicTextWhere = (): Prisma.SacredTextWhereInput => (SHOW_DRAFTS ? {} : { verified: true });

/** Upcoming dated events (soonest first), followed by recurring ones. */
export async function upcomingEvents(where: Prisma.EventWhereInput = {}) {
  const today = todayPK();
  const [dated, recurring] = await Promise.all([
    db.event.findMany({ where: { ...where, published: true, date: { gte: today } }, orderBy: { date: "asc" } }),
    db.event.findMany({ where: { ...where, published: true, date: "" }, orderBy: { createdAt: "asc" } }),
  ]);
  return [...dated, ...recurring];
}

/** Find [[ayah:key]] / [[hadith:key]] references in post bodies and load those texts. */
export async function textsForBodies(...bodies: string[]): Promise<Map<string, SacredText>> {
  const keys = new Set<string>();
  for (const b of bodies) for (const m of b.matchAll(/\[\[(?:ayah|hadith):([\w-]+)\]\]/g)) keys.add(m[1]);
  if (!keys.size) return new Map();
  const rows = await db.sacredText.findMany({ where: { key: { in: [...keys] }, ...publicTextWhere() } });
  return new Map(rows.map((r) => [r.key, r]));
}

/** The next featured gathering (e.g. the monthly Dars), shown as a banner. */
export const nextFeaturedEvent = () =>
  db.event.findFirst({ where: { published: true, featured: true, date: { gte: todayPK() } }, orderBy: { date: "asc" } });

/** Public community size: a number only (never names). Closed requests are not counted. */
export const communityCount = () => db.memberApplication.count({ where: { status: { not: "CLOSED" } } });
