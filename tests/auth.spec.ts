import { test, expect } from "@playwright/test";

test.describe("Authentication and Password Recovery Flow", () => {
  
  test("should render login page correctly and navigate to forgot password", async ({ page }) => {
    // Go to login page
    await page.goto("/");

    // Verify fields and brand logo exist
    await expect(page.locator("text=E-mail")).toBeVisible();
    await expect(page.locator("label:has-text('Senha')")).toBeVisible();
    await expect(page.locator("button:has-text('Acessar')")).toBeVisible();

    // Click "Esqueci a senha"
    const forgotPasswordLink = page.locator("#forgot-password");
    await expect(forgotPasswordLink).toBeVisible();
    await forgotPasswordLink.click();

    // Verify navigation to /forgot-password
    await expect(page).toHaveURL("/forgot-password");
    await expect(page.locator("text=Forgot Your Password?")).toBeVisible();
  });

  test("should show validation errors on forgot password page with invalid email", async ({ page }) => {
    await page.goto("/forgot-password");

    // Click send without email
    await page.click("#send-reset-link");
    await expect(page.locator("text=Please enter a valid email address.")).toBeVisible();

    // Fill invalid email
    await page.fill("#email", "invalidemail");
    await page.click("#send-reset-link");
    await expect(page.locator("text=Please enter a valid email address.")).toBeVisible();
  });

  test("should successfully submit forgot password form", async ({ page }) => {
    await page.goto("/forgot-password");

    // Fill valid email
    await page.fill("#email", "user@conclave.com.br");
    await page.click("#send-reset-link");

    // Success screen
    await expect(page.locator("text=If that email is registered, you'll receive a reset link shortly.")).toBeVisible();
    
    // Back to Login button
    const backBtn = page.locator("button:has-text('Back to Login')");
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL("/");
  });

  test("should show validations on reset password page", async ({ page }) => {
    // Go to reset password page with token
    await page.goto("/reset-password?token=mocked-token-xyz");

    await expect(page.locator("text=Set New Password")).toBeVisible();

    // Case 1: Mismatched passwords
    await page.fill("#newPassword", "securePassword123");
    await page.fill("#confirmPassword", "differentPassword123");
    await page.click("#reset-password-submit");

    await expect(page.locator("text=Passwords do not match.")).toBeVisible();

    // Case 2: Short password
    await page.fill("#newPassword", "123");
    await page.fill("#confirmPassword", "123");
    await page.click("#reset-password-submit");

    await expect(page.locator("text=Password must be at least 6 characters.")).toBeVisible();
  });
});
