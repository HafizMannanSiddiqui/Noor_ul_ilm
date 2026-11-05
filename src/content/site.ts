/* =====================================================================
   SITE SETTINGS — names, numbers, accounts, areas.
   ویب سائٹ کی بنیادی ترتیبات — نام، نمبر، اکاؤنٹس، علاقے
   (Posts, events, classes, scholars and verses are managed in /admin.)
   ===================================================================== */
import type { Tri } from "@/lib/lang";
import type { PrayerSettings } from "@/lib/prayer";

export const ORG = {
  name: { ur: "نور العلم", en: "Noor-ul-Ilm", ar: "نور العلم" } as Tri,
  calligraphy: "نُورُ العِلْم",
  tagline: { ur: "علم کی روشنی، ہر گھر تک", en: "The light of knowledge, to every home", ar: "نور العلم إلى كل بيت" } as Tri,
};

export const CONTACT = {
  whatsappGeneral: "923000000000", // digits only, 92 = Pakistan
  phone: "+92 300 0000000",
  email: "info@noorulilm.org",
  address: { ur: "صدر کینٹ، لاہور", en: "Saddar Cantt, Lahore", ar: "صدر كانت، لاهور" } as Tri,
  mapQuery: "Saddar Cantt, Lahore",
  facebook: "",
  /** Sisters can message a female coordinator directly. Keep this a woman's number. */
  whatsappSisters: "923000000001",
};

export const PRAYER: PrayerSettings = {
  lat: 31.5204, lng: 74.3587, timezone: 5,
  fajrAngle: 18, ishaAngle: 18, asrFactor: 2, // 2 = Hanafi Asr
  // Minutes of ihtiyat (precaution) per prayer, as advised by your scholars
  adjust: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
};

/** Change to -1 / +1 if the Hijri date differs from Pakistan's Ruet-e-Hilal announcement. */
export const HIJRI_ADJUST_DAYS = 0;

export const AREAS: (Tri & { id: string })[] = [
  { id: "saddar", ur: "صدر کینٹ", en: "Saddar Cantt", ar: "صدر كانت" },
  { id: "cantt", ur: "لاہور کینٹ (دیگر)", en: "Lahore Cantt (other)", ar: "لاهور كانت (أخرى)" },
  { id: "gulberg", ur: "گلبرگ", en: "Gulberg", ar: "غلبرغ" },
  { id: "modeltown", ur: "ماڈل ٹاؤن", en: "Model Town", ar: "موديل تاون" },
  { id: "iqbaltown", ur: "علامہ اقبال ٹاؤن", en: "Allama Iqbal Town", ar: "علامة إقبال تاون" },
  { id: "johartown", ur: "جوہر ٹاؤن", en: "Johar Town", ar: "جوهر تاون" },
  { id: "dha", ur: "ڈی ایچ اے", en: "DHA", ar: "دي إتش إيه" },
  { id: "shadman", ur: "شادمان", en: "Shadman", ar: "شادمان" },
  { id: "samanabad", ur: "سمن آباد", en: "Samanabad", ar: "سمن آباد" },
  { id: "walton", ur: "والٹن", en: "Walton", ar: "والتون" },
  { id: "other", ur: "دیگر علاقہ", en: "Other area", ar: "منطقة أخرى" },
];

export const CATEGORIES: (Tri & { id: string; group?: "fiqh" })[] = [
  { id: "aqaid", ur: "عقائد", en: "Aqaid", ar: "العقائد" },
  { id: "fiqh-taharat", group: "fiqh", ur: "فقہ حنفی: طہارت", en: "Hanafi Fiqh: Taharat", ar: "الفقه الحنفي: الطهارة" },
  { id: "fiqh-namaz", group: "fiqh", ur: "فقہ حنفی: نماز", en: "Hanafi Fiqh: Namaz", ar: "الفقه الحنفي: الصلاة" },
  { id: "fiqh-roza", group: "fiqh", ur: "فقہ حنفی: روزہ", en: "Hanafi Fiqh: Roza", ar: "الفقه الحنفي: الصوم" },
  { id: "fiqh-zakat", group: "fiqh", ur: "فقہ حنفی: زکوٰۃ", en: "Hanafi Fiqh: Zakat", ar: "الفقه الحنفي: الزكاة" },
  { id: "fiqh-hajj", group: "fiqh", ur: "فقہ حنفی: حج", en: "Hanafi Fiqh: Hajj", ar: "الفقه الحنفي: الحج" },
  { id: "seerat", ur: "سیرت النبی ﷺ", en: "Seerat-un-Nabi ﷺ", ar: "السيرة النبوية ﷺ" },
  { id: "sahaba", ur: "صحابۂ کرام و اہلِ بیت", en: "Sahaba-e-Kiram & Ahl-e-Bait", ar: "الصحابة الكرام وأهل البيت" },
  { id: "auliya", ur: "اولیائے کرام", en: "Auliya-e-Kiram", ar: "الأولياء الكرام" },
  { id: "women", ur: "خواتین کے مسائل", en: "Masail for Women", ar: "مسائل النساء" },
  { id: "family", ur: "خاندان و تربیتِ اولاد", en: "Family & Tarbiyat-e-Aulad", ar: "الأسرة وتربية الأولاد" },
  { id: "naat", ur: "نعت و دعائیں", en: "Naat & Duas", ar: "النعت والأدعية" },
];
export const FIQH_GROUP: Tri = { ur: "فقہ حنفی", en: "Hanafi Fiqh", ar: "الفقه الحنفي" };

export const DONATE = {
  zakatAccepted: false, // set true ONLY after a Mufti confirms in writing
  registration: { ur: "[رجسٹریشن: پنجاب چیریٹیز کمیشن — نمبر یہاں درج کریں]", en: "[Registration: Punjab Charities Commission — add number here]", ar: "[التسجيل: هيئة الجمعيات الخيرية في البنجاب — أضف الرقم هنا]" } as Tri,
  /** Donors send the payment screenshot here (Hafiz Muhammad Owais). */
  receiptWhatsapp: "923204848500",
  accounts: [
    { type: "jazzcash", title: "Hafiz Muhammad Owais · حافظ محمد اویس", number: "0320 4848500" },
    { type: "easypaisa", title: "Hafiz Muhammad Owais · حافظ محمد اویس", number: "0320 4848500" },
    { type: "bank", title: "[Account title]", bank: "[Bank name, branch]", number: "[Account number]", iban: "PKXX XXXX XXXX XXXX XXXX XXXX" },
  ] as { type: "jazzcash" | "easypaisa" | "bank"; title: string; number: string; bank?: string; iban?: string }[],
  funds: {
    period: { ur: "[مہینہ / سال]", en: "[Month / Year]", ar: "[الشهر / السنة]" } as Tri,
    items: [
      { label: { ur: "عالمات کا اعزازیہ", en: "Honoraria for female scholars", ar: "مكافآت العالمات" }, percent: 40 },
      { label: { ur: "مقام اور انتظامات", en: "Venue & arrangements", ar: "المكان والترتيبات" }, percent: 20 },
      { label: { ur: "کتب و تعلیمی مواد", en: "Books & study material", ar: "الكتب والمواد التعليمية" }, percent: 20 },
      { label: { ur: "آن لائن کلاسز (انٹرنیٹ وغیرہ)", en: "Online classes (internet etc.)", ar: "الدروس عن بُعد" }, percent: 10 },
      { label: { ur: "انتظامی اخراجات", en: "Administration", ar: "مصاريف إدارية" }, percent: 10 },
    ] as { label: Tri; percent: number }[],
  },
};

/** Team shown on the About page. `phone` (digits only, 92…) adds Call + WhatsApp buttons; remove it to hide a number. */
export const TEAM: { name: Tri; role: Tri; phone?: string }[] = [
  { name: { ur: "مدثر بھائی", en: "Mudassir Bhai", ar: "الأخ مدثّر" }, role: { ur: "منتظم", en: "Organiser", ar: "منظِّم" }, phone: "923314375356" },
  { name: { ur: "حافظ محمد اویس", en: "Hafiz Muhammad Owais", ar: "الحافظ محمد أويس" }, role: { ur: "منتظم و فنڈ (جاز کیش / ایزی پیسہ)", en: "Organiser & funds (JazzCash / Easypaisa)", ar: "منظِّم وأمين الصندوق" }, phone: "923204848500" },
  { name: { ur: "محمد فصیح", en: "Muhammad Faseeh", ar: "محمد فصيح" }, role: { ur: "ڈیزائنر", en: "Designer", ar: "مصمِّم" }, phone: "923044937125" },
];

export const QUIZ: { q: Tri; options: Tri[]; answer: number }[] = [
  { q: { ur: "قرآنِ مجید کی پہلی وحی کا پہلا لفظ کیا تھا؟", en: "What was the first word of the first revelation of the Quran?", ar: "ما أول كلمة في أول وحي من القرآن؟" },
    options: [{ ur: "اقْرَأْ", en: "Iqra", ar: "اقْرَأْ" }, { ur: "الحمد", en: "Al-Hamd", ar: "الحمد" }, { ur: "قُلْ", en: "Qul", ar: "قُلْ" }], answer: 0 },
  { q: { ur: "پہلی وحی کس غار میں نازل ہوئی؟", en: "In which cave was the first revelation sent down?", ar: "في أي غار نزل أول الوحي؟" },
    options: [{ ur: "غارِ ثور", en: "Cave of Thawr", ar: "غار ثور" }, { ur: "غارِ حرا", en: "Cave of Hira", ar: "غار حراء" }, { ur: "کوئی غار نہیں", en: "None", ar: "لا شيء" }], answer: 1 },
  { q: { ur: "فقہ حنفی کے مطابق وضو میں کتنے فرض ہیں؟", en: "How many fara'id does wudu have in Hanafi fiqh?", ar: "كم عدد فرائض الوضوء عند الحنفية؟" },
    options: [{ ur: "تین", en: "Three", ar: "ثلاثة" }, { ur: "چار", en: "Four", ar: "أربعة" }, { ur: "چھ", en: "Six", ar: "ستة" }], answer: 1 },
  { q: { ur: "فقہ حنفی کے امام کون ہیں؟", en: "Who is the Imam of the Hanafi school?", ar: "من إمام المذهب الحنفي؟" },
    options: [{ ur: "امام مالک", en: "Imam Malik", ar: "الإمام مالك" }, { ur: "امامِ اعظم ابو حنیفہ", en: "Imam-e-Azam Abu Hanifa", ar: "الإمام الأعظم أبو حنيفة" }, { ur: "امام شافعی", en: "Imam Shafi'i", ar: "الإمام الشافعي" }], answer: 1 },
  { q: { ur: "لاہور میں \"داتا دربار\" کس ولی اللہ کا مزار ہے؟", en: "Whose shrine is \"Data Darbar\" in Lahore?", ar: "ضريحُ مَن «داتا دربار» في لاهور؟" },
    options: [{ ur: "حضرت سید علی ہجویری داتا گنج بخش", en: "Hazrat Syed Ali Hujwiri, Data Ganj Bakhsh", ar: "السيد علي الهجويري «داتا گنج بخش»" }, { ur: "حضرت بابا فرید", en: "Hazrat Baba Farid", ar: "بابا فريد" }, { ur: "حضرت بہاؤالدین زکریا", en: "Hazrat Bahauddin Zakariya", ar: "بهاء الدين زكريا" }], answer: 0 },
];

/** Short history stories for the Youth section. verified=false shows a "Draft" warning (or hides when SHOW_DRAFTS=false). */
export const STORIES: { title: Tri; text: Tri; verified: boolean }[] = [
  { verified: false,
    title: { ur: "امامِ اعظم ابو حنیفہ رحمۃ اللہ علیہ کا شوقِ علم", en: "Imam-e-Azam Abu Hanifa's Love of Knowledge", ar: "شغف الإمام الأعظم أبي حنيفة بالعلم" },
    text: { ur: "امامِ اعظم ابو حنیفہ نعمان بن ثابت رحمۃ اللہ علیہ 80 ہجری میں کوفہ میں پیدا ہوئے۔ آپ تجارت کرتے تھے، مگر علم کی محبت نے آپ کو اپنے استاد حضرت حماد بن ابی سلیمان رحمۃ اللہ علیہ کی مجلس سے برسوں تک جوڑے رکھا۔ آپ نے سوال پوچھنے، غور کرنے اور شاگردوں کے ساتھ مل کر مسائل پر بحث کرنے کا طریقہ اپنایا — اور آج دنیا کے کروڑوں مسلمان آپ کی فقہ پر عمل کرتے ہیں۔ سبق: علم کے لیے صبر اور اچھے استاد کی صحبت ضروری ہے۔", en: "Imam-e-Azam Abu Hanifa Nu'man bin Thabit (may Allah have mercy on him) was born in Kufa in 80 AH. He was a merchant, yet his love of knowledge kept him in the circle of his teacher Hammad bin Abi Sulayman for many years. He asked questions, reflected deeply and discussed issues together with his students — and today hundreds of millions of Muslims follow his fiqh. Lesson: knowledge needs patience and the company of a good teacher.", ar: "وُلد الإمام الأعظم أبو حنيفة النعمان بن ثابت رحمه الله في الكوفة سنة 80هـ. كان تاجرًا، لكن حبّه للعلم أبقاه في حلقة شيخه حمّاد بن أبي سليمان سنين طويلة. كان يسأل ويتأمّل ويتدارس المسائل مع تلاميذه — واليوم يتّبع فقهَه مئات الملايين من المسلمين. العبرة: العلم يحتاج إلى الصبر وصحبة المعلّم الصالح." } },
  { verified: false,
    title: { ur: "داتا گنج بخش — لاہور کے روحانی محسن", en: "Data Ganj Bakhsh — Lahore's Spiritual Benefactor", ar: "داتا گنج بخش — مُحسن لاهور الروحي" },
    text: { ur: "حضرت سید علی بن عثمان ہجویری رحمۃ اللہ علیہ غزنی سے لاہور تشریف لائے اور یہیں دین کی خدمت میں زندگی گزاری۔ آپ کی کتاب \"کشف المحجوب\" فارسی زبان میں تصوف کی قدیم ترین کتابوں میں شمار ہوتی ہے۔ آپ کے کردار اور تعلیم سے بے شمار لوگ اسلام کے قریب آئے۔ سبق: علم اور اچھا کردار مل کر دلوں کو بدلتے ہیں۔", en: "Hazrat Syed Ali bin Usman Hujwiri (may Allah have mercy on him) came from Ghazni to Lahore and spent his life serving the Deen here. His book \"Kashf-ul-Mahjoob\" is counted among the earliest works on Tasawwuf in Persian. Countless people came closer to Islam through his character and teaching. Lesson: knowledge and good character together change hearts.", ar: "قدم السيد علي بن عثمان الهجويري رحمه الله من غزنة إلى لاهور، وقضى فيها حياته في خدمة الدين. ويُعدّ كتابه «كشف المحجوب» من أقدم كتب التصوف بالفارسية. وقد اقترب كثيرون من الإسلام بفضل أخلاقه وتعليمه. العبرة: العلم والخُلُق الحسن معًا يغيّران القلوب." } },
];
