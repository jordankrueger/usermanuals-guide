# carrd-starter — agent notes

This is a **public personal template** (Jordan's `jordankrueger` account) cloned once per site to
migrate Carrd one-pagers onto Cloudflare Pages.

## Rules

- **No client/MFC/SB118 content here.** Personal/SB118-public sites only. Never paste MFC,
  CampaignHelp, or any client material into this template or its clones.
- **No secrets in the repo.** `functions/api/submit.ts` reads `RESEND_API_KEY`, `FORM_TO`,
  `FORM_FROM` from Cloudflare Pages env bindings only. Never commit keys or `.env` files.
- **Per-site values live in `src/site.config.ts`** — don't hardcode copy, colors, or domains elsewhere.
- Keep it static: zero client JS except the optional, config-gated analytics snippet.

## Verify before done

- `npm run build` and `npx astro check` pass (0 errors).
- `npm run test` (vitest) passes for the form handler.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
