# carrd-starter

Astro static-site starter template for migrating one-page sites off Carrd onto
GitHub + Cloudflare Pages. Clone it once per site; the only file you normally edit
is `src/site.config.ts`.

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm run test     # vitest (form-handler unit tests)
npx astro check  # type/diagnostics check
```

## Editing a site — `src/site.config.ts`

Everything per-site lives in one typed object. Fields:

- `domain` _(required)_ — bare domain, e.g. `"example.com"`. Used for canonical URL + footer.
- `title` _(required)_ — site/brand name (also the hero eyebrow).
- `description` _(required)_ — meta description + OpenGraph/Twitter description.
- `themeColor` _(required)_ — hex; drives the `--theme` CSS variable (headings, links).
- `accentColor` _(required)_ — hex; drives the `--accent` CSS variable (buttons, highlights).
- `analyticsId` _(optional)_ — when set, `Analytics.astro` emits its snippet; when omitted, nothing.
- `hero` _(required)_ — `{ heading, subheading?, image? }`.
- `links` _(optional)_ — `LinkItem[]` (`{ label, href }`), rendered as a link list.
- `cta` _(optional)_ — `{ label, href }`, rendered as a call-to-action button section.
- `bio` _(optional)_ — `{ heading?, body, image? }`.
- `form` _(optional)_ — `{ enabled, toEmail, n8nWebhook? }`. When `enabled`, the contact form renders.
- `socials` _(optional)_ — `LinkItem[]` for the footer.

Sections render only when their config key is present, so a minimal site is just
`domain/title/description/themeColor/accentColor/hero`.

## Forms

When `form.enabled` is true, `ContactForm.astro` renders a form that POSTs to the
Cloudflare Pages Function at `functions/api/submit.ts`. That function:

1. Validates `email` + `message`.
2. Sends an email via the **Resend** API.
3. Optionally forwards the raw fields to an n8n webhook (hidden `_n8n` field), best-effort.
4. Redirects (303) to `/thanks`.

### Required Pages environment variables (set per-site at deploy, never committed)

- `RESEND_API_KEY` — Resend API key for the account that owns the verified sender domain.
- `FORM_TO` — destination inbox (e.g. `jordan@jordankrueger.com`).
- `FORM_FROM` — a verified Resend sender address for this domain.

A failed Resend send is logged (visible via `wrangler pages deployment tail`) but does not
error the visitor's submission.

## Deploy (Cloudflare Pages)

- Build command: `npm run build` · Output dir: `dist/`
- Connect the repo to a Pages project on the correct Cloudflare account.
- Add the env vars above if the site has a form.
- Attach the custom domain once DNS is on Cloudflare.

## Structure

- `src/site.config.ts` — the per-site config contract (single source of truth).
- `src/layouts/BaseLayout.astro` — HTML shell, sets CSS vars from config, renders SEO/Footer/Analytics.
- `src/components/` — `SEO`, `Analytics`, `Footer`, `ContactForm`, and `sections/` (Hero/Links/CTA/Bio).
- `src/pages/` — `index.astro` (composes sections) and `thanks.astro`.
- `functions/api/submit.ts` — Cloudflare Pages Function for form handling.
- `src/styles/base.css` — shared styles, driven by `--theme`/`--accent`.
