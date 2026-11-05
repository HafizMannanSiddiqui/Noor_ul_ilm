/* Seeds the first super admin, optional demo accounts, and sample content.
   Run: npm run setup   (safe to re-run: uses upserts) */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function upsertUser(email: string, name: string, gender: "M" | "F", roles: string, password: string, title = "") {
  const passwordHash = await bcrypt.hash(password, 12);
  return db.user.upsert({
    where: { email },
    update: {},
    create: { email, name, gender, roles, passwordHash, title },
  });
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPw || adminPw.length < 10) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars) in .env");
  await upsertUser(adminEmail, process.env.ADMIN_NAME || "Administrator", "M", "SUPER_ADMIN", adminPw);
  console.log("✓ Super admin:", adminEmail);

  let scholarId: string | null = null;
  if (process.env.SEED_DEMO === "true") {
    const pw = process.env.DEMO_PASSWORD || "Demo!Pass2026";
    await upsertUser("brothers@demo.local", "Demo Brothers Admin", "M", "BROTHERS_ADMIN", pw);
    await upsertUser("sisters@demo.local", "Demo Sisters Admin", "F", "SISTERS_ADMIN", pw);
    const mufti = await upsertUser("mufti@demo.local", "[Mufti Sahib — demo]", "M", "SCHOLAR", pw, "Mufti");
    await upsertUser("aalimah@demo.local", "[Aalimah Sahiba — demo]", "F", "SCHOLAR,SISTERS_ADMIN", pw, "Aalimah");
    scholarId = mufti.id;
    console.log("✓ Demo accounts (password from DEMO_PASSWORD): brothers@ / sisters@ / mufti@ / aalimah@demo.local");
  }
  void scholarId;

  // ---------- Sacred texts (UNVERIFIED starting points — scholars must verify) ----------
  const texts = [
    { key: "alaq-1", kind: "AYAH", arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", refUr: "سورۃ العلق 96:1", refEn: "Surah Al-Alaq 96:1", refAr: "سورة العلق 96:1", partial: false, showOnHome: true },
    { key: "taha-114", kind: "AYAH", arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", refUr: "سورۃ طٰہٰ 20:114", refEn: "Surah Taha 20:114", refAr: "سورة طه 20:114", partial: true, showOnHome: true },
    { key: "zumar-9", kind: "AYAH", arabic: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ", refUr: "سورۃ الزمر 39:9", refEn: "Surah Az-Zumar 39:9", refAr: "سورة الزمر 39:9", partial: true, showOnHome: true },
    { key: "maidah-6", kind: "AYAH", arabic: "[آیتِ وضو کا عربی متن مستند مصحف سے یہاں درج کریں — Arabic from a verified Mushaf]", refUr: "سورۃ المائدہ 5:6", refEn: "Surah Al-Ma'idah 5:6", refAr: "سورة المائدة 5:6", partial: true, showOnHome: false },
    { key: "ibnmajah-224", kind: "HADITH", arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", refUr: "سنن ابن ماجہ، حدیث 224", refEn: "Sunan Ibn Majah, Hadith 224", refAr: "سنن ابن ماجه، الحديث 224", partial: false, showOnHome: true },
  ];
  for (const t of texts) {
    const isAyah = t.kind === "AYAH";
    await db.sacredText.upsert({
      where: { key: t.key },
      update: {},
      create: {
        ...t,
        ur: isAyah ? "[کنز الایمان سے ترجمہ یہاں لفظ بلفظ درج کریں]" : "[اردو ترجمہ — عالمِ دین کی تصدیق کے بعد یہاں درج کریں]",
        en: isAyah ? "[English translation — add here]" : "[English translation — add after scholar verification]",
        grading: isAyah ? "" : "[Grading — as advised by your scholar]",
      },
    });
  }
  console.log("✓ Sacred texts (unverified)");

  // ---------- Posts (PENDING_REVIEW — need scholar approval) ----------
  const posts = [
    {
      slug: "ilm-farz", category: "women", cover: "star", publishedAt: new Date("2026-11-01"),
      titleUr: "علم: ہر مسلمان مرد و عورت کی ذمہ داری",
      titleEn: "Knowledge: A Duty for Every Muslim Man and Woman",
      titleAr: "العلم: واجبٌ على كل مسلم ومسلمة",
      summaryUr: "اسلام نے علم حاصل کرنے کو صرف مردوں تک محدود نہیں رکھا۔ قرآن کی پہلی وحی \"اقْرَأْ\" سے شروع ہوئی — یہ پیغام ہر ماں، بہن اور بیٹی کے لیے بھی ہے۔",
      summaryEn: "Islam never limited seeking knowledge to men. The first revelation began with \"Iqra\" — a message for every mother, sister and daughter too.",
      summaryAr: "لم يقصر الإسلام طلب العلم على الرجال. فقد بدأ أول الوحي بـ«اقْرَأْ» — وهي رسالة لكل أمٍّ وأختٍ وبنت.",
      bodyUr: `اسلام نے علم حاصل کرنے کو صرف مردوں تک محدود نہیں رکھا۔ قرآنِ مجید کی پہلی وحی کا آغاز ہی لفظ "اقْرَأْ" (پڑھو) سے ہوا، اور یہ پیغام ہر انسان کے لیے ہے۔

[[ayah:alaq-1]]

رسول اللہ ﷺ نے علم طلب کرنے کو ہر مسلمان پر فرض قرار دیا۔ علمائے کرام فرماتے ہیں کہ اس میں مرد اور عورت دونوں شامل ہیں — یعنی ہر شخص پر اتنا علم سیکھنا لازم ہے جتنا اس کی روزمرہ عبادات اور معاملات کے لیے ضروری ہے۔

[[hadith:ibnmajah-224]]

## صحابیات کی مثال

امہات المؤمنین اور صحابیات رضی اللہ عنہن علم سیکھتی بھی تھیں اور سکھاتی بھی تھیں۔ ام المؤمنین سیدہ عائشہ صدیقہ رضی اللہ عنہا سے بڑے بڑے صحابۂ کرام دینی مسائل دریافت کیا کرتے تھے۔

> عالمہ صاحبہ: یہاں سیدہ عائشہ رضی اللہ عنہا کے علمی مقام پر مستند حوالہ (کتاب، باب، نمبر) شامل کریں۔

## ماں — پہلی درسگاہ

ایک تعلیم یافتہ ماں پورے گھرانے کی تربیت کرتی ہے۔ جب ایک بیٹی دین سیکھتی ہے تو آنے والی نسلیں دین سیکھتی ہیں۔ اسی لیے ہماری مہم مستند عالمات اور مبلغات کے ذریعے اسلامی بہنوں کو باپردہ، محفوظ اور باعزت ماحول میں دین سکھانے کا اہتمام کرتی ہے۔`,
      bodyEn: `Islam never limited the seeking of knowledge to men. The very first revelation of the Holy Quran began with the word "Iqra" (Read), and this message is for every human being.

[[ayah:alaq-1]]

The Messenger of Allah ﷺ declared seeking knowledge an obligation on every Muslim. Scholars explain that this includes both men and women — every person must learn what they need for their daily worship and dealings.

[[hadith:ibnmajah-224]]

## The Example of the Female Companions

The Mothers of the Believers and the female Companions (may Allah be pleased with them) both learned and taught. Senior Companions would ask Umm-ul-Mu'mineen Sayyidah Aishah Siddiqah (may Allah be pleased with her) about religious matters.

> For the Aalimah: add a verified reference (book, chapter, number) on Sayyidah Aishah's scholarly standing here.

## The Mother — The First School

An educated mother raises an entire household. When a daughter learns Deen, the generations after her learn Deen. That is why our campaign arranges for Islamic sisters to learn from qualified female scholars in a modest, safe and respectful setting.`,
      bodyAr: `لم يقصر الإسلام طلب العلم على الرجال، فقد بدأ أول ما نزل من القرآن الكريم بكلمة «اقْرَأْ»، وهي رسالة لكل إنسان.

[[ayah:alaq-1]]

جعل رسول الله ﷺ طلب العلم فريضةً على كل مسلم، ويبيّن العلماء أن ذلك يشمل الرجال والنساء.

[[hadith:ibnmajah-224]]

## قدوة الصحابيات

كانت أمهات المؤمنين والصحابيات رضي الله عنهن يتعلّمن ويعلّمن، وكان كبار الصحابة يسألون أمَّ المؤمنين السيدة عائشة الصديقة رضي الله عنها عن مسائل الدين.

> للعالمة: يُضاف هنا مرجع موثّق عن مكانة السيدة عائشة العلمية.

## الأم — المدرسة الأولى

الأم المتعلّمة تربّي بيتًا كاملًا، وإذا تعلّمت البنت دينها تعلّمته الأجيال من بعدها.`,
      refsUr: "القرآن، سورۃ العلق 96:1\nسنن ابن ماجہ، حدیث 224\n[سیدہ عائشہ رضی اللہ عنہا سے متعلق حوالہ — عالمہ صاحبہ شامل کریں]",
      refsEn: "Quran, Surah Al-Alaq 96:1\nSunan Ibn Majah, Hadith 224\n[Reference on Sayyidah Aishah — to be added by the Aalimah]",
      refsAr: "القرآن، سورة العلق 96:1\nسنن ابن ماجه، الحديث 224\n[مرجع عن السيدة عائشة — تضيفه العالمة]",
    },
    {
      slug: "wudu-faraiz", category: "fiqh-taharat", cover: "drop", publishedAt: new Date("2026-10-28"),
      titleUr: "وضو کے فرائض — فقہ حنفی کی روشنی میں",
      titleEn: "The Fara'id of Wudu — According to Hanafi Fiqh",
      titleAr: "فرائض الوضوء على المذهب الحنفي",
      summaryUr: "وضو نماز کی کنجی ہے۔ فقہ حنفی کے مطابق وضو میں چار فرض ہیں — جانیے کون سے، اور اسلامی بہنوں کے لیے ایک اہم مسئلہ۔",
      summaryEn: "Wudu is the key to Salah. In Hanafi fiqh, wudu has four fara'id — learn what they are, plus an important point for sisters.",
      summaryAr: "الوضوء مفتاح الصلاة، وفرائضه عند الحنفية أربعة — تعرّف عليها، مع مسألة مهمة للأخوات.",
      bodyUr: `وضو نماز کی کنجی ہے۔ وضو کے فرائض قرآنِ مجید کی آیتِ وضو سے ثابت ہیں۔

[[ayah:maidah-6]]

## فقہ حنفی کے مطابق وضو کے چار فرض

- پورا چہرہ ایک بار دھونا — پیشانی کے بال اگنے کی جگہ سے ٹھوڑی کے نیچے تک، اور ایک کان کی لو سے دوسرے کان کی لو تک۔
- دونوں ہاتھ کہنیوں سمیت ایک بار دھونا۔
- چوتھائی سر کا مسح کرنا۔
- دونوں پاؤں ٹخنوں سمیت ایک بار دھونا۔

ان میں سے کوئی ایک فرض بھی رہ جائے تو وضو نہیں ہوگا۔ بسم اللہ پڑھنا، مسواک کرنا، کلی کرنا، ناک میں پانی ڈالنا اور ہر عضو کو تین بار دھونا وضو کی سنتیں ہیں۔

## اسلامی بہنوں کے لیے اہم مسئلہ

ناخن پالش (نیل پالش) پانی کو ناخن تک پہنچنے سے روکتی ہے، اس لیے اس کے ہوتے ہوئے وضو نہیں ہوتا؛ وضو سے پہلے اسے اتارنا ضروری ہے۔ مہندی کا صرف رنگ پانی کو نہیں روکتا۔

> عالمہ صاحبہ: تفصیلی مسائل کے لیے بہارِ شریعت، حصہ دوم (وضو کا بیان) سے صفحہ نمبر کے ساتھ حوالہ شامل کریں اور اس مضمون کی منظوری دیں۔`,
      bodyEn: `Wudu is the key to Salah. Its fara'id (obligatory acts) are established by the verse of wudu in the Holy Quran.

[[ayah:maidah-6]]

## The Four Fara'id of Wudu in Hanafi Fiqh

- Washing the whole face once — from the hairline to below the chin, and from one earlobe to the other.
- Washing both arms, including the elbows, once.
- Wiping (masah) a quarter of the head.
- Washing both feet, including the ankles, once.

If even one of these is missed, the wudu is not valid. Saying Bismillah, using a miswak, rinsing the mouth, rinsing the nose and washing each part three times are sunnahs of wudu.

## An Important Point for Sisters

Nail polish stops water from reaching the nail, so wudu is not valid while it is on; it must be removed before wudu. The colour of mehndi (henna) alone does not block water.

> For the Aalimah: add a reference with page number from Bahar-e-Shariat, Part 2 (chapter on Wudu), and approve this post.`,
      bodyAr: `الوضوء مفتاح الصلاة، وفرائضه ثابتة بآية الوضوء في القرآن الكريم.

[[ayah:maidah-6]]

## فرائض الوضوء الأربعة عند الحنفية

- غسل الوجه كله مرة — من منابت الشعر إلى أسفل الذقن، ومن شحمة الأذن إلى شحمة الأذن.
- غسل اليدين مع المرفقين مرة.
- مسح ربع الرأس.
- غسل الرجلين مع الكعبين مرة.

## مسألة مهمة للأخوات

طلاء الأظافر يمنع وصول الماء إلى الظفر، فلا يصحّ الوضوء مع وجوده، ويجب إزالته قبل الوضوء. أما لون الحنّاء وحده فلا يمنع الماء.

> للعالمة: يُضاف مرجع برقم الصفحة من «بهار شريعت»، الجزء الثاني (باب الوضوء)، ثم اعتماد المقالة.`,
      refsUr: "القرآن، سورۃ المائدہ 5:6\nبہارِ شریعت، صدر الشریعہ مفتی امجد علی اعظمی، حصہ دوم، وضو کا بیان — [صفحہ نمبر]",
      refsEn: "Quran, Surah Al-Ma'idah 5:6\nBahar-e-Shariat, Sadr-ush-Shariah Mufti Amjad Ali Azmi, Part 2, Wudu — [page no.]",
      refsAr: "القرآن، سورة المائدة 5:6\nبهار شريعت، صدر الشريعة المفتي أمجد علي الأعظمي، الجزء الثاني، الوضوء — [رقم الصفحة]",
    },
    {
      slug: "ghar-e-hira", category: "seerat", cover: "moon", publishedAt: new Date("2026-10-20"),
      titleUr: "غارِ حرا اور پہلی وحی",
      titleEn: "The Cave of Hira and the First Revelation",
      titleAr: "غار حراء وأول الوحي",
      summaryUr: "جبلِ نور کے غار سے شروع ہونے والا وہ پیغام جس نے دنیا بدل دی — اور سیدہ خدیجۃ الکبریٰ رضی اللہ عنہا کا بے مثال ساتھ۔",
      summaryEn: "The message from a cave on Jabal-un-Noor that changed the world — and the unmatched support of Sayyidah Khadijah al-Kubra (may Allah be pleased with her).",
      summaryAr: "الرسالة التي بدأت من غارٍ في جبل النور فغيّرت العالم — ومؤازرة السيدة خديجة الكبرى رضي الله عنها.",
      bodyUr: `اعلانِ نبوت سے پہلے رسول اللہ ﷺ مکہ مکرمہ کے قریب جبلِ نور پر واقع غارِ حرا میں تشریف لے جاتے اور کئی کئی راتیں اللہ تعالیٰ کی عبادت میں گزارتے۔

وہیں حضرت جبرائیل علیہ السلام پہلی وحی لے کر حاضر ہوئے اور سورۃ العلق کی ابتدائی آیات نازل ہوئیں۔

[[ayah:alaq-1]]

جب آپ ﷺ گھر تشریف لائے تو ام المؤمنین سیدہ خدیجۃ الکبریٰ رضی اللہ عنہا نے آپ کو تسلی دی، آپ کی خوبیاں بیان کیں اور ایمان لانے کا شرف حاصل کیا۔

> عالمہ صاحبہ: مکمل واقعہ کے لیے صحیح بخاری، کتاب بدء الوحی (حدیث 3) کا حوالہ تصدیق کریں۔

## ہمارے لیے سبق

- دین کا پہلا پیغام "پڑھو" ہے — علم ہمارے دین کی بنیاد ہے۔
- ایک نیک خاتون، سیدہ خدیجہ رضی اللہ عنہا، نے اسلام کے پہلے دن سے سب سے بڑھ کر ساتھ دیا۔
- تنہائی میں اللہ کی عبادت اور غور و فکر روح کو پاکیزہ بناتا ہے۔`,
      bodyEn: `Before the declaration of Prophethood, the Messenger of Allah ﷺ would go to the Cave of Hira on Jabal-un-Noor near Makkah and spend many nights in the worship of Allah.

It was there that Sayyiduna Jibreel (peace be upon him) came with the first revelation, and the opening verses of Surah Al-Alaq were revealed.

[[ayah:alaq-1]]

When he ﷺ returned home, Umm-ul-Mu'mineen Sayyidah Khadijah al-Kubra (may Allah be pleased with her) comforted him, spoke of his noble qualities, and was honoured to believe in him.

> For the Aalimah: verify the reference to Sahih al-Bukhari, Book of the Beginning of Revelation (Hadith 3) for the full account.

## Lessons for Us

- The first message of the Deen is "Read" — knowledge is the foundation of our faith.
- A righteous woman, Sayyidah Khadijah (may Allah be pleased with her), gave the greatest support from the very first day of Islam.
- Worship and reflection in solitude purify the soul.`,
      bodyAr: `قبل البعثة كان رسول الله ﷺ يذهب إلى غار حراء في جبل النور قرب مكة المكرمة، فيقضي الليالي ذوات العدد في عبادة الله تعالى.

وهناك جاءه جبريل عليه السلام بأول الوحي، فنزلت الآيات الأولى من سورة العلق.

[[ayah:alaq-1]]

ولمّا رجع ﷺ إلى بيته طمأنته أم المؤمنين السيدة خديجة الكبرى رضي الله عنها، ونالت شرف الإيمان به.

> للعالمة: يُتحقَّق من الإحالة إلى صحيح البخاري، كتاب بدء الوحي (الحديث 3).

## دروس لنا

- أول رسالة في الدين «اقرأ» — فالعلم أساس ديننا.
- امرأة صالحة، السيدة خديجة رضي الله عنها، كانت أعظم سندٍ منذ اليوم الأول للإسلام.
- العبادة والتفكّر في الخلوة يزكّيان الروح.`,
      refsUr: "القرآن، سورۃ العلق 96:1\nصحیح بخاری، کتاب بدء الوحی، حدیث 3 — [تصدیق باقی]",
      refsEn: "Quran, Surah Al-Alaq 96:1\nSahih al-Bukhari, Book of the Beginning of Revelation, Hadith 3 — [to be verified]",
      refsAr: "القرآن، سورة العلق 96:1\nصحيح البخاري، كتاب بدء الوحي، الحديث 3 — [بانتظار التحقق]",
    },
  ];
  for (const p of posts) {
    await db.post.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, status: "PENDING_REVIEW" } });
  }
  console.log("✓ 3 sample posts (pending scholar review)");

  // ---------- Scholars & classes ----------
  if ((await db.scholar.count()) === 0) {
    const s1 = await db.scholar.create({ data: { sort: 1, nameUr: "اہلیہ محترمہ مفتی حسیب قادری صاحب", nameEn: "Mrs. Mufti Haseeb Qadri Sahib", nameAr: "حرم المفتي حسيب القادري", titleUr: "عالمہ", titleEn: "Aalimah", titleAr: "عالمة", subjectsUr: "[مضامین]", subjectsEn: "[Subjects]", subjectsAr: "[المواد]", bioUr: "[مختصر تعارف]", bioEn: "[Short bio]", bioAr: "[نبذة مختصرة]" } });
    const s2 = await db.scholar.create({ data: { sort: 2, nameUr: "اہلیہ محترمہ عبدالرحمٰن صدیقی صاحب", nameEn: "Mrs. Abdul Rahman Siddiqui Sahib", nameAr: "حرم عبد الرحمن صديقي", titleUr: "عالمہ", titleEn: "Aalimah", titleAr: "عالمة", subjectsUr: "[مضامین]", subjectsEn: "[Subjects]", subjectsAr: "[المواد]", bioUr: "[مختصر تعارف]", bioEn: "[Short bio]", bioAr: "[نبذة مختصرة]" } });
    const s3 = await db.scholar.create({ data: { sort: 3, nameUr: "اہلیہ محترمہ کاشف اسلم صاحب", nameEn: "Mrs. Kashif Aslam Sahib", nameAr: "حرم كاشف أسلم", titleUr: "عالمہ", titleEn: "Aalimah", titleAr: "عالمة", subjectsUr: "[مضامین]", subjectsEn: "[Subjects]", subjectsAr: "[المواد]", bioUr: "[مختصر تعارف]", bioEn: "[Short bio]", bioAr: "[نبذة مختصرة]" } });
    await db.classSession.createMany({
      data: [
        { sort: 1, subject: "quran", level: "beginner", ageGroup: "women", mode: "inperson", teacherId: s1.id, whenUr: "ہر منگل، صبح 10:00 تا 11:00", whenEn: "Every Tuesday, 10:00–11:00 am", whenAr: "كل ثلاثاء، 10:00–11:00 صباحًا", whereUr: "[مقام]، صدر کینٹ", whereEn: "[Venue], Saddar Cantt", whereAr: "[المكان]، صدر كانت" },
        { sort: 2, subject: "tajweed", level: "beginner", ageGroup: "girls", mode: "both", teacherId: s2.id, whenUr: "ہفتہ و اتوار، شام 4:30 تا 5:30", whenEn: "Sat & Sun, 4:30–5:30 pm", whenAr: "السبت والأحد، 4:30–5:30 مساءً", whereUr: "[مقام]، صدر کینٹ + آن لائن", whereEn: "[Venue], Saddar Cantt + online", whereAr: "[المكان]، صدر كانت + عن بُعد" },
        { sort: 3, subject: "fiqh", level: "intermediate", ageGroup: "young", mode: "online", teacherId: s1.id, whenUr: "ہر جمعرات، رات 8:30 تا 9:30", whenEn: "Every Thursday, 8:30–9:30 pm", whenAr: "كل خميس، 8:30–9:30 مساءً", whereUr: "آن لائن (لنک واٹس ایپ پر بھیجا جائے گا)", whereEn: "Online (link sent on WhatsApp)", whereAr: "عن بُعد (يُرسل الرابط عبر واتساب)" },
        { sort: 4, subject: "seerat", level: "beginner", ageGroup: "girls", mode: "inperson", teacherId: s3.id, whenUr: "ہر اتوار، صبح 11:00 تا 12:00", whenEn: "Every Sunday, 11:00 am–12:00 pm", whenAr: "كل أحد، 11:00–12:00 ظهرًا", whereUr: "[مقام]، صدر کینٹ", whereEn: "[Venue], Saddar Cantt", whereAr: "[المكان]، صدر كانت" },
        { sort: 5, subject: "tajweed", level: "advanced", ageGroup: "women", mode: "online", teacherId: s2.id, whenUr: "پیر اور بدھ، دوپہر 2:00 تا 3:00", whenEn: "Mon & Wed, 2:00–3:00 pm", whenAr: "الاثنين والأربعاء، 2:00–3:00 ظهرًا", whereUr: "آن لائن", whereEn: "Online", whereAr: "عن بُعد" },
      ],
    });
    console.log("✓ Scholars and classes");
  }

  // ---------- Events (samples) ----------
  if ((await db.event.count()) === 0) {
    await db.event.createMany({
      data: [
        { type: "naat", area: "saddar", audience: "all", date: "2026-11-14", titleUr: "محفلِ نعت", titleEn: "Mehfil-e-Naat", titleAr: "محفل نعت", timeUr: "بعد نمازِ عشاء", timeEn: "After Isha", timeAr: "بعد صلاة العشاء", venueUr: "[مسجد / مقام کا نام]، صدر کینٹ", venueEn: "[Masjid / venue], Saddar Cantt", venueAr: "[المسجد / المكان]، صدر كانت" },
        { type: "dars", area: "saddar", audience: "brothers", date: "2026-11-28", titleUr: "نوجوانوں کے لیے درس: سیرتِ صحابہ", titleEn: "Youth Dars: Lives of the Sahaba", titleAr: "درس للشباب: سيرة الصحابة", timeUr: "بعد نمازِ مغرب", timeEn: "After Maghrib", timeAr: "بعد صلاة المغرب", venueUr: "[مسجد کا نام]، صدر کینٹ", venueEn: "[Masjid], Saddar Cantt", venueAr: "[المسجد]، صدر كانت" },
        { type: "gyarwi", area: "saddar", audience: "all", date: "", recurringUr: "ہر اسلامی مہینے کی گیارہ تاریخ", recurringEn: "11th of every Islamic month", recurringAr: "الحادي عشر من كل شهر هجري", titleUr: "محفلِ گیارہویں شریف", titleEn: "Mehfil-e-Gyarhween Sharif", titleAr: "محفل الحادي عشر الشريف", timeUr: "بعد نمازِ عشاء", timeEn: "After Isha", timeAr: "بعد صلاة العشاء", venueUr: "[مقام]، صدر کینٹ", venueEn: "[Venue], Saddar Cantt", venueAr: "[المكان]، صدر كانت" },
      ],
    });
    console.log("✓ Sample events");
  }

  // ---------- Sisters' Dars-e-Quran schedule (real) ----------
  // Three Saturdays a month: Dars at different locations. One Saturday: the big monthly Dars.
  const realEvents = [
    {
      id: "sisters-saturday-dars",
      type: "dars", area: "other", audience: "sisters", date: "",
      recurringUr: "ہر سنیچر (ماہ میں تین بار)", recurringEn: "Saturdays (3 a month)", recurringAr: "أيام السبت (3 مرات شهريًا)",
      titleUr: "ہفتہ وار درسِ قرآن برائے خواتین", titleEn: "Weekly Dars-e-Quran for Women", titleAr: "درس القرآن الأسبوعي للنساء",
      timeUr: "[مقررہ وقت]", timeEn: "[Fixed time]", timeAr: "[الوقت المحدد]",
      venueUr: "ہر ہفتے مختلف مقام پر — تفصیل واٹس ایپ پر", venueEn: "A different location each week — details on WhatsApp", venueAr: "مكان مختلف كل أسبوع — التفاصيل عبر واتساب",
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
  console.log("✓ Sisters' Dars schedule");

  if ((await db.question.count()) === 0) {
    await db.question.createMany({
      data: [
        { question: "کیا نوجوانوں کو دین سیکھنے کے لیے کسی استاد کی ضرورت ہے، یا انٹرنیٹ کافی ہے؟", questionUr: "کیا نوجوانوں کو دین سیکھنے کے لیے کسی استاد کی ضرورت ہے، یا انٹرنیٹ کافی ہے؟", questionEn: "Do young people need a teacher to learn Deen, or is the internet enough?", questionAr: "هل يحتاج الشباب إلى معلّم لتعلّم الدين، أم يكفي الإنترنت؟" },
        { question: "پڑھائی کے ساتھ نماز کی پابندی کیسے کریں؟", questionUr: "پڑھائی کے ساتھ نماز کی پابندی کیسے کریں؟", questionEn: "How can I stay regular in Salah alongside my studies?", questionAr: "كيف أحافظ على الصلاة مع الدراسة؟" },
      ],
    });
    console.log("✓ Sample youth questions (unanswered)");
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
