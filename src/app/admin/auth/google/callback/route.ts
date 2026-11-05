import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { audit, createSession } from "@/lib/auth";
import { GOOGLE_STATE_COOKIE, googleEmailFromCode, googleEnabled } from "@/lib/google";
import { SITE_URL } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Step 2: Google sends the person back here. Sign in only if an active admin account has this email. */
export async function GET(req: NextRequest) {
  const fail = (e: string) => {
    const res = NextResponse.redirect(`${SITE_URL}/admin/login?e=${e}`);
    res.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: "/admin/auth/google" });
    return res;
  };
  if (!googleEnabled()) return fail("google-off");

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  let saved: { state?: string; nonce?: string; verifier?: string } = {};
  try { saved = JSON.parse(req.cookies.get(GOOGLE_STATE_COOKIE)?.value || "{}"); } catch {}
  if (!code || !state || !saved.state || state !== saved.state || !saved.nonce || !saved.verifier) return fail("google");

  let email: string | null = null;
  try { email = await googleEmailFromCode(code, saved.verifier, saved.nonce); } catch { email = null; }
  if (!email) return fail("google");

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    await audit(null, `login.google.denied:${email}`, "User");
    return fail("google-nouser");
  }
  await createSession(user.id);
  await audit(user.id, "login.google", "User", user.id);
  const res = NextResponse.redirect(`${SITE_URL}/admin`);
  res.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: "/admin/auth/google" });
  return res;
}
