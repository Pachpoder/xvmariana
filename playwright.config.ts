import { defineConfig } from "@playwright/test";

const enabled = process.env.E2E_TESTS === "true";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const port = new URL(baseURL).port || "3000";
const webServerCommand = process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? `npm run dev -- --port ${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL, trace: "on-first-retry" },
  webServer: enabled ? { command: webServerCommand, url: baseURL, reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "true" } : undefined,
});
