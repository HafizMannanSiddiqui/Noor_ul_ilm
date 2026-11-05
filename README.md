# Noor-ul-Ilm · نور العلم

A website for an Ahl-e-Sunnat (Hanafi) campaign in Saddar Cantt, Lahore, that brings Deeni education to women and young people.
It is one Next.js 15 application that includes the public website, the admin panel, the database and logins. There is no separate backend.

- **Public site** in Urdu (default, RTL Nastaliq), English and Arabic, at `/ur`, `/en` and `/ar`
- **Admin panel** at `/admin`. It has role-based accounts and a scholar-approval workflow, and sisters' data can only be seen by female admins.
- **Fast on phones.** Animations use CSS and SVG with no images. Fonts are self-hosted and only load when a page needs them. Motion turns off for visitors who choose "reduce motion".

## Quick start (development)

```bash
npm install                 # npm 11+: if Prisma/esbuild scripts are blocked, run
                            # npm install-scripts approve @prisma/client prisma @prisma/engines esbuild
cp .env.example .env        # then edit .env — DATABASE_URL(_UNPOOLED), SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run setup               # creates the database + first admin + sample content
npm run dev                 # http://localhost:3000  (admin: http://localhost:3000/admin)
```

Demo accounts are created when `SEED_DEMO="true"`. They all use `DEMO_PASSWORD`:

| Email | Role | Can do |
|---|---|---|
| `ADMIN_EMAIL` from .env | Super admin | Accounts, activity log, posts, brothers' and public events |
| brothers@demo.local | Brothers' admin | Posts, brothers' and public events, brothers' join requests |
| sisters@demo.local (female) | Sisters' admin | Classes, female scholars, sisters' events, **sisters' registrations** |
| mufti@demo.local | Scholar | **Approve posts**, verify verses and hadith, answer youth Q&A |
| aalimah@demo.local (female) | Scholar + sisters' admin | Both of the above |

## Live Ayah, Hadith and Site settings

- **Ayah of the Day** loads live from api.alquran.cloud: Uthmani Arabic (Tanzil) with Kanz-ul-Iman in Urdu (`ur.kanzuliman`) and English (`en.ahmedraza`). **Hadith of the Day** is Imam an-Nawawi's Forty Hadith from the hadith-api (Arabic and English; scholars add Urdu in `src/content/daily.ts`). Responses are cached for a week by Next.js, nothing is stored in the database, and the cards have a "Status image" share button (1080×1920 PNG made in the browser).
- **Admin → Site settings** (super admin) edits contact numbers, donation accounts, spending, the team and the Ayah-of-the-Day list. Values are stored in the `Setting` table; `src/content/site.ts` only holds the defaults.
- **Admin → Community stats** shows joins per month, area, city, role and source (numbers only).
- Login accepts a **username** as well as an email: set `ADMIN_EMAIL="admin"` to sign in as `admin`.

## Sign in with Google (free)

Admins can sign in with their Google account instead of a password. Google does not charge for this.

1. Go to [Google Cloud Console](https://console.cloud.google.com/), create a project (any name, e.g. "Noor-ul-Ilm").
2. **APIs & Services → OAuth consent screen**: choose *External*, fill in the app name and your email, and save. Only the basic `email` and `profile` scopes are used, so Google does not need to review the app.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**, type *Web application*.
   Add the authorized redirect URI: `{SITE_URL}/admin/auth/google/callback`
   (for local testing: `http://localhost:3000/admin/auth/google/callback`).
4. Copy the client ID and secret into `.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, then restart the app.

The **Sign in with Google** button then appears on `/admin/login`. Google only proves who the person is: they get in **only if a super admin has already created an active account with the same email** (Admin → Admin accounts). Everyone else is turned away, and the attempt is recorded in the activity log. Password sign-in keeps working.

## Production

```bash
npm run build
npm start                   # or run behind PM2 / systemd with a reverse proxy (Nginx/Caddy) and HTTPS
```

Before launch:
1. Set `SEED_DEMO="false"`. Use your own `ADMIN_PASSWORD` and a new random `SESSION_SECRET`.
2. Have the scholars verify every verse and hadith (Admin, then Verses & Hadith) and approve the posts.
3. Set `SHOW_DRAFTS="false"`. After that, only approved posts and verified texts appear on the site.
4. Put your real phone numbers, accounts and registration number in `src/content/site.ts`.
5. Delete the demo accounts, or deactivate them in Admin, then Admin accounts.
6. Turn on your database provider's backups. The database holds private registration data, so keep backups secure.

**Hosting on Vercel (recommended, free):**
1. Import the GitHub repo in Vercel. `vercel.json` sets the framework to Next.js.
2. In the project, open **Storage → Create → Neon (Postgres)**, choose the free plan and connect it. This adds `DATABASE_URL` and `DATABASE_URL_UNPOOLED` for you.
3. In **Settings → Environment Variables**, add `SESSION_SECRET`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SEED_DEMO="false"`, `SHOW_DRAFTS`, `SITE_URL` (e.g. `https://your-project.vercel.app`) and, optionally, the Google keys.
4. Redeploy. The `vercel-build` script creates the tables, and on the very first deploy it adds the first admin and the sample content.

Any PostgreSQL works (Supabase, Railway, your own server). Put the pooled address in `DATABASE_URL` and the direct address in `DATABASE_URL_UNPOOLED`.

## Privacy and security model

| Rule | How it is enforced |
|---|---|
| Women's registration data is visible only to female admins | The `can.sistersSection` check requires the `SISTERS_ADMIN` role **and** gender F. A sisters' admin account can't be created for a man, and even the super admin is blocked. |
| Separate brothers' and sisters' admin roles | Every page and server action re-checks permissions on the server (`src/lib/roles.ts`). Hiding buttons is not treated as security. |
| No public member lists | Registrations and join requests are only stored in the database and shown in the admin panel. No public page lists them. |
| No photos of women | The site has no image upload. Scholar profiles are text only and cover art is geometric SVG. |
| Content must be approved by a named scholar | Only a `SCHOLAR` account can approve. Any edit takes a post off the site until it is approved again. The reviewer's name appears on the post. |
| Verses and hadith come from verified sources only | They live in one library (Admin, then Verses & Hadith) and are embedded in posts as `[[ayah:key]]`. Editing a text removes its verification. |
| Accountability | The activity log records logins, edits, approvals and every time someone opens private registrations. |

Other protections: bcrypt password hashing, httpOnly signed session cookie (8 hours), limits on login attempts and form submissions, a hidden honeypot field against spam bots, security headers, and `noindex` on admin pages.

## Project layout

```
prisma/schema.prisma       database tables
prisma/seed.ts             first admin + sample content
src/content/site.ts        names, phone numbers, accounts, areas, categories, quiz, stories
src/lib/                   auth, Google sign-in, roles (permissions), prayer times, i18n
src/lib/strings.ts         interface text in 3 languages
src/app/[lang]/            public pages
src/app/admin/             admin panel (+ _actions = server-side write operations)
src/components/            logo, hero, prayer ring, cards, forms…
src/app/globals.css        design system and all animations
```

## Content notes

- The sample Arabic for 96:1, 20:114 (part), 39:9 (part) and Ibn Majah 224 is a starting point and is marked **unverified**. All Kanz-ul-Iman Urdu and English translations are placeholders. The scholars must verify them before launch.
- Prayer times are calculated for Lahore (Karachi method 18°/18°, Hanafi Asr). You can add minutes of precaution for each prayer in `src/content/site.ts`.
- The Hijri date uses the Umm al-Qura calendar. `HIJRI_ADJUST_DAYS` shifts it to match Pakistan's Ruet-e-Hilal.
