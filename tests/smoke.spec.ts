import { test, expect } from "@playwright/test";

test("home loads with an h1 and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    // Ignore failed third-party resource loads (e.g. Cloudflare's analytics beacon blocked
    // by an ad-blocker in the test environment) — those aren't site-code defects.
    if (
      m.type() === "error" &&
      !m.text().startsWith("Failed to load resource")
    ) {
      errors.push(m.text());
    }
  });
  page.on("pageerror", (e) => errors.push(String(e)));

  const resp = await page.goto("/");
  expect(resp?.status() ?? 0, "home page HTTP status").toBeLessThan(400);
  await expect(page.locator("h1").first()).toBeVisible();
  expect(errors, `console errors: ${errors.join(" | ")}`).toHaveLength(0);
});

test("same-origin links resolve (<400)", async ({ page, request }) => {
  await page.goto("/");
  const origin = new URL(page.url()).origin;
  const hrefs = await page
    .locator("a[href]")
    .evaluateAll((els) => els.map((a) => (a as HTMLAnchorElement).href));
  const sameOrigin = [...new Set(hrefs)].filter((h) => h.startsWith(origin));
  for (const href of sameOrigin) {
    const r = await request.get(href);
    expect(r.status(), `link ${href}`).toBeLessThan(400);
  }
});

test("capture full-page screenshot", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
  });
});

test("contact form, if present, is wired to /api/submit (no live submit)", async ({
  page,
}) => {
  await page.goto("/");
  const form = page.locator('form[action="/api/submit"]');
  if ((await form.count()) === 0) {
    test.skip(true, "no contact form on this site");
    return;
  }
  // Assert wiring only — never POST during automated runs (would send a real email).
  // Works for the contact form (textarea message) AND email-only newsletter signups
  // (hidden message field): require an email input + a message field of some kind.
  await expect(form).toHaveAttribute("method", /post/i);
  await expect(form.locator('input[name="email"]')).toHaveAttribute(
    "required",
    "",
  );
  await expect(form.locator('[name="message"]')).toHaveCount(1);
});
