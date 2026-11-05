"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { audit, checkPassword, createSession, destroySession, hashPassword } from "@/lib/auth";

let dummy: string | undefined;

/* Brute-force protection: 8 failed attempts per IP+email per 15 minutes. */
const fails = new Map<string, number[]>();
const WINDOW = 15 * 60_000;

export async function login(fd: FormData) {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const ip = ((await headers()).get("x-forwarded-for") || "local").split(",")[0].trim();
  const key = `${ip}|${email}`;
  const now = Date.now();
  const recent = (fails.get(key) || []).filter((t) => now - t < WINDOW);
  if (recent.length >= 8) redirect("/admin/login?e=rate");

  const user = await db.user.findUnique({ where: { email } });
  // Always run bcrypt so response time doesn't reveal whether the email exists.
  dummy ??= await hashPassword("noor-ul-ilm-timing-dummy");
  const ok = await checkPassword(password, user?.passwordHash ?? dummy);
  if (!user || !user.active || !ok) {
    fails.set(key, [...recent, now]);
    redirect("/admin/login?e=1");
  }
  fails.delete(key);
  await createSession(user.id);
  await audit(user.id, "login", "User", user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
