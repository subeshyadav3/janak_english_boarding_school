# 🏫 Janak English Boarding School

> A complete, production-ready school website for **Janak English Boarding School Pvt. Ltd., Gaur, Rautahat** — with a public frontend, an admin dashboard, and a teacher dashboard, all backed by PostgreSQL (Neon), Resend email, and Vercel Blob storage.

Built with **Next.js 16 (App Router)**, **React 19**, **Prisma 7**, **Tailwind CSS 4**, and **PostgreSQL** — deployed on **Vercel**.

---

## ✨ Features

### 🌐 Public website
- **Hero slideshow** with auto-play, arrows, and progress dots (covers + unlimited extra images)
- **About, Mission, and Stats** section (established 1996, Nursery–Grade 8, English medium)
- **Teachers** section with photos and roles
- **Notices & Exam Results** with a beautiful popup file viewer (PDF/image) + open/download
- **Upcoming events**, **Testimonials**, **Gallery**, and **FAQ**
- **Contact / Enquiry form** with category selection (admission, fees, academics, events, transport, general, other) that sends email via **Resend**, plus direct **WhatsApp** and **Email** buttons
- **Location** section with embedded Google Map and directions
- **SEO-ready**: metadata, OpenGraph, schema.org JSON-LD (School / WebSite / FAQ), `sitemap.xml`, `robots.txt`, Google Search Console verification, geo tags

### 🔐 Admin dashboard (`/admin`)
- Overview with quick stats
- Manage **Teachers, Notices, Results, Events, Gallery, Testimonials, Enquiries, Users, Site Settings**, and an **Admission** banner
- List + add/edit/view modal pattern for every section, with image/PDF uploads and search
- **Site Settings** editor: school info, contact details, logo, hero covers (1–4), and unlimited "More Slideshow Images"
- **Admission manager**: editable title, text, call/WhatsApp buttons, and enable/disable toggle

### 👩🏫 Teacher dashboard (`/teacher`)
- Manage exam **results** and **notices** for the school

### 🗄️ Data & auth
- **PostgreSQL** via **Prisma** with the `PrismaPg` adapter
- Signed-cookie sessions (HMAC) lasting **180 days** with role-based access (`admin` / `teacher`)
- Bcrypt-hashed passwords
- **Vercel Blob** for uploads with automatic local `/public/uploads` fallback

---

## 🧱 Tech stack

| Layer      | Tech |
|------------|------|
| Framework  | [Next.js 16](https://nextjs.org) (App Router, TypeScript) |
| UI         | React 19, Tailwind CSS 4, Lucide icons |
| Database   | PostgreSQL (Neon) |
| ORM        | [Prisma 7](https://prisma.io) + `@prisma/adapter-pg` |
| Auth       | HMAC-signed cookie sessions (custom, in `lib/auth.ts`) |
| Email      | [Resend](https://resend.com) |
| Storage    | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) + local fallback |
| Deployment | Vercel |

---

## 🚀 Getting started

### 1. Clone & install

```bash
git clone https://github.com/subeshyadav3/janak_english_boarding_school.git
cd janak-school
npm install
```

### 2. Configure environment variables

Copy the template and fill it in:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `DIRECT_URL` | Direct (non-pooled) PostgreSQL connection string (Neon) |
| `ADMIN_SESSION_SECRET` | Secret for signing admin session cookies — `openssl rand -base64 32` |
| `ADMIN_USERNAME` | Default admin username (used by the seed) |
| `ADMIN_PASSWORD` | Default admin password (used by the seed) |
| `ENQUIRY_EMAIL` | Recipient for contact-form messages |
| `RESEND_API_KEY` | Resend API key for sending enquiry emails |
| `RESEND_FROM` | Verified sender address in Resend |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (empty locally → falls back to `/public/uploads`) |

### 3. Set up the database

```bash
npm run prisma:generate   # generate the Prisma client
npm run prisma:push       # create/update tables in your database
npm run prisma:seed       # seed default settings, teachers, notices, etc.
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Login at `/login` with the credentials from your seed (default `admin` / `admin123`).

---

## 📁 Project structure

```
app/
├── components/          # Public UI components (Navbar, Footer, HeroSlider, sections…)
│   └── sections/        # Homepage sections (About, NoticesResults, Contact, Gallery…)
├── api/                 # Route handlers (admin CRUD, enquiries, login, upload)
│   └── admin/           # Admin CRUD endpoints for each section
├── admin/               # Admin dashboard (client page + layout)
├── teacher/             # Teacher dashboard
├── login/               # Login page
├── layout.tsx           # Root layout (metadata, SEO, fonts)
└── page.tsx             # Homepage (server component)
lib/
├── db.ts                # Prisma client (Pg adapter)
├── auth.ts              # Session create/verify/destroy
├── admin-guard.ts       # Role-based API guard
├── data.ts              # Server-side data fetchers
├── constants.ts         # Types, defaults, category labels
├── site.ts              # Site URL constants
└── ui/                  # Shared UI (modals, forms, toasts, CRUD manager)
prisma/
└── schema.prisma        # Database schema (Setting, Teacher, Notice, Result, Event, …)
```

---

## 🔑 Default logins

After seeding, the following users exist:

| Role    | Username  | Password   | Access |
|---------|-----------|------------|--------|
| Admin   | `admin`   | `admin123` | `/admin` (full control) |
| Teacher | `teacher` | `admin123` | `/teacher` (results & notices) |

> ⚠️ Change these passwords immediately after first login.

---

## 📦 Database schema

The data model (`prisma/schema.prisma`) includes:

- **Setting** — school info, contact details, hero covers, admission banner, `extraCovers` (JSON list)
- **Teacher** — name, position, subject, photo
- **Notice** — title, description, attachment (PDF/image), published flag
- **Result** — title, Drive link, uploaded file
- **Event** — title, date, time, venue, description
- **GalleryItem** — image, title, album
- **Testimonial** — quote, author
- **Enquiry** — contact-form submissions (with category)
- **AdminUser** — bcrypt-hashed credentials with `admin` / `teacher` roles

---

## 📨 Emails

Enquiry form submissions are stored in the database **and** sent as an HTML email via **Resend** to `ENQUIRY_EMAIL`, with only the fields the visitor filled in (visitor name, email, phone, category, and message) — HTML-escaped for safety.

---

## 🖼️ File uploads

- Uploads go to **Vercel Blob** (`put()` with `access: 'public'`), giving persistent URLs across deploys.
- If no `BLOB_READ_WRITE_TOKEN` is configured (e.g., local dev), the server falls back to saving in `public/uploads/`.
- Allowed types: JPG, PNG, WEBP, GIF, PDF (max 4.5 MB to stay within Vercel's serverless body limit).

---

## ☁️ Deployment (Vercel)

1. Push the repo to GitHub and import it in Vercel (connect **`subeshyadav3/janak_english_boarding_school`**).
2. Set the production branch to `main`.
3. Add the environment variables from `.env.example` in **Project → Settings → Environments**.
4. Create a Blob store (Vercel → **Storage**) and connect it to the project — `BLOB_READ_WRITE_TOKEN` is injected automatically.
5. Create a Neon database and set `DATABASE_URL` / `DIRECT_URL`.
6. Deploy. Vercel auto-deploys on every push to `main`.

---

## 🛠️ Available scripts

```bash
npm run dev            # start dev server
npm run build          # production build
npm run start          # start production server
npm run lint           # run ESLint
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
npm run prisma:seed
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes
4. Push and open a pull request

---

## 📄 License

Private project for Janak English Boarding School. All content (name, text, photos) is property of the school.
