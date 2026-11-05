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

/** Leave a value empty ("") to hide it on the website. */
export const CONTACT = {
  whatsappGeneral: "923314375356", // Mudassir Bhai — digits only, 92 = Pakistan
  phone: "+92 331 4375356",
  email: "",
  address: { ur: "صدر کینٹ، لاہور", en: "Saddar Cantt, Lahore", ar: "صدر كانت، لاهور" } as Tri,
  mapQuery: "Saddar Cantt, Lahore",
  facebook: "",
  /** Sisters can message a female coordinator directly. Must be a woman's number; empty hides the button. */
  whatsappSisters: "",
  /** Invite link to your WhatsApp Community or Channel (https://chat.whatsapp.com/... or https://whatsapp.com/channel/...). Empty hides the button. */
  whatsappCommunity: "",
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
  { id: "adab", ur: "روزمرہ کی سنتیں و آداب", en: "Daily Sunnahs & Adab", ar: "السنن والآداب اليومية" },
  { id: "naat", ur: "نعت و دعائیں", en: "Naat & Duas", ar: "النعت والأدعية" },
];
export const FIQH_GROUP: Tri = { ur: "فقہ حنفی", en: "Hanafi Fiqh", ar: "الفقه الحنفي" };

export const DONATE = {
  zakatAccepted: false, // set true ONLY after a Mufti confirms in writing
  /** Charity registration number (e.g. Punjab Charities Commission). Empty hides it. */
  registration: { ur: "", en: "", ar: "" } as Tri,
  /** Donors send the payment screenshot here (Hafiz Muhammad Owais). */
  receiptWhatsapp: "923204848500",
  accounts: [
    { type: "jazzcash", title: "Hafiz Muhammad Owais · حافظ محمد اویس", number: "0320 4848500" },
    { type: "easypaisa", title: "Hafiz Muhammad Owais · حافظ محمد اویس", number: "0320 4848500" },
  ] as { type: "jazzcash" | "easypaisa" | "bank"; title: string; number: string; bank?: string; iban?: string }[],
  /** Where donations are spent (shown on the Donate page). */
  spending: [
    { ur: "تشریف لانے والی عالمہ کا آمد و رفت کا کرایہ", en: "Travel fare for the visiting Aalimah", ar: "أجرة تنقّل العالمة الزائرة" },
    { ur: "شرکاء کے لیے ریفریشمنٹ", en: "Refreshments for those attending", ar: "الضيافة للحاضرات" },
    { ur: "تشہیر: پوسٹرز اور بینرز", en: "Publicity: posters and banners", ar: "الإعلان: الملصقات واللافتات" },
  ] as Tri[],
  /** Monthly spending report for the Transparency section. Empty items hide the section.
      Example: { label: { ur: "عالمات کا اعزازیہ", en: "Honoraria", ar: "مكافآت" }, percent: 40 } */
  funds: {
    period: { ur: "", en: "", ar: "" } as Tri,
    items: [] as { label: Tri; percent: number }[],
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
  // Add stories approved by your scholars: { verified: true, title: { ur, en, ar }, text: { ur, en, ar } }
];
