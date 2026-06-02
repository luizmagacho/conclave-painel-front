/**
 * Detects API responses that should trigger client logout.
 * Kept in a separate module for unit tests without axios.
 */
export function isAccessDeniedUnauthorized(error: unknown): boolean {
  const response = (
    error as {
      response?: {
        status?: number;
        data?: { statusCode?: number; message?: string };
      };
    }
  )?.response;
  if (!response || response.data?.message !== "Acesso Negado") {
    return false;
  }
  return response.status === 401 || response.data?.statusCode === 401;
}
