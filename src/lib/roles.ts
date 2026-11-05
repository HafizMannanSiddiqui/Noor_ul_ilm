export const ROLES = ["SUPER_ADMIN", "BROTHERS_ADMIN", "SISTERS_ADMIN", "SCHOLAR"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Super admin · نگرانِ اعلیٰ",
  BROTHERS_ADMIN: "Brothers' admin · منتظم (بھائی)",
  SISTERS_ADMIN: "Sisters' admin · منتظمہ (بہنیں)",
  SCHOLAR: "Scholar reviewer · عالمِ دین",
};

export function parseRoles(csv: string): Role[] {
  return csv
    .split(",")
    .map((r) => r.trim())
    .filter((r): r is Role => (ROLES as readonly string[]).includes(r));
}

type U = { roles: Role[]; gender: "M" | "F" };
const has = (u: U, ...r: Role[]) => r.some((x) => u.roles.includes(x));

/** Central permission rules. Every server action checks these — hidden buttons are not security. */
export const can = {
  editPosts: (u: U) => has(u, "SUPER_ADMIN", "BROTHERS_ADMIN", "SISTERS_ADMIN", "SCHOLAR"),
  approvePosts: (u: U) => has(u, "SCHOLAR"),
  editTexts: (u: U) => has(u, "SUPER_ADMIN", "SCHOLAR"),
  verifyTexts: (u: U) => has(u, "SCHOLAR"),
  /** Women's section (classes, scholars, sisters' events, sisters' data): FEMALE sisters' admins only. */
  sistersSection: (u: U) => has(u, "SISTERS_ADMIN") && u.gender === "F",
  brothersSection: (u: U) => has(u, "SUPER_ADMIN", "BROTHERS_ADMIN"),
  anyEvents: (u: U) => can.sistersSection(u) || can.brothersSection(u),
  eventAudience: (u: U, audience: string) => (audience === "sisters" ? can.sistersSection(u) : can.brothersSection(u)),
  answerQuestions: (u: U) => has(u, "SCHOLAR"),
  manageUsers: (u: U) => has(u, "SUPER_ADMIN"),
};
