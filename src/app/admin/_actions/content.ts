"use server";
/* All admin write operations. Each one re-checks permissions on the server. */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { audit, hashPassword, requireUser } from "@/lib/auth";
import { can, ROLES, type Role } from "@/lib/roles";
import { AREAS, CATEGORIES } from "@/content/site";

const s = (fd: FormData, k: string, max = 20000) => String(fd.get(k) ?? "").trim().slice(0, max);
const tri = (fd: FormData, base: string, max = 20000) => ({ [`${base}Ur`]: s(fd, `${base}Ur`, max), [`${base}En`]: s(fd, `${base}En`, max), [`${base}Ar`]: s(fd, `${base}Ar`, max) });
const oneOf = <T extends string>(v: string, list: readonly T[], fallback: T): T => ((list as readonly string[]).includes(v) ? (v as T) : fallback);
const back = (path: string, msg: string, err = false): never => redirect(`${path}${path.includes("?") ? "&" : "?"}${err ? "err" : "ok"}=${encodeURIComponent(msg)}`);
const refresh = () => revalidatePath("/", "layout");

/* ============================ POSTS ============================ */
export async function savePost(fd: FormData) {
  const u = await requireUser(can.editPosts);
  const id = s(fd, "id");
  const slug = s(fd, "slug", 80).toLowerCase();
  const formPath = id ? `/admin/posts/${id}` : "/admin/posts/new";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length < 3) back(formPath, "Slug: lowercase English letters, numbers and dashes only (e.g. namaz-ka-tariqa).", true);
  const category = s(fd, "category");
  if (!CATEGORIES.some((c) => c.id === category)) back(formPath, "Choose a category.", true);
  const data = {
    slug, category, cover: oneOf(s(fd, "cover"), ["star", "drop", "moon"] as const, "star"),
    ...tri(fd, "title", 300), ...tri(fd, "summary", 1000), ...tri(fd, "body"), ...tri(fd, "refs", 4000),
  } as Record<string, string>;
  if (!data.titleUr || !data.titleEn || !data.bodyUr || !data.bodyEn || !data.summaryUr || !data.summaryEn) back(formPath, "Urdu and English title, summary and body are required.", true);
  const clash = await db.post.findFirst({ where: { slug, NOT: id ? { id } : undefined } });
  if (clash) back(formPath, "Another post already uses this slug.", true);

  const status = s(fd, "intent") === "submit" ? "PENDING_REVIEW" : "DRAFT";
  // Any edit removes the previous approval: the scholar must approve the new text.
  const reset = { status, reviewerId: null, reviewedAt: null };
  let postId = id;
  if (id) {
    await db.post.update({ where: { id }, data: { ...data, ...reset } });
  } else {
    postId = (await db.post.create({ data: { ...data, ...reset, createdById: u.id } as never })).id;
  }
  await audit(u.id, status === "PENDING_REVIEW" ? "post.submit" : "post.save", "Post", postId);
  refresh();
  back(`/admin/posts/${postId}`, status === "PENDING_REVIEW" ? "Saved and sent to a scholar for review." : "Draft saved.");
}

export async function reviewPost(fd: FormData) {
  const u = await requireUser(can.approvePosts);
  const id = s(fd, "id");
  const decision = s(fd, "decision");
  const note = s(fd, "note", 2000);
  if (decision === "approve") {
    await db.post.update({ where: { id }, data: { status: "APPROVED", reviewerId: u.id, reviewedAt: new Date(), reviewNote: note } });
  } else {
    await db.post.update({ where: { id }, data: { status: "DRAFT", reviewerId: null, reviewedAt: null, reviewNote: note } });
  }
  await audit(u.id, `post.${decision}`, "Post", id);
  refresh();
  back(`/admin/posts/${id}`, decision === "approve" ? "Approved and published. Your name now shows as reviewer." : "Returned to draft with your note.");
}

export async function deletePost(fd: FormData) {
  const u = await requireUser((x) => can.manageUsers(x) || can.approvePosts(x));
  const id = s(fd, "id");
  await db.post.delete({ where: { id } });
  await audit(u.id, "post.delete", "Post", id);
  refresh();
  back("/admin/posts", "Post deleted.");
}

/* ======================= VERSES & HADITH ======================= */
export async function saveText(fd: FormData) {
  const u = await requireUser(can.editTexts);
  const id = s(fd, "id");
  const key = s(fd, "key", 60).toLowerCase();
  const formPath = id ? `/admin/texts/${id}` : "/admin/texts/new";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) back(formPath, "Key: lowercase letters, numbers, dashes (e.g. baqarah-286).", true);
  const data = {
    key, kind: oneOf(s(fd, "kind"), ["AYAH", "HADITH"] as const, "AYAH"),
    arabic: s(fd, "arabic", 5000), ur: s(fd, "ur", 5000), en: s(fd, "en", 5000),
    refUr: s(fd, "refUr", 300), refEn: s(fd, "refEn", 300), refAr: s(fd, "refAr", 300),
    grading: s(fd, "grading", 300), partial: fd.get("partial") === "on", showOnHome: fd.get("showOnHome") === "on",
  };
  if (!data.arabic || !data.ur || !data.en || !data.refEn || !data.refUr) back(formPath, "Arabic, Urdu, English and references are required.", true);
  if (await db.sacredText.findFirst({ where: { key, NOT: id ? { id } : undefined } })) back(formPath, "This key is already used.", true);
  let textId = id;
  if (id) {
    const old = await db.sacredText.findUniqueOrThrow({ where: { id } });
    const changed = old.arabic !== data.arabic || old.ur !== data.ur || old.en !== data.en || old.refEn !== data.refEn || old.refUr !== data.refUr || old.grading !== data.grading;
    await db.sacredText.update({ where: { id }, data: { ...data, ...(changed ? { verified: false, verifierId: null, verifiedAt: null } : {}) } });
  } else {
    textId = (await db.sacredText.create({ data })).id;
  }
  await audit(u.id, "text.save", "SacredText", textId);
  refresh();
  back(`/admin/texts/${textId}`, "Saved. A scholar must verify the text before it is treated as verified.");
}

export async function verifyText(fd: FormData) {
  const u = await requireUser(can.verifyTexts);
  const id = s(fd, "id");
  const on = s(fd, "verified") === "1";
  await db.sacredText.update({ where: { id }, data: on ? { verified: true, verifierId: u.id, verifiedAt: new Date() } : { verified: false, verifierId: null, verifiedAt: null } });
  await audit(u.id, on ? "text.verify" : "text.unverify", "SacredText", id);
  refresh();
  back(`/admin/texts/${id}`, on ? "Marked as verified." : "Verification removed.");
}

export async function deleteText(fd: FormData) {
  const u = await requireUser(can.verifyTexts);
  const id = s(fd, "id");
  await db.sacredText.delete({ where: { id } });
  await audit(u.id, "text.delete", "SacredText", id);
  refresh();
  back("/admin/texts", "Deleted.");
}

/* =========================== Q & A =========================== */
export async function answerQuestion(fd: FormData) {
  const u = await requireUser(can.answerQuestions);
  const id = s(fd, "id");
  const publish = fd.get("published") === "on";
  const data = { ...tri(fd, "question", 800), ...tri(fd, "answer", 5000) };
  if (publish && (!data.answerUr || !data.answerEn || !data.questionUr || !data.questionEn)) back("/admin/questions", "To publish, fill the question and answer in Urdu and English.", true);
  await db.question.update({ where: { id }, data: { ...data, published: publish, answererId: u.id, answeredAt: new Date() } });
  await audit(u.id, publish ? "question.publish" : "question.save", "Question", id);
  refresh();
  back("/admin/questions", publish ? "Answer published." : "Saved (not published).");
}

export async function deleteQuestion(fd: FormData) {
  const u = await requireUser(can.answerQuestions);
  const id = s(fd, "id");
  await db.question.delete({ where: { id } });
  await audit(u.id, "question.delete", "Question", id);
  refresh();
  back("/admin/questions", "Question deleted.");
}

/* =========================== EVENTS =========================== */
export async function saveEvent(fd: FormData) {
  const u = await requireUser(can.anyEvents);
  const id = s(fd, "id");
  const formPath = id ? `/admin/events/${id}` : "/admin/events/new";
  const audience = oneOf(s(fd, "audience"), ["all", "brothers", "sisters"] as const, "all");
  if (!can.eventAudience(u, audience)) back(formPath, audience === "sisters" ? "Only sisters' admins can manage sisters' events." : "Only brothers' admins can manage brothers'/public events.", true);
  if (id) {
    const old = await db.event.findUniqueOrThrow({ where: { id } });
    if (!can.eventAudience(u, old.audience)) back("/admin/events", "You cannot edit this event.", true);
  }
  const date = s(fd, "date", 10);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) back(formPath, "Invalid date.", true);
  const data = {
    type: oneOf(s(fd, "type"), ["naat", "dars", "ijtima", "milad", "gyarwi"] as const, "dars"),
    area: oneOf(s(fd, "area"), AREAS.map((a) => a.id), "saddar"),
    audience, date,
    ...tri(fd, "title", 300), ...tri(fd, "time", 200), ...tri(fd, "venue", 300), ...tri(fd, "recurring", 200), ...tri(fd, "speaker", 400),
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
  } as Record<string, string | boolean>;
  if (!data.titleUr || !data.titleEn) back(formPath, "Title in Urdu and English is required.", true);
  if (!date && !data.recurringUr) back(formPath, "Give a date, or fill 'Repeats' for a recurring event.", true);
  const eventId = id ? (await db.event.update({ where: { id }, data })).id : (await db.event.create({ data: data as never })).id;
  await audit(u.id, "event.save", "Event", eventId);
  refresh();
  back("/admin/events", "Event saved.");
}

export async function deleteEvent(fd: FormData) {
  const u = await requireUser(can.anyEvents);
  const id = s(fd, "id");
  const ev = await db.event.findUniqueOrThrow({ where: { id } });
  if (!can.eventAudience(u, ev.audience)) back("/admin/events", "You cannot delete this event.", true);
  await db.event.delete({ where: { id } });
  await audit(u.id, "event.delete", "Event", id);
  refresh();
  back("/admin/events", "Event deleted.");
}

/* ================ SISTERS' SECTION (female admins only) ================ */
export async function saveClass(fd: FormData) {
  const u = await requireUser(can.sistersContent);
  const id = s(fd, "id");
  const teacherId = s(fd, "teacherId") || null;
  const data = {
    subject: oneOf(s(fd, "subject"), ["quran", "tajweed", "fiqh", "seerat"] as const, "quran"),
    level: oneOf(s(fd, "level"), ["beginner", "intermediate", "advanced"] as const, "beginner"),
    ageGroup: oneOf(s(fd, "ageGroup"), ["girls", "young", "women"] as const, "women"),
    mode: oneOf(s(fd, "mode"), ["online", "inperson", "both"] as const, "inperson"),
    ...tri(fd, "when", 200), ...tri(fd, "where", 300),
    teacherId, active: fd.get("active") === "on", sort: Number(s(fd, "sort")) || 0,
  } as Record<string, unknown>;
  if (!data.whenUr || !data.whenEn || !data.whereUr || !data.whereEn) back(id ? `/admin/classes/${id}` : "/admin/classes/new", "Fill 'When' and 'Where' in Urdu and English.", true);
  const cid = id ? (await db.classSession.update({ where: { id }, data })).id : (await db.classSession.create({ data: data as never })).id;
  await audit(u.id, "class.save", "ClassSession", cid);
  refresh();
  back("/admin/classes", "Class saved.");
}

export async function deleteClass(fd: FormData) {
  const u = await requireUser(can.sistersContent);
  const id = s(fd, "id");
  await db.classSession.delete({ where: { id } });
  await audit(u.id, "class.delete", "ClassSession", id);
  refresh();
  back("/admin/classes", "Class deleted.");
}

export async function saveScholar(fd: FormData) {
  const u = await requireUser(can.sistersContent);
  const id = s(fd, "id");
  const data = { ...tri(fd, "name", 200), ...tri(fd, "title", 200), ...tri(fd, "subjects", 300), ...tri(fd, "bio", 2000), active: fd.get("active") === "on", sort: Number(s(fd, "sort")) || 0 } as Record<string, unknown>;
  if (!data.nameUr || !data.nameEn) back(id ? `/admin/scholars/${id}` : "/admin/scholars/new", "Name in Urdu and English is required.", true);
  const sid = id ? (await db.scholar.update({ where: { id }, data })).id : (await db.scholar.create({ data: data as never })).id;
  await audit(u.id, "scholar.save", "Scholar", sid);
  refresh();
  back("/admin/scholars", "Profile saved.");
}

export async function deleteScholar(fd: FormData) {
  const u = await requireUser(can.sistersContent);
  const id = s(fd, "id");
  await db.scholar.delete({ where: { id } });
  await audit(u.id, "scholar.delete", "Scholar", id);
  refresh();
  back("/admin/scholars", "Profile deleted.");
}

const STATUSES = ["NEW", "CONTACTED", "ENROLLED", "CLOSED"] as const;

export async function setRegistrationStatus(fd: FormData) {
  const u = await requireUser(can.sistersSection);
  const id = s(fd, "id");
  await db.sisterRegistration.update({ where: { id }, data: { status: oneOf(s(fd, "status"), STATUSES, "NEW") } });
  await audit(u.id, "registration.status", "SisterRegistration", id);
  back("/admin/registrations", "Status updated.");
}

export async function deleteRegistration(fd: FormData) {
  const u = await requireUser(can.sistersSection);
  const id = s(fd, "id");
  await db.sisterRegistration.delete({ where: { id } });
  await audit(u.id, "registration.delete", "SisterRegistration", id);
  back("/admin/registrations", "Registration deleted.");
}

export async function setMemberStatus(fd: FormData) {
  const u = await requireUser();
  const id = s(fd, "id");
  const m = await db.memberApplication.findUniqueOrThrow({ where: { id } });
  const allowed = m.section === "SISTERS" ? can.sistersSection(u) : can.brothersSection(u);
  if (!allowed) back("/admin/members", "Not allowed.", true);
  if (s(fd, "delete") === "1") await db.memberApplication.delete({ where: { id } });
  else await db.memberApplication.update({ where: { id }, data: { status: oneOf(s(fd, "status"), STATUSES, "NEW") } });
  await audit(u.id, "member.update", "MemberApplication", id);
  back("/admin/members", "Updated.");
}

/* ============================ USERS ============================ */
function parseUserForm(fd: FormData) {
  const roles = ROLES.filter((r) => fd.get(`role_${r}`) === "on") as Role[];
  const gender = s(fd, "gender") === "F" ? "F" : "M";
  return { name: s(fd, "name", 120), email: s(fd, "email", 200).toLowerCase(), title: s(fd, "title", 60), gender, roles };
}

export async function createUser(fd: FormData) {
  const u = await requireUser(can.manageUsers);
  const d = parseUserForm(fd);
  const pw = s(fd, "password", 200);
  if (!d.name || !/^\S+@\S+\.\S+$/.test(d.email)) back("/admin/users", "Name and a valid email are required.", true);
  if (pw.length < 10) back("/admin/users", "Password must be at least 10 characters.", true);
  if (!d.roles.length) back("/admin/users", "Choose at least one role.", true);
  if (d.roles.includes("SISTERS_ADMIN") && d.gender !== "F") back("/admin/users", "Sisters' admin must be a woman (privacy rule).", true);
  if (await db.user.findUnique({ where: { email: d.email } })) back("/admin/users", "This email already has an account.", true);
  const nu = await db.user.create({ data: { ...d, roles: d.roles.join(","), passwordHash: await hashPassword(pw) } });
  await audit(u.id, "user.create", "User", nu.id);
  back("/admin/users", `Account created for ${d.email}.`);
}

export async function updateUser(fd: FormData) {
  const u = await requireUser(can.manageUsers);
  const id = s(fd, "id");
  const d = parseUserForm(fd);
  const active = fd.get("active") === "on";
  if (!d.roles.length) back("/admin/users", "Choose at least one role.", true);
  if (d.roles.includes("SISTERS_ADMIN") && d.gender !== "F") back("/admin/users", "Sisters' admin must be a woman (privacy rule).", true);
  if (id === u.id && (!active || !d.roles.includes("SUPER_ADMIN"))) back("/admin/users", "You cannot remove your own super-admin access.", true);
  const pw = s(fd, "password", 200);
  if (pw && pw.length < 10) back("/admin/users", "New password must be at least 10 characters.", true);
  await db.user.update({
    where: { id },
    data: { name: d.name, title: d.title, gender: d.gender, roles: d.roles.join(","), active, ...(pw ? { passwordHash: await hashPassword(pw) } : {}) },
  });
  await audit(u.id, pw ? "user.update+password" : "user.update", "User", id);
  back("/admin/users", "Account updated.");
}
