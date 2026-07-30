# Portfolio Website

Personal portfolio built from the design mockups in `portfolio website/`.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Resend

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Where the content lives

There is no CMS and no database — all content is typed data in `src/content/`, so it is
version-controlled and type-checked, and every page is statically prerendered.

| File | What's in it |
| --- | --- |
| `src/content/site.ts` | Name, headline, tagline, bio, email, socials, fun facts |
| `src/content/projects.ts` | `completeApps` (with thumbnails) and `smallProjects` |
| `src/content/skills.ts` | The skill boxes |
| `src/content/types.ts` | Shapes for all of the above |

**Everything currently in those files is placeholder text.** Replace it — nothing is
referenced by name elsewhere, so you can edit freely without touching components.

### Images

- Project thumbnails: drop into `public/projects/` and set `image: "/projects/foo.png"`.
  Cards draw a placeholder tile until you do, so the layout never shifts.
- Portrait: add to `public/` and pass `src` to `<Portrait />` in
  `src/components/sections/hero.tsx` and `src/app/about-me/page.tsx`.

## Contact form

`POST /api/contact` — a Next.js Route Handler at `src/app/api/contact/route.ts`.

The request path is: rate limit → JSON parse → zod validation → honeypot check → send.
The route itself is only an HTTP adapter; the actual work lives in
`src/lib/contact/service.ts`, which imports nothing from `next/*`. If the site ever
outgrows Route Handlers, that file moves into an Express app unchanged and only the
adapter gets rewritten.

**It works without configuration** — with no env vars set, submissions are validated and
logged server-side rather than emailed, and the form reports that honestly. To enable real
delivery, copy `.env.example` to `.env.local` and fill in your
[Resend](https://resend.com) credentials.

Note that rate limiting is in-process, so it resets on a serverless cold start. That is a
deliberate trade-off for a portfolio; swap the Map in `src/lib/rate-limit.ts` for Redis if
it ever needs to be authoritative.

## SEO and metadata

`sitemap.xml`, `robots.txt` and the favicon are all generated — see `src/app/sitemap.ts`,
`robots.ts` and `icon.tsx`. They derive their URLs from `siteUrl` in
`src/content/site.ts`, which reads `NEXT_PUBLIC_SITE_URL` and falls back to localhost.

**Set `NEXT_PUBLIC_SITE_URL` once you have a domain.** Until you do, canonical links and
Open Graph URLs will point at localhost.

If you add a page, add it to `sitemap.ts` too — the route list there is manual.

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com) — the defaults are
correct for this project. Set these environment variables in the Vercel dashboard:

- `NEXT_PUBLIC_SITE_URL` — your domain, no trailing slash
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` — only if you want the
  contact form to deliver email rather than log server-side

## Notes on the design

- Tokens (colours, font) are defined once in the `@theme` block of `src/app/globals.css`.
  Tailwind v4 is CSS-first, so there is no `tailwind.config.js`.
- Section headings use a `#` prefix, page titles use `/` — see
  `src/components/ui/section-heading.tsx` and `page-title.tsx`.
- Two deliberate deviations from the mockups: the nav language switcher is omitted (the
  site is English-only), and a contact form was added to the contacts page so the backend
  has a real job. Both are easy to reverse.
