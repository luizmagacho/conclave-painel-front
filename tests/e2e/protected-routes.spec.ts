import { expect, test } from "@playwright/test";

const protectedPaths = ["/home", "/obras", "/material", "/usuarios"];

for (const path of protectedPaths) {
  test(`guest is redirected from ${path} to login`, async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(path);
    const url = new URL(page.url());
    expect(url.pathname).toBe("/");
    expect(url.searchParams.get("redirect")).toBe(path);
  });
}
