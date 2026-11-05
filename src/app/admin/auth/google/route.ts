import { NextResponse } from "next/server";
import { GOOGLE_STATE_COOKIE, googleAuthUrl, googleEnabled, pkceChallenge, randomToken } from "@/lib/google";
import { SITE_URL } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Step 1: send the person to Google's account chooser. */
export async function GET() {
  if (!googleEnabled()) return NextResponse.redirect(`${SITE_URL}/admin/login?e=google-off`);
  const state = randomToken();
  const nonce = randomToken();
  const verifier = randomToken();
  const res = NextResponse.redirect(googleAuthUrl(state, nonce, await pkceChallenge(verifier)));
  res.cookies.set(GOOGLE_STATE_COOKIE, JSON.stringify({ state, nonce, verifier }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin/auth/google",
    maxAge: 600,
  });
  return res;
}
