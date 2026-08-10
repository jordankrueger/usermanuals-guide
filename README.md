# usermanuals.guide

Sales page for the [User Manuals Template for Notion](https://jordankrueger.gumroad.com/l/notion-user-manuals) —
a Notion template that helps teams write and share personal "user manuals" so colleagues
learn how each other work.

Built with [Astro](https://astro.build), deployed to Cloudflare Pages. Migrated off Carrd in
August 2026.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build to dist/
npm run preview    # serve the built site
npm run test       # vitest, covers the contact-form handler
```

## Structure

| Path | What it is |
| --- | --- |
| `src/site.config.ts` | All per-site copy: title, hero, price, FAQ |
| `src/pages/index.astro` | The single page |
| `src/styles/base.css` | Whole stylesheet |
| `functions/api/submit.ts` | Cloudflare Pages Function backing the contact form |

## Contact form

The form posts to `/api/submit`, which sends the message through
[Resend](https://resend.com) and redirects to `/thanks`. It needs three Cloudflare Pages
environment variables: `RESEND_API_KEY`, `FORM_TO`, and `FORM_FROM`.

Agent/maintenance notes are in [`AGENTS.md`](./AGENTS.md).
