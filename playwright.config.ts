import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against a production build (`npm run build` first)
 * and the local mock form endpoint. `npm run test:e2e` does both.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const MOCK_PORT = Number(process.env.MOCK_PORT ?? 4010);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "off",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testIgnore: /mobile\.spec/,
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
      },
      testMatch: /(mobile|navigation)\.spec/,
    },
  ],
  webServer: [
    {
      command: "node scripts/mock-endpoint.mjs",
      url: `http://127.0.0.1:${MOCK_PORT}/submissions`,
      env: { MOCK_PORT: String(MOCK_PORT), MOCK_DELAY_MS: "700" },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npx next start -p ${PORT}`,
      url: `http://127.0.0.1:${PORT}`,
      env: {
        CONTACT_WEBHOOK_URL: `http://127.0.0.1:${MOCK_PORT}/contact`,
        NEWSLETTER_WEBHOOK_URL: `http://127.0.0.1:${MOCK_PORT}/newsletter`,
      },
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
