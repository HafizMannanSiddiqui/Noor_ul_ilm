import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { type Role, parseRoles } from "./roles";

export const SESSION_COOKIE = "nui_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters)");
  return new TextEncoder().encode(s);
}

export type SessionUser = { id: string; name: string; email: string; gender: "M" | "F"; roles: Role[]; title: string };

export async function verifyToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Current user — re-loaded from the DB on every request so deactivation/role changes apply immediately. */
export async function getUser(): Promise<SessionUser | null> {
  const id = await verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!id) return null;
  const u = await db.user.findUnique({ where: { id } });
  if (!u || !u.active) return null;
  return { id: u.id, name: u.name, email: u.email, gender: u.gender === "F" ? "F" : "M", roles: parseRoles(u.roles), title: u.title };
}

/** Require login and (optionally) a permission. Redirects otherwise. */
export async function requireUser(check?: (u: SessionUser) => boolean): Promise<SessionUser> {
  const u = await getUser();
  if (!u) redirect("/admin/login");
  if (check && !check(u)) redirect("/admin?denied=1");
  return u;
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
export const checkPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

export async function audit(userId: string | null, action: string, entity: string, entityId = "") {
  await db.auditLog.create({ data: { userId, action, entity, entityId } });
}
