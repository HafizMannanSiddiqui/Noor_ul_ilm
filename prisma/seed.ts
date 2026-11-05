/* Seeds the first super admin, optional demo accounts, and the real Noor-ul-Ilm schedule.
   Run: npm run setup   (safe to re-run). On Vercel: runs on every deploy with --first-run. */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { MASAIL } from "./masail";

const db = new PrismaClient();

async function upsertUser(email: string, name: string, gender: "M" | "F", roles: string, password: string, title = "") {
  const passwordHash = await bcrypt.hash(password, 12);
  return db.user.upsert({
    where: { email },
    update: {},
    create: { email, name, gender, roles, passwordHash, title },
  });
}


/** One-time: basic Hanafi masail posts, sent for scholar review (see prisma/masail.ts). */
async function masailV1() {
  const MARK = "seed:masail-v1";
  if (await db.auditLog.findFirst({ where: { action: MARK } })) return;
  for (const p of MASAIL) {
    await db.post.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, status: "PENDING_REVIEW" } });
  }
  await db.auditLog.create({ data: { action: MARK, entity: "Seed" } });
  console.log(`✓ ${MASAIL.length} masail posts (pending scholar review)`);
}

const HOUSE_170 = {
  whereUr: "مکان نمبر 170، امتیاز شہید روڈ (رہائش گاہ جناب عبدالرحمٰن صدیقی صاحب)",
  whereEn: "House No. 170, Imtiaz Shaheed Road (residence of Mr. Abdul Rahman Siddiqui)",
  whereAr: "المنزل رقم 170، طريق امتياز شهيد (منزل السيد عبد الرحمن صديقي)",
};

/**
 * One-time update (recorded in the activity log so it never runs twice):
 * removes the early sample content and adds the real schedule. Rows that admins
 * created, approved or verified are never touched.
 */
async function realContentV2() {
  const MARK = "seed:real-content-v2";
  if (await db.auditLog.findFirst({ where: { action: MARK } })) return;

  await db.event.deleteMany({ where: { titleEn: { in: ["Mehfil-e-Naat", "Youth Dars: Lives of the Sahaba", "Mehfil-e-Gyarhween Sharif", "Monthly Sisters' Ijtima", "Weekly Dars-e-Quran (sisters)"] } } });
  await db.classSession.deleteMany({ where: { whenEn: { in: ["Every Tuesday, 10:00–11:00 am", "Sat & Sun, 4:30–5:30 pm", "Every Thursday, 8:30–9:30 pm", "Every Sunday, 11:00 am–12:00 pm", "Mon & Wed, 2:00–3:00 pm"] } } });
  await db.post.deleteMany({ where: { slug: { in: ["ilm-farz", "wudu-faraiz", "ghar-e-hira"] }, status: { not: "APPROVED" } } });
  await db.sacredText.deleteMany({ where: { key: { in: ["alaq-1", "taha-114", "zumar-9", "maidah-6", "ibnmajah-224"] }, verified: false } });
  await db.question.deleteMany({ where: { published: false, questionEn: { in: ["Do young people need a teacher to learn Deen, or is the internet enough?", "How can I stay regular in Salah alongside my studies?"] } } });
  await db.scholar.updateMany({ where: { bioEn: "[Short bio]" }, data: { bioUr: "", bioEn: "", bioAr: "" } });
  await db.scholar.updateMany({ where: { subjectsEn: "[Subjects]" }, data: { subjectsUr: "", subjectsEn: "", subjectsAr: "" } });
  await db.event.updateMany({ where: { timeEn: "[Fixed time]" }, data: { timeUr: "", timeEn: "", timeAr: "" } });
  await db.event.updateMany({ where: { recurringEn: "Mornings — [days]" }, data: { recurringUr: "صبح کی کلاس", recurringEn: "Mornings", recurringAr: "صباحًا" } });

  // ---------- Sisters' schedule (events: shown on Home and Events) ----------
  // Three Saturdays a month: Dars at different locations. One Saturday: the big monthly Dars.
  const realEvents = [
    {
      id: "sisters-saturday-dars",
      type: "dars", area: "other", audience: "sisters", date: "",
      recurringUr: "ہر سنیچر (ماہ میں تین بار)", recurringEn: "Saturdays (3 a month)", recurringAr: "أيام السبت (3 مرات شهريًا)",
      titleUr: "ہفتہ وار درسِ قرآن برائے خواتین", titleEn: "Weekly Dars-e-Quran for Women", titleAr: "درس القرآن الأسبوعي للنساء",
      timeUr: "", timeEn: "", timeAr: "",
      venueUr: "ہر ہفتے مختلف مقام پر — تفصیل واٹس ایپ پر", venueEn: "A different location each week — details on WhatsApp", venueAr: "مكان مختلف كل أسبوع — التفاصيل عبر واتساب",
    },
    {
      id: "sisters-thursday-dars",
      type: "dars", area: "saddar", audience: "sisters", date: "",
      recurringUr: "ہر جمعرات", recurringEn: "Every Thursday", recurringAr: "كل خميس",
      titleUr: "جمعرات کا درسِ قرآن برائے خواتین", titleEn: "Thursday Dars-e-Quran for Women", titleAr: "درس القرآن للنساء يوم الخميس",
      timeUr: "سہ پہر 3:00 سے 4:00 بجے تک", timeEn: "3:00 – 4:00 pm", timeAr: "3:00 – 4:00 عصرًا",
      venueUr: "مکان نمبر 170، امتیاز شہید روڈ (رہائش گاہ جناب عبدالرحمٰن صدیقی صاحب)", venueEn: "House No. 170, Imtiaz Shaheed Road (residence of Mr. Abdul Rahman Siddiqui)", venueAr: "المنزل رقم 170، طريق امتياز شهيد (منزل السيد عبد الرحمن صديقي)",
    },
    {
      id: "sisters-morning-class",
      type: "dars", area: "saddar", audience: "sisters", date: "",
      recurringUr: "صبح کی کلاس", recurringEn: "Mornings", recurringAr: "صباحًا",
      titleUr: "صبح کی کلاس: قرآن و حدیث (صرف خواتین)", titleEn: "Morning Quran & Hadith Class (women only)", titleAr: "درس الصباح: القرآن والحديث (للنساء فقط)",
      timeUr: "صبح 8:00 سے 9:00 بجے تک", timeEn: "8:00 – 9:00 am", timeAr: "8:00 – 9:00 صباحًا",
      venueUr: "مکان نمبر 170، امتیاز شہید روڈ (رہائش گاہ جناب عبدالرحمٰن صدیقی صاحب)", venueEn: "House No. 170, Imtiaz Shaheed Road (residence of Mr. Abdul Rahman Siddiqui)", venueAr: "المنزل رقم 170، طريق امتياز شهيد (منزل السيد عبد الرحمن صديقي)",
    },
    {
      id: "monthly-dars-2026-11",
      type: "dars", area: "saddar", audience: "sisters", date: "2026-11-07", featured: true,
      titleUr: "11واں ماہانہ درسِ قرآن برائے خواتین", titleEn: "11th Monthly Dars-e-Quran for Women", titleAr: "درس القرآن الشهري الحادي عشر للنساء",
      timeUr: "دوپہر 2:15 سے 3:15 بجے تک", timeEn: "2:15 – 3:15 pm", timeAr: "2:15 – 3:15 ظهرًا",
      venueUr: "نالج ہوم اکیڈمی، نزد کولہو والا احاطہ، دہلی روڈ، صدر کینٹ", venueEn: "Knowledge Home Academy, near Kolhu Wala Ahata, Delhi Road, Saddar Cantt", venueAr: "أكاديمية نولج هوم، قرب كولهو والا أحاطة، طريق دلهي، صدر كانت",
      speakerUr: "زوجۂ محترمہ جناب حضرت مولانا مفتی پیر سید علی زین العابدین شاہ صاحب کرمانی مدظلہ",
      speakerEn: "The respected wife of Hazrat Maulana Mufti Pir Syed Ali Zain-ul-Abideen Shah Sahib Kirmani (madda zilluhu)",
      speakerAr: "حرم فضيلة المفتي بير سيد علي زين العابدين شاه الكرماني مدّ ظلّه",
    },
  ];
  for (const { id, ...data } of realEvents) {
    await db.event.upsert({ where: { id }, update: {}, create: { id, ...data } });
  }

  // ---------- Women's Corner class schedule ----------
  const classes = [
    { id: "class-morning", sort: 1, subject: "quran", level: "beginner", ageGroup: "women", mode: "inperson",
      whenUr: "صبح 8:00 تا 9:00", whenEn: "Mornings, 8:00–9:00 am", whenAr: "صباحًا، 8:00–9:00", ...HOUSE_170 },
    { id: "class-thursday", sort: 2, subject: "quran", level: "beginner", ageGroup: "women", mode: "inperson",
      whenUr: "ہر جمعرات، سہ پہر 3:00 تا 4:00", whenEn: "Every Thursday, 3:00–4:00 pm", whenAr: "كل خميس، 3:00–4:00 عصرًا", ...HOUSE_170 },
    { id: "class-saturday", sort: 3, subject: "quran", level: "beginner", ageGroup: "women", mode: "inperson",
      whenUr: "سنیچر (ماہ میں تین بار)", whenEn: "Saturdays (3 a month)", whenAr: "أيام السبت (3 مرات شهريًا)",
      whereUr: "ہر ہفتے مختلف مقام پر — تفصیل واٹس ایپ پر", whereEn: "A different location each week — details on WhatsApp", whereAr: "مكان مختلف كل أسبوع — التفاصيل عبر واتساب" },
  ];
  for (const { id, ...data } of classes) {
    await db.classSession.upsert({ where: { id }, update: {}, create: { id, ...data } });
  }

  await db.auditLog.create({ data: { action: MARK, entity: "Seed" } });
  console.log("✓ Real schedule added, sample content removed");
}

async function main() {
  // On Vercel this runs on every deploy with --first-run: accounts and scholars are only
  // created in an empty database, so later admin edits are never overwritten.
  const firstRun = !process.argv.includes("--first-run") || (await db.user.count()) === 0;
  // The super admin from ADMIN_EMAIL (a username such as "admin" also works) is created if missing.
  // An existing account is never changed here — change passwords in Admin > Admin accounts.
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPw || adminPw.length < 10) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars) in .env / Vercel");
  await upsertUser(adminEmail, process.env.ADMIN_NAME || "Administrator", "M", "SUPER_ADMIN", adminPw);
  console.log("✓ Super admin:", adminEmail);

  if (firstRun) {

    if (process.env.SEED_DEMO === "true") {
      const pw = process.env.DEMO_PASSWORD || "Demo!Pass2026";
      await upsertUser("brothers@demo.local", "Demo Brothers Admin", "M", "BROTHERS_ADMIN", pw);
      await upsertUser("sisters@demo.local", "Demo Sisters Admin", "F", "SISTERS_ADMIN", pw);
      await upsertUser("mufti@demo.local", "[Mufti Sahib — demo]", "M", "SCHOLAR", pw, "Mufti");
      await upsertUser("aalimah@demo.local", "[Aalimah Sahiba — demo]", "F", "SCHOLAR,SISTERS_ADMIN", pw, "Aalimah");
      console.log("✓ Demo accounts (password from DEMO_PASSWORD): brothers@ / sisters@ / mufti@ / aalimah@demo.local");
    }

  // ---------- Female scholars (text only, no photos) ----------
  if ((await db.scholar.count()) === 0) {
    await db.scholar.createMany({
      data: [
        { sort: 1, nameUr: "اہلیہ محترمہ مفتی حسیب قادری صاحب", nameEn: "Mrs. Mufti Haseeb Qadri Sahib", nameAr: "حرم المفتي حسيب القادري", titleUr: "عالمہ", titleEn: "Aalimah", titleAr: "عالمة" },
        { sort: 2, nameUr: "اہلیہ محترمہ عبدالرحمٰن صدیقی صاحب", nameEn: "Mrs. Abdul Rahman Siddiqui Sahib", nameAr: "حرم عبد الرحمن صديقي", titleUr: "عالمہ", titleEn: "Aalimah", titleAr: "عالمة" },
        { sort: 3, nameUr: "اہلیہ محترمہ کاشف اسلم صاحب", nameEn: "Mrs. Kashif Aslam Sahib", nameAr: "حرم كاشف أسلم", titleUr: "عالمہ", titleEn: "Aalimah", titleAr: "عالمة" },
      ],
    });
    console.log("✓ Female scholars");
  }
  }

  await realContentV2();
  await masailV1();
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
