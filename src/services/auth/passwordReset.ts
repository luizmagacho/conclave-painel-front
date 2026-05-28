import { getAPIClient } from "@/services/axios";

const api = getAPIClient();

/**
 * Step 1 — Request a password reset link.
 * Sends an email with a temporary token to the provided address.
 * Always resolves successfully to prevent email enumeration.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

/**
 * Step 2 — Consume the token and set a new password.
 * Throws an error if the token is invalid, already used, or expired.
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  await api.post("/auth/reset-password", { token, newPassword });
}
