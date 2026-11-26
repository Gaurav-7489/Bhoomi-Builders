# Bhoomi Builders — website

Marketing site for **Bhoomi Builders** (VNV Bhoomi Builders LLP), a design and construction company in Thrissur, Kerala. Built with Next.js (App Router), TypeScript, CSS Modules and [Motion for React](https://motion.dev).

| Route | What it is |
| --- | --- |
| `/` | Full-screen photo hero → intro → sample projects → services → FAQ → contact CTA |
| `/projects` | All case studies in a two-column grid |
| `/projects/[slug]` | Case study template: gallery, description, date, status, location, size, client, sector, next project |
| `/about` | Photo-led opening, company story, the three partners, FAQ, CTA |
| `/services` | Four numbered services |
| `/contact` | Studio details and the contact form |

## Quick start

Requires Node.js 20.9 or newer.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open http://localhost:3000. The contact and newsletter forms post to the URLs in `.env.local`. By default these point at a local mock endpoint, which you can run in a second terminal:

```bash
npm run mock
```

The mock logs every submission and stores it at http://localhost:4010/submissions. Any email address containing `fail` (e.g. `fail@example.com`) makes it answer with HTTP 500, so you can see the error state.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |
| `npm run mock` | Local stand-in for the form delivery endpoints (port 4010) |
| `npm run test:e2e` | Playwright end-to-end tests (run `npm run build` first) |

The Playwright tests start the mock and `next start` on port 3100 themselves. They cover navigation, all four case-study routes (direct load and refresh), the mobile menu, the FAQ (mouse and keyboard), reduced motion, and both form flows (validation, pending, success and failure).

```bash
npm run build && npm run test:e2e
```

If Playwright's browser isn't installed on your machine yet, run `npx playwright install chromium` once.

## Environment variables

See [`.env.example`](.env.example).

| Variable | Required | Purpose |
| --- | --- | --- |
| `CONTACT_WEBHOOK_URL` | Yes, for the contact form | Receives contact submissions as JSON |
| `NEWSLETTER_WEBHOOK_URL` | Yes, for sign-ups | Receives newsletter sign-ups as JSON |
| `FORMS_WEBHOOK_SECRET` | No | Sent as `Authorization: Bearer <secret>` with each submission |
| `FORMS_TIMEOUT_MS` | No | How long to wait for the endpoint (default 10000) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL used in metadata, `sitemap.xml` and `robots.txt` |

### How form delivery works

1. The browser validates the fields, then posts JSON to `/api/contact` or `/api/newsletter`.
2. The route handler validates again with the same [zod](https://zod.dev) schema (`src/lib/forms.ts`), drops honeypot hits, and forwards the data to the configured URL.
3. The visitor sees **success only when that URL answers with a 2xx status**. A missing URL returns 503 with a clear message, and a rejected or unreachable endpoint returns 502. Either way the visitor's input is kept so they can try again.

Payloads sent to your endpoint:

```json
{ "type": "contact", "name": "…", "email": "…", "phone": "…", "message": "…", "submittedAt": "2026-…Z", "source": "https://…" }
```

```json
{ "type": "newsletter", "email": "…", "submittedAt": "2026-…Z", "source": "https://…" }
```

Any service that accepts a JSON POST works, for example Formspree (`https://formspree.io/f/<form-id>`), a Zapier or Make "catch hook", Basin, or your own API or CRM endpoint.

## Editing content

All copy, links and image paths live in `src/content/`. You shouldn't need to touch any component to update the site.

| File | Contains |
| --- | --- |
| `src/content/site.ts` | Brand name, contact details (email, phone, address, hours), nav, social links, the five FAQ entries, testimonial, CTA |
| `src/content/projects.ts` | The four case studies: title, slug, summary, description, facts, cover and gallery images |
| `src/content/pages.ts` | Hero titles and intros for each page, home sections, the six services, About story, stats and team |

In headings, wrap a word in underscores to set it in italic: `"Built for _living_"`.

**Add a project:** add an entry to `projects` in `src/content/projects.ts` and put its images in `public/images/projects/`. The grid, home page, sitemap, "next project" link and the 404 check in `src/proxy.ts` all pick it up automatically.

## Replacing images

Images are in `public/images/`:

```
public/images/
  home/       hero, intro, full-width bands, testimonial, CTA
  pages/      hero image for projects, about, services and contact, plus About story images
  projects/   <slug>-cover.jpg and <slug>-1…4.jpg for each case study
  services/   one image per service
  team/       member-1…6.jpg portraits (shown at 4:5)
```

To swap an image, either overwrite the file with the same name or change its path in `src/content/`. Always update the matching `alt` text.

- Frames crop with `object-fit: cover` at fixed aspect ratios, so any size works. Landscape images of about 2000px wide suit heroes and full-width bands; 1400px is enough elsewhere.
- In a case study, gallery images 1 and 4 display wide (16:9) and images 2 and 3 display tall (4:5).
- Next.js serves resized WebP/AVIF versions automatically.

The current photographs are **placeholders** from [Unsplash](https://unsplash.com) (free to use under the Unsplash License). See [`IMAGE_CREDITS.md`](IMAGE_CREDITS.md). Replace them with your own project photography, team portraits and client testimonial before launch.

## Motion

| Effect | Where | How |
| --- | --- | --- |
| Intro | First visit per browser session | Pure CSS in `layout.tsx` + `globals.css`, so it runs before hydration and never blocks clicks |
| Sticky hero | Every page | CSS `position: sticky`; Motion drifts the photo at ~10% of scroll speed and darkens it as content slides over |
| Scroll-scaled image bands | Home | `ScrollImage` scales from 1.2× to 1× as the band crosses the viewport |
| Word-by-word heading reveals, fade-ups, image wipes | Site-wide | `src/components/motion/Reveal.tsx` (triggered once, on entering view) |
| Hover zoom on project cards | Grids | CSS transform transition |
| FAQ and services accordions | Shared | Motion height and opacity animation |

Everything respects `prefers-reduced-motion`: the intro is skipped, scroll-linked transforms are disabled, and all content is still shown.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository. The framework preset is detected as Next.js, so leave the build settings at their defaults.
3. Under **Settings → Environment Variables**, add `CONTACT_WEBHOOK_URL`, `NEWSLETTER_WEBHOOK_URL`, `NEXT_PUBLIC_SITE_URL` (your production URL) and, if you use one, `FORMS_WEBHOOK_SECRET`. Apply them to Production and Preview.
4. Deploy. Then submit both forms on the live site and confirm the submissions reach your endpoint.

Don't point the production variables at the local mock: it only exists on your machine, and the forms will (correctly) show an error.

## Project structure

```
src/
  app/                  routes (App Router), API route handlers, sitemap, robots
  components/           Header, Footer, PageHero, ProjectCard, Accordion, sections
    forms/              ContactForm, NewsletterForm, shared submit hook
    motion/             Reveal, ScrollImage, CountUp, MotionProvider
  content/              all editable copy and image paths
  lib/                  form schemas, delivery and request handling
  proxy.ts              returns a real 404 for unknown project slugs
scripts/mock-endpoint.mjs
tests/e2e/              Playwright specs
```
