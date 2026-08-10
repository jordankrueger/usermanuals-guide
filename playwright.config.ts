import { defineConfig, devices } from "@playwright/test";

// When SITE_URL is set (e.g. by the hub's run-site-checks.sh against a live domain),
// test that URL directly. Otherwise build+preview locally and test the static output.
const siteUrl = process.env.SITE_URL;
const localUrl = "http://localhost:4321";

export default defineConfig({
  testDir: "./tests",
  reporter: [["list"]],
  use: {
    baseURL: siteUrl ?? localUrl,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  // Only spin up a local preview server when we're NOT pointed at a live URL.
  ...(siteUrl
    ? {}
    : {
        webServer: {
          command: "npm run build && npm run preview",
          url: localUrl,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
});
