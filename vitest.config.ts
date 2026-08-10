import { defineConfig } from "vitest/config";

// Unit tests live in functions/. Playwright specs in tests/ are handled by Playwright,
// not Vitest — exclude them so `vitest run` doesn't try to execute browser specs.
export default defineConfig({
  test: {
    include: ["functions/**/*.test.ts"],
  },
});
