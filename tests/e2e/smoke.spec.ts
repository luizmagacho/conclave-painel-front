import { expect, test } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Conclave/i);
});

test("unauthenticated visit to /home redirects to login", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/home");
  const url = new URL(page.url());
  expect(url.pathname).toBe("/");
  expect(url.searchParams.get("redirect")).toBe("/home");
});
