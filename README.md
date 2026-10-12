# Cyber Heights Gym — Website

Zero-dependency static site generator (Node 18+). Prices, trainers, testimonials, transformations, timetable, phone, email and address are **sample placeholders** — replace them with the gym's real details before launch.

```bash
npm run build   # generates ./dist
npm run serve   # preview at http://localhost:4176
npm run dev     # build + serve
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront).

## Pages
Home · Programs (+ one page per program) · Membership & pricing · Class schedule · Trainers · About · Contact · BMI & calorie calculator · Blog · Careers · Privacy / Membership terms / Health disclaimer · 404

## Where to edit
| What | File |
|---|---|
| Gym name, phone, WhatsApp, email, address, opening hours, lead endpoint, popup delay | `site.config.js` |
| Programs (each entry → program page, listing card, sitemap, schema) | `data/programs.js` |
| Hero slides, stats, why-us, facilities, membership plans, PT packs, trainers, testimonials, transformations, weekly timetable, timeline, jobs, FAQs | `data/content.js` |
| Blog posts | `data/blog.js` |
| Colours / fonts (CSS tokens at the top) | `assets/css/main.css` |
| Interactions (sliders, forms, filters, BMI calculator, timetable tabs, popup) | `assets/js/main.js` |
| Page templates | `src/pages/*.js`, shared components in `src/components.js`, layout in `src/layout.js` |
| Logo | `assets/img/brand/logo-mark.svg`, favicon `assets/img/logo.svg` |

The build fails fast if the timetable or a program references a trainer or program slug that doesn't exist.

## Adding a program
Copy an object in `data/programs.js`, change the `slug` and details, add its classes to `schedule` in `data/content.js` if it has fixed timings, and run `npm run build`. Images accept an Unsplash photo ID, a full URL, or a local `/assets/...` path.

## Leads — FastAPI backend
Every form (free trial, offer popup, membership, contact, PT callback) posts to the FastAPI service in `backend/` (see `backend/README.md`):
```bash
npm run api:setup   # first time
npm run api         # API on http://localhost:8003 (docs: /docs)
npm run dev         # website on http://localhost:4176
```
For production, build with `LEAD_ENDPOINT=https://api.yourdomain.com/api/leads npm run build`.
Building with `LEAD_ENDPOINT=""` falls back to storing leads in the browser's `localStorage` (offline demo).
