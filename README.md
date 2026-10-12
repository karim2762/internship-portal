# InternPath – Internship Portal

**Live app:** _paste Vercel URL_ · **Walkthrough video:** _paste link_ · **Test evidence:** [docs/evidence](docs/evidence/CHECKLIST.md)

Search, filter, and apply to internships. Mobile-first, keyboard accessible.

## Tech stack
Next.js 14 (App Router, UI + API routes), plain CSS, Node built-in test runner. Deployed on Vercel.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm test         # regression tests
npm run build    # production build
```
No environment variables are required.

## API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/internships?q=&type=` | List/filter internships |
| POST | `/api/applications` | Submit `{internshipId,name,email,message}`; 201, 400 with field errors, 429 if rate limited |
| GET | `/api/health` | `{status, uptimeSeconds, time}` |

## Quality
- **Logging:** one JSON line per request event (`lib/log.mjs`); no personal data or message bodies logged.
- **Security:** server-side validation, per-IP rate limit (5/min), security headers in `next.config.js`, no secrets in repo.
- **Accessibility:** labelled fields, `aria-live` states, visible focus, skip link, 44px tap targets, dark mode, reduced motion.

## Engineering decisions
- **Next.js on Vercel:** one repo ships UI and API with zero server setup.
- **In-memory data:** keeps the demo simple. Applications reset on serverless cold starts. Next step: Vercel Postgres or Supabase.
- **Rate limit in memory:** fine for a demo; use Upstash Redis for a real multi-instance limit.
- **No UI library:** small bundle, faster mobile load.
