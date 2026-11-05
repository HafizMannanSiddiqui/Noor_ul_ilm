# Sitemap — Noor-ul-Ilm

`/` redirects to the visitor's last language, or Urdu by default. Every public page exists in `/ur`, `/en` and `/ar`.

```
/{lang} ...................... Home
│   Hero: Bismillah, calligraphic name in a mihrab arch, hanging lanterns,
│         a slowly turning star rosette, rising light particles
│   Buttons: Join Us · Register for a Class · Donate
│   Animated counters: classes · scholars · areas · upcoming gatherings
│   Featured banner: the next big gathering (e.g. monthly Dars-e-Quran) with a day countdown
│   Today: Hijri + Gregorian date
│   Prayer times for Lahore (Hanafi Asr) with a live countdown ring
│   Ayah of the Day · Hadith of the Day
│   Upcoming classes & events · Latest posts
├─ /{lang}/about ............. Mission · Maslak · Why women's education matters
│                              (verses/hadith) · Scholarly review board · Team
├─ /{lang}/posts ............. Islamic Posts, filtered by ?cat=
│   │   aqaid · fiqh (taharat, namaz, roza, zakat, hajj) · seerat · sahaba
│   │   auliya · women · family · naat
│   └─ /{lang}/posts/{slug} .. Post: cover, "Reviewed by", body with verse and hadith
│                              cards, references, WhatsApp/Facebook share, reading-progress bar
├─ /{lang}/sisters ........... Women's Corner: class browser (level, age, online/in person),
│                              #register form (goes to female admins only), scholar profiles (text only)
├─ /{lang}/youth ............. Quiz · history stories · Q&A + "ask a question" form
├─ /{lang}/events ............ Events by area of Lahore (?area=saddar …)
├─ /{lang}/join .............. Join Our Community (name, phone, brother/sister, area, role)
├─ /{lang}/donate ............ Sadaqah · Atiyat · Zakat policy · JazzCash/Easypaisa/bank · transparency bars
└─ /{lang}/contact ........... WhatsApp (general + sisters' coordinator) · phone · email · map (loads on tap)

/admin ....................... Dashboard (sections depend on role)
├─ /admin/login ................................ email + password, or Sign in with Google
├─ /admin/auth/google(/callback) .............. Google sign-in (only for existing admin emails)
├─ /admin/posts, /admin/posts/{id|new} ........ write → send for review → scholar approves
├─ /admin/texts, /admin/texts/{id|new} ........ Verses & Hadith library + scholar verification
├─ /admin/questions ........................... Youth Q&A (scholars)
├─ /admin/events, /admin/events/{id|new}
├─ /admin/classes, /admin/classes/{id|new} .... sisters' admins only
├─ /admin/scholars, /admin/scholars/{id|new} .. sisters' admins only
├─ /admin/registrations ....................... PRIVATE: female sisters' admins only (every view is logged)
├─ /admin/members ............................. join requests (each admin sees only their section)
├─ /admin/users ............................... super admin
└─ /admin/audit ............................... activity log (super admin)

/sitemap.xml · /robots.txt (admin is blocked from search engines) · /icon.svg
```
