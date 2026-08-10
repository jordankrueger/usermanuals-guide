# usermanuals.guide — agent notes

Sales page for the **User Manuals Template for Notion** ($79). Migrated off Carrd
(2026-08-10) onto Astro + Cloudflare Pages, from the `jordankrueger/carrd-starter` template.

- **Live:** https://usermanuals.guide · **Preview:** https://usermanuals-guide.pages.dev
- **Repo:** `jordankrueger/usermanuals-guide` (public)
- **Cloudflare:** personal account, Pages project `usermanuals-guide`
- **Migration hub:** `~/ClaudeCode/side-hustle/carrd-migration/` (checklist, dossier, gotchas)

## Rules

- **Personal side-hustle project.** No MFC, SB118, or CampaignHelp client material here.
  The CampaignHelp *link* in the author bio is Jordan's own company and is intentional.
- **No secrets in the repo.** `functions/api/submit.ts` reads `RESEND_API_KEY`, `FORM_TO`,
  and `FORM_FROM` from Cloudflare Pages env bindings only.
- **Copy, price, and FAQ live in `src/site.config.ts`** — don't hardcode them elsewhere.
- Static only: zero client JS. The FAQ accordion is native `<details>`; there is no
  bundled script.

## Purchase flow

Checkout is **Gumroad**, deliberately kept as a plain outbound link (Jordan's call,
2026-08-10) rather than the Gumroad overlay embed, so the page ships no third-party JS.

- Product: https://jordankrueger.gumroad.com/l/notion-user-manuals
- The `Purchase` button in the hero is an in-page anchor to `#purchase`; the `Buy now`
  button in that card is the only link that leaves for Gumroad.
- **If the price changes, update `site.purchase.price` here AND on Gumroad** — the page
  also emits it as `schema.org/Offer` structured data, so a mismatch is visible to Google.

## Contact form

`POST /api/submit` → Cloudflare Pages Function → Resend → Jordan's inbox, then 303 to
`/thanks`.

- Required Pages env vars: `RESEND_API_KEY`, `FORM_TO`, `FORM_FROM`. `FORM_FROM` must be on
  a Resend-verified domain.
- A `_gotcha` honeypot field silently drops bots with a 303 (so they can't detect the block).
- The starter's `_n8n` passthrough was **removed** here: it POSTed the submission to any
  URL the client supplied, which is a request-forgery hole. Don't add it back.

## Verify before done

- `npm run build` and `npx astro check` pass (0 errors).
- `npm run test` (vitest) passes for the form handler.
- `../../tests/harness/run-site-checks.sh usermanuals.guide` passes.

## Development

```
npm run dev        # local dev
npm run build      # production build to dist/
npm run preview    # serve dist/
```
