import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { SITE_URL } from "./settings";

/*
 * "Sign in with Google" for admin accounts (OpenID Connect, authorization-code flow + PKCE).
 * Free: create an OAuth client in Google Cloud Console and put its ID/secret in .env.
 * Google only proves WHO the person is. They can enter only if a super admin has already
 * created an active admin account with the same email address.
 */

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const googleEnabled = () => Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

export const GOOGLE_STATE_COOKIE = "nui_google";
export const googleRedirectUri = () => `${SITE_URL}/admin/auth/google/callback`;

const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

const b64url = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");
export const randomToken = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
export async function pkceChallenge(verifier: string) {
  return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
}

export function googleAuthUrl(state: string, nonce: string, challenge: string) {
  const q = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state, nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

/** Exchange the code and return the verified Google email, or null. */
export async function googleEmailFromCode(code: string, verifier: string, nonce: string): Promise<string | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code, code_verifier: verifier,
      client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: googleRedirectUri(), grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const { id_token } = (await res.json()) as { id_token?: string };
  if (!id_token) return null;
  const { payload } = await jwtVerify(id_token, JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: GOOGLE_CLIENT_ID,
  });
  if (payload.nonce !== nonce || payload.email_verified !== true || typeof payload.email !== "string") return null;
  return payload.email.toLowerCase();
}
