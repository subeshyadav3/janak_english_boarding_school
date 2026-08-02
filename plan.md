# Janak School — Full Redesign Plan

## Current State Analysis

### Home page (`app/page.tsx`)
Sections in order: Navbar → HeroSlider → (new NoticeTicker) → HomeSection → AboutSection → StatsSection → FacilitiesSection → TeachersSection → NoticesResultsSection → TestimonialsSection → GallerySection → LocationSection → FaqSection → ContactSection → Footer.

| Section | What exists | Problems |
|---|---|---|
| HeroSlider | Full-width bg images + gradient + dots | **No text/CTA at all** — the original site had a headline, tagline, and buttons. This is a regression. |
| HomeSection | School name + tagline on dark band | Redundant with hero, no value |
| StatsSection | 4 static numbers | No animation, plain |
| FacilitiesSection | Numbered cards "01..06" | No icons, no visual identity |
| TeachersSection | Photo + role cards | Fine but basic |
| NoticesResultsSection | Rotating notice + results list | Results **only accept Google Drive links** (user complaint) |
| TestimonialsSection | Quote cards | Was hidden (empty DB) — now seeded, needs polish |
| GallerySection | Grid + lightbox | OK |
| About/Faq/Location/Contact | Static content | OK but can be improved |

### Admin dashboard (`app/admin/page.tsx`)
9 tabs: Overview, Teachers, Notices, Results, Gallery, Testimonials, Enquiries, Users, Settings. All CRUD works via API. Issues:
- **Results: only a Drive-link text input** — no file upload (PDF result sheets)
- Notices: only a raw filePath text input — no upload widget
- Inline-edit lists everywhere; no toast/success feedback
- Plain UX, no previews for teacher photos / result files
- `window.confirm()` for destructive actions

### Teacher dashboard (`app/teacher/TeacherDashboard.tsx`)
3 tabs: Overview, Results, Notices. Same problems as admin (Drive-only results, no uploads, no feedback).

### Backend
- `lib/db.ts` — Prisma 7 + `PrismaPg` (local Postgres now working)
- `app/api/upload/route.ts` — **only accepts images (jpg/png/webp/gif), 8MB max**; cannot upload PDF result sheets or notice files
- `Result` model has `driveLink` only — needs `filePath` for uploaded files
- Auth/roles working (admin vs teacher)

## Plan

### Phase 1 — Backend & schema (foundation)
1. **Result model**: add `filePath` (uploaded file) alongside existing `driveLink`. Push schema + regenerate client.
2. **Upload API** (`/api/upload`): accept PDFs + images, keep 8MB cap, keep admin/teacher auth. Generic file upload used by results, notices, teacher photos.
3. **Results API routes**: persist `filePath` on create/update.
4. Seed: add a result with a real uploaded-style filePath path.

### Phase 2 — Shared UI primitives
1. `lib/ui/FileUpload.tsx` — reusable drag/drop or click upload with image/pdf preview and "remove" state.
2. `lib/ui/Toast.tsx` — lightweight toast context for success/error feedback (replaces `alert()` and silent failures).
3. `lib/ui/ConfirmDialog.tsx` — styled confirm dialog replacing `window.confirm()`.

### Phase 3 — Home page redesign (better than the original)
1. **Hero**: rebuild with animated text overlay — school name, tagline, motto, CTA buttons (Admission / Contact), scroll-down indicator, slide progress dots. Keep the image crossfade.
2. **Remove HomeSection** (merged into hero). Add an **Admission CTA band** (gradient, "Admissions Open Nursery-Grade 8, Call/WhatsApp").
3. **StatsSection**: client component, count-up animation on scroll into view.
4. **FacilitiesSection**: icon-based cards (BookOpen, Globe, Shield, HeartHandshake, Trophy, Home) with color accents instead of numbers.
5. **TeachersSection**: refined cards — photo, role badge, subject, phone, hover lift.
6. **NoticesResultsSection**: results cards support **both** a file download button and a Drive link; show file type/size hint; ticker + rotating notice stay.
7. **TestimonialsSection**: modern quote cards with stars/avatar initials.
8. Footer/contact: minor polish.

### Phase 4 — Admin dashboard upgrade
1. **Results manager**: each result gets an upload widget (PDF/image) + optional Drive link field + live file preview + remove.
2. **Notices manager**: file upload widget for attachments (PDF) instead of raw text input.
3. **Teachers manager**: photo upload with preview thumbnail.
4. **Settings/Logo**: reuse FileUpload for logo + covers.
5. **Toasts** on every save/create/delete; styled confirm dialog for deletes.
6. Overview tab: keep stat cards + recent enquiries (already good).

### Phase 5 — Teacher dashboard upgrade
1. Results manager with file upload + Drive link (mirror admin).
2. Notices manager with file upload.
3. Toasts + styled confirms.

### Phase 6 — Verify
- `npm run build` (typecheck) + `npm run lint`
- Manual smoke test of upload → result with file → public page renders download button.

## Design decisions
- Keep the indigo (`brand`) + orange (`accent`) theme tokens.
- Server components for static sections; client components only where interaction needed.
- All uploads go through `/api/upload`, stored under `public/uploads/`.
- Results support BOTH uploaded file and Drive link (either is optional).
