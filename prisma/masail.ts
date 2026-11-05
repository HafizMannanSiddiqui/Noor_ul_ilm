/*
 * Basic Hanafi masail for the Islamic Posts section, following Bahar-e-Shariat
 * (Sadr-ush-Shariah Mufti Amjad Ali Azmi). They are created as PENDING_REVIEW:
 * the website shows them with a "Draft — awaiting scholar approval" label
 * (only while SHOW_DRAFTS="true") until a scholar approves them in Admin > Posts.
 * No Quran or hadith text is typed here.
 */
type MasailPost = {
  slug: string; category: string; cover: string;
  titleUr: string; titleEn: string; summaryUr: string; summaryEn: string;
  bodyUr: string; bodyEn: string; refsUr: string; refsEn: string;
};

const REVIEW_UR = "> یہ مضمون عالمِ دین کی نظرِ ثانی کے لیے پیش ہے۔ کسی مسئلے میں شک ہو تو اپنے علاقے کے سنی حنفی مفتی صاحب سے رجوع کریں۔";
const REVIEW_EN = "> This article is awaiting a scholar's review. If in doubt about any ruling, ask a Sunni Hanafi Mufti.";

export const MASAIL: MasailPost[] = [
  {
    slug: "wuzu-ke-masail", category: "fiqh-taharat", cover: "drop",
    titleUr: "وضو کے فرائض، سنتیں اور وضو توڑنے والی چیزیں",
    titleEn: "Wudu: its Fara'id, Sunnahs and what breaks it",
    summaryUr: "وضو کے چار فرائض، اہم سنتیں، اور وہ چیزیں جن سے وضو ٹوٹ جاتا ہے — فقہ حنفی کے مطابق۔",
    summaryEn: "The four fara'id of wudu, its main sunnahs, and the things that break it — according to Hanafi fiqh.",
    bodyUr: `## وضو کے چار فرائض
- پورا چہرہ دھونا: پیشانی کے بال اگنے کی جگہ سے ٹھوڑی کے نیچے تک، اور ایک کان کی لَو سے دوسرے کان کی لَو تک۔
- دونوں ہاتھ کہنیوں سمیت دھونا۔
- چوتھائی سر کا مسح کرنا۔
- دونوں پاؤں ٹخنوں سمیت دھونا۔

ان اعضاء میں بال برابر جگہ بھی خشک رہ گئی تو وضو نہیں ہوگا۔ ناخن پالش جیسی چیز جو پانی کو جلد تک پہنچنے سے روکے، وضو سے پہلے اتارنا ضروری ہے۔

## وضو کی چند سنتیں
- نیت کرنا اور بسم اللہ سے شروع کرنا
- دونوں ہاتھ گٹوں تک تین بار دھونا
- مسواک کرنا
- تین بار کلی کرنا اور تین بار ناک میں پانی ڈالنا
- داڑھی اور ہاتھ پاؤں کی انگلیوں کا خلال کرنا
- ہر عضو کو تین تین بار دھونا
- پورے سر کا ایک بار مسح کرنا اور کانوں کا مسح کرنا
- ترتیب سے وضو کرنا، اور اعضاء کو پے در پے دھونا کہ پہلا عضو خشک نہ ہونے پائے

## وضو توڑنے والی چیزیں
- پیشاب، پاخانہ یا ہوا کا خارج ہونا، یعنی آگے یا پیچھے کے مقام سے کسی چیز کا نکلنا
- بدن کے کسی حصے سے خون یا پیپ کا نکل کر بہہ جانا
- منہ بھر کر قے آنا
- لیٹ کر یا ٹیک لگا کر اس طرح سونا کہ جسم ڈھیلا پڑ جائے
- بے ہوشی، جنون یا نشہ
- رکوع اور سجدے والی نماز میں بالغ کا اتنی آواز سے ہنسنا کہ پاس والے سن لیں (قہقہہ)

${REVIEW_UR}`,
    bodyEn: `## The four fara'id of wudu
- Washing the whole face: from where the hair of the forehead begins to below the chin, and from one earlobe to the other.
- Washing both arms including the elbows.
- Wiping (masah) a quarter of the head.
- Washing both feet including the ankles.

If even a hair's breadth of these parts stays dry, the wudu is not valid. Anything that stops water reaching the skin, such as nail polish, must be removed first.

## Some sunnahs of wudu
- Making the intention and beginning with Bismillah
- Washing both hands up to the wrists three times
- Using the miswak
- Rinsing the mouth three times and the nose three times
- Passing wet fingers through the beard and between the fingers and toes
- Washing each part three times
- Wiping the whole head once, and wiping the ears
- Keeping the order, and washing each part before the previous one dries

## Things that break wudu
- Anything coming out of the front or back private parts (urine, stool, wind)
- Blood or pus coming out of the body and flowing
- Vomiting a mouthful
- Sleeping lying down or leaning so that the body relaxes
- Unconsciousness, insanity or intoxication
- An adult laughing out loud (audible to those nearby) in a prayer that has ruku and sajdah

${REVIEW_EN}`,
    refsUr: "بہارِ شریعت، حصہ 2 (وضو کا بیان)\nنور الایضاح، کتاب الطہارۃ",
    refsEn: "Bahar-e-Shariat, Part 2 (chapter on Wudu)\nNur al-Idah, Book of Taharah",
  },
  {
    slug: "ghusl-ka-tareeqa", category: "fiqh-taharat", cover: "drop",
    titleUr: "غسل کے فرائض اور مسنون طریقہ",
    titleEn: "Ghusl: its Fara'id and the Sunnah method",
    summaryUr: "غسل کے تین فرائض، سنت کے مطابق غسل کا طریقہ، اور خواتین کے لیے ضروری مسائل۔",
    summaryEn: "The three fara'id of ghusl, how to bathe according to the Sunnah, and points for women.",
    bodyUr: `## غسل کے تین فرائض
- کلی کرنا: منہ کے ہر حصے تک پانی پہنچانا؛ روزہ نہ ہو تو غرغرہ بھی کرنا۔
- ناک میں پانی ڈالنا: نتھنوں میں نرم ہڈی تک پانی پہنچانا۔
- پورے بدن پر پانی بہانا کہ بال برابر جگہ بھی خشک نہ رہے۔

## غسل کا مسنون طریقہ
- دل میں نیت کر کے بسم اللہ پڑھیں۔
- دونوں ہاتھ گٹوں تک تین بار دھوئیں، پھر استنجے کی جگہ دھوئیں، نجاست ہو یا نہ ہو۔
- بدن پر کہیں نجاست لگی ہو تو اسے دور کریں۔
- نماز جیسا وضو کریں؛ اگر نہانے کی جگہ پانی جمع ہوتا ہو تو پاؤں آخر میں دھوئیں۔
- پہلے سر پر تین بار، پھر دائیں کندھے پر تین بار، پھر بائیں کندھے پر تین بار پانی بہائیں، اور پورے بدن پر ہاتھ پھیر کر ملیں۔

## غسل کب فرض ہوتا ہے
- شہوت کے ساتھ منی کا نکلنا، احتلام، اور میاں بیوی کا ملاپ
- خواتین کے لیے حیض اور نفاس ختم ہونے پر

## خواتین کے لیے
- اگر بال گندھے ہوئے (چوٹی) ہوں تو بالوں کی جڑوں تک پانی پہنچ جانا کافی ہے؛ چوٹی کھولنا ضروری نہیں۔
- ناک یا کان میں سوراخ ہو تو اس میں پانی پہنچانا ضروری ہے۔

${REVIEW_UR}`,
    bodyEn: `## The three fara'id of ghusl
- Rinsing the mouth so water reaches every part of it; gargling as well when not fasting.
- Putting water into the nose up to the soft bone.
- Pouring water over the whole body so that not even a hair's breadth stays dry.

## The Sunnah method
- Make the intention in your heart and say Bismillah.
- Wash both hands to the wrists three times, then wash the private parts, whether or not there is impurity.
- Remove any impurity from the body.
- Perform wudu as for prayer; if water collects where you stand, wash the feet at the end.
- Pour water over the head three times, then the right shoulder three times, then the left shoulder three times, and rub the whole body.

## When ghusl becomes fard
- Discharge of semen with desire, a wet dream, and marital relations
- For women, at the end of menstruation (haiz) and post-natal bleeding (nifas)

## For women
- If the hair is braided, it is enough for water to reach the roots; undoing the braids is not required.
- If the nose or ears are pierced, water must reach inside the holes.

${REVIEW_EN}`,
    refsUr: "بہارِ شریعت، حصہ 2 (غسل کا بیان)",
    refsEn: "Bahar-e-Shariat, Part 2 (chapter on Ghusl)",
  },
  {
    slug: "tayammum", category: "fiqh-taharat", cover: "drop",
    titleUr: "تیمم کب اور کیسے کریں؟",
    titleEn: "Tayammum: when and how",
    summaryUr: "پانی نہ ملنے یا بیماری کی صورت میں تیمم — اس کے فرائض اور طریقہ۔",
    summaryEn: "Dry ablution when water is unavailable or harmful — its fara'id and method.",
    bodyUr: `## تیمم کب جائز ہے
- پانی ایک میل یا اس سے زیادہ دور ہو۔
- پانی استعمال کرنے سے بیماری بڑھنے یا دیر سے ٹھیک ہونے کا صحیح اندیشہ ہو۔

## تیمم کے تین فرائض
- نیت کرنا
- پورے چہرے کا مسح کرنا
- دونوں ہاتھوں کا کہنیوں سمیت مسح کرنا

## تیمم کا طریقہ
- بسم اللہ پڑھ کر نیت کریں۔
- دونوں ہاتھ پاک مٹی، یا مٹی کی جنس کی کسی پاک چیز پر مار کر جھاڑ لیں اور پورے چہرے پر پھیریں۔
- دوبارہ ہاتھ مار کر دونوں ہاتھوں پر کہنیوں سمیت پھیریں؛ انگوٹھی یا چوڑیاں ہوں تو انہیں ہٹا کر یا ہلا کر مسح کریں۔

## تیمم کب ٹوٹتا ہے
- جن چیزوں سے وضو ٹوٹتا ہے ان سے تیمم بھی ٹوٹ جاتا ہے۔
- جس عذر کی وجہ سے تیمم کیا تھا وہ ختم ہو جائے، مثلاً پانی مل جائے۔

${REVIEW_UR}`,
    bodyEn: `## When tayammum is allowed
- Water is a mile or more away.
- There is a genuine fear that using water will worsen an illness or delay recovery.

## The three fara'id of tayammum
- Intention
- Wiping the whole face
- Wiping both arms including the elbows

## Method
- Say Bismillah and make the intention.
- Strike both hands on clean earth, or anything clean of the same kind as earth, shake them, and wipe the whole face.
- Strike again and wipe both arms including the elbows; move or remove rings and bangles.

## What ends tayammum
- Everything that breaks wudu also breaks tayammum.
- The excuse ends, for example water becomes available.

${REVIEW_EN}`,
    refsUr: "بہارِ شریعت، حصہ 2 (تیمم کا بیان)",
    refsEn: "Bahar-e-Shariat, Part 2 (chapter on Tayammum)",
  },
  {
    slug: "namaz-ki-sharait-aur-faraiz", category: "fiqh-namaz", cover: "star",
    titleUr: "نماز کی شرائط اور فرائض",
    titleEn: "The conditions and fara'id of Namaz",
    summaryUr: "نماز سے پہلے کی چھ شرائط اور نماز کے اندر کے سات فرائض — جن کے بغیر نماز نہیں ہوتی۔",
    summaryEn: "The six conditions before prayer and the seven fara'id within it — without which the prayer is not valid.",
    bodyUr: `## نماز کی چھ شرائط
- طہارت: بدن، کپڑے اور نماز کی جگہ کا پاک ہونا، اور باوضو ہونا
- سترِ عورت: مرد کے لیے ناف سے گھٹنوں تک؛ عورت کے لیے چہرے، دونوں ہتھیلیوں اور پاؤں کے تلووں کے سوا پورا بدن
- قبلہ رخ ہونا
- نماز کا وقت ہونا
- نیت کرنا
- تکبیرِ تحریمہ کہنا

## نماز کے سات فرائض
- تکبیرِ تحریمہ
- قیام
- قراءت
- رکوع
- دونوں سجدے
- قعدۂ اخیرہ: آخری رکعت میں التحیات کی مقدار بیٹھنا
- خروج بصنعہ: اپنے ارادے سے نماز سے نکلنا، جیسے سلام پھیرنا

> کوئی فرض رہ جائے تو نماز نہیں ہوتی، اور سجدۂ سہو سے بھی اس کی تلافی نہیں ہوتی؛ نماز دوبارہ پڑھنی ہوگی۔

${REVIEW_UR}`,
    bodyEn: `## The six conditions of prayer
- Purity: of the body, clothes and place, and being in wudu
- Covering the awrah: for men, from the navel to the knees; for women, the whole body except the face, palms and soles of the feet
- Facing the Qiblah
- The time of the prayer having begun
- Intention
- The opening Takbir (Takbir-e-Tahrimah)

## The seven fara'id of prayer
- Takbir-e-Tahrimah
- Standing (qiyam)
- Recitation (qira'at)
- Bowing (ruku)
- Both prostrations (sajdahs)
- The final sitting (qa'dah akhirah) for the length of At-Tahiyyat
- Ending the prayer by one's own act, such as saying salam

> If any fard is missed, the prayer is not valid and sajdah sahw cannot make up for it; the prayer must be repeated.

${REVIEW_EN}`,
    refsUr: "بہارِ شریعت، حصہ 3 (نماز کا بیان)",
    refsEn: "Bahar-e-Shariat, Part 3 (chapter on Namaz)",
  },
  {
    slug: "sajda-e-sahw", category: "fiqh-namaz", cover: "star",
    titleUr: "سجدۂ سہو: کب اور کیسے؟",
    titleEn: "Sajdah Sahw: when and how",
    summaryUr: "نماز میں بھول سے کوئی واجب چھوٹ جائے تو سجدۂ سہو کیسے کریں۔",
    summaryEn: "What to do when a wajib act of prayer is missed by mistake.",
    bodyUr: `## سجدۂ سہو کب واجب ہوتا ہے
- نماز کا کوئی واجب بھولے سے چھوٹ جائے، مثلاً سورۂ فاتحہ نہ پڑھنا، فرض کی پہلی دو رکعتوں میں فاتحہ کے بعد سورت ملانا بھول جانا، یا پہلا قعدہ چھوٹ جانا۔
- کسی فرض یا واجب کی ادائیگی میں بھولے سے تاخیر ہو جائے، مثلاً پہلے قعدے میں التحیات کے بعد درود شریف پڑھنا شروع کر دینا۔

## سجدۂ سہو کا طریقہ
- آخری قعدے میں التحیات پڑھ کر دائیں طرف ایک سلام پھیریں۔
- پھر دو سجدے کریں۔
- پھر بیٹھ کر التحیات، درود شریف اور دعا پڑھ کر دونوں طرف سلام پھیریں۔

> جان بوجھ کر واجب چھوڑا ہو تو سجدۂ سہو کافی نہیں؛ نماز دوبارہ پڑھنا واجب ہے۔ اور فرض چھوٹ جائے تو سجدۂ سہو سے نماز نہیں ہوتی۔

${REVIEW_UR}`,
    bodyEn: `## When sajdah sahw is wajib
- A wajib act is missed by mistake, for example not reciting Surah Al-Fatiha, forgetting to add a surah after Al-Fatiha in the first two rak'ahs of a fard prayer, or missing the first sitting.
- A fard or wajib act is delayed by mistake, for example starting the Durood Sharif after At-Tahiyyat in the first sitting.

## Method
- In the final sitting, after At-Tahiyyat, say one salam to the right.
- Then make two prostrations.
- Then sit, recite At-Tahiyyat, Durood Sharif and a dua, and finish with salam to both sides.

> If a wajib was left deliberately, sajdah sahw is not enough and the prayer must be repeated. If a fard is missed, sajdah sahw does not make the prayer valid.

${REVIEW_EN}`,
    refsUr: "بہارِ شریعت، حصہ 4 (سجدۂ سہو کا بیان)",
    refsEn: "Bahar-e-Shariat, Part 4 (chapter on Sajdah Sahw)",
  },
  {
    slug: "khawateen-ki-namaz", category: "women", cover: "moon",
    titleUr: "خواتین کی نماز: مردوں سے فرق",
    titleEn: "Women's Namaz: how it differs",
    summaryUr: "فقہ حنفی کے مطابق خواتین کی نماز کا طریقہ کن باتوں میں مختلف ہے۔",
    summaryEn: "The points in which a woman's prayer differs, according to Hanafi fiqh.",
    bodyUr: `## خواتین کی نماز کے خاص طریقے
- تکبیرِ تحریمہ کے وقت ہاتھ کندھوں تک اٹھائیں، اور دوپٹے یا چادر سے باہر نہ نکالیں۔
- قیام میں ہاتھ سینے پر رکھیں: دائیں ہتھیلی بائیں ہتھیلی کی پشت پر۔
- رکوع میں تھوڑا جھکیں، ہاتھ گھٹنوں پر رکھیں، انگلیاں ملی ہوئی ہوں اور گھٹنے قدرے جھکے ہوں۔
- سجدہ سمٹ کر کریں: بازو پہلوؤں سے، پیٹ رانوں سے اور رانیں پنڈلیوں سے ملی ہوں، اور کلائیاں زمین پر بچھی ہوں۔
- قعدے میں دونوں پاؤں دائیں طرف نکال کر بائیں سرین پر بیٹھیں۔
- کسی نماز میں قراءت بلند آواز سے نہ کریں۔
- خواتین کے لیے اذان اور اقامت نہیں۔

## پردہ (ستر)
نماز میں عورت کا چہرہ، دونوں ہتھیلیاں اور پاؤں کے تلوے کے سوا پورا بدن ڈھکا ہونا ضروری ہے؛ باریک دوپٹہ جس سے بال جھلکیں، کافی نہیں۔

${REVIEW_UR}`,
    bodyEn: `## Particular points in a woman's prayer
- At the opening Takbir, raise the hands to the shoulders without taking them out from under the dupatta or chador.
- In qiyam, place the hands on the chest: the right palm over the back of the left hand.
- In ruku, bend slightly, place the hands on the knees with the fingers together, and keep the knees slightly bent.
- Make sajdah compactly: arms against the sides, stomach against the thighs, thighs against the shins, and the forearms resting on the ground.
- In the sitting, bring both feet out to the right and sit on the left hip.
- Never recite aloud in any prayer.
- There is no adhan or iqamah for women.

## Covering (satr)
In prayer a woman must cover her whole body except the face, the palms and the soles of the feet; a thin dupatta through which the hair shows is not enough.

${REVIEW_EN}`,
    refsUr: "بہارِ شریعت، حصہ 3 (نماز کا طریقہ)",
    refsEn: "Bahar-e-Shariat, Part 3 (method of Namaz)",
  },
  {
    slug: "rozmarra-ke-adab", category: "adab", cover: "moon",
    titleUr: "روزمرہ کے آداب: کھانا، پینا اور سونا",
    titleEn: "Daily adab: eating, drinking and sleeping",
    summaryUr: "روزانہ کے کاموں کی چند سنتیں اور آداب جو گھر کے ہر فرد کو یاد ہونے چاہییں۔",
    summaryEn: "A few sunnahs and manners for everyday life that every family member should know.",
    bodyUr: `## کھانے کے آداب
- کھانے سے پہلے اور بعد ہاتھ دھوئیں۔
- بسم اللہ پڑھ کر شروع کریں؛ شروع میں بھول جائیں تو یاد آنے پر مسنون دعا پڑھ لیں۔
- دائیں ہاتھ سے اور اپنے سامنے سے کھائیں۔
- گرا ہوا لقمہ صاف کر کے کھا لیں، اور برتن صاف کریں۔
- کھانے کے بعد اللہ تعالیٰ کا شکر ادا کریں۔

## پینے کے آداب
- بیٹھ کر اور دائیں ہاتھ سے پئیں۔
- تین سانس میں پئیں، اور برتن میں سانس نہ لیں۔

## سونے کے آداب
- باوضو ہو کر سوئیں۔
- سونے سے پہلے بستر جھاڑ لیں۔
- دائیں کروٹ پر لیٹیں۔
- سونے اور جاگنے کی مسنون دعائیں کسی مستند کتاب سے یاد کریں۔

## گھر میں داخل ہوتے وقت
- گھر والوں کو سلام کریں۔

${REVIEW_UR}`,
    bodyEn: `## Eating
- Wash your hands before and after eating.
- Begin with Bismillah; if you forget, recite the masnoon dua when you remember.
- Eat with the right hand and from what is in front of you.
- Pick up a fallen morsel, clean it and eat it, and clean the plate.
- Thank Allah after eating.

## Drinking
- Drink sitting down and with the right hand.
- Drink in three breaths, and do not breathe into the cup.

## Sleeping
- Sleep in a state of wudu.
- Dust off the bed before lying down.
- Lie on your right side.
- Learn the masnoon duas for sleeping and waking from an authentic book.

## Entering the home
- Greet your family with salam.

${REVIEW_EN}`,
    refsUr: "بہارِ شریعت، حصہ 16 (کھانے پینے اور دیگر آداب)",
    refsEn: "Bahar-e-Shariat, Part 16 (manners of eating, drinking and daily life)",
  },
];
