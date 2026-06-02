const STATIC_EXT = /\.(ico|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|eot)$/i;

export type AuthRouteResult =
  | { kind: "passthrough" }
  | { kind: "redirect"; url: string };

/**
 * Pure routing rules shared with middleware tests.
 */
export function authRouteGuard(input: {
  pathname: string;
  token: string | undefined;
  requestUrl: string;
}): AuthRouteResult {
  const { pathname, token, requestUrl } = input;

  if (STATIC_EXT.test(pathname)) {
    return { kind: "passthrough" };
  }

  if (pathname === "/") {
    if (token) {
      return {
        kind: "redirect",
        url: new URL("/home", requestUrl).toString(),
      };
    }
    return { kind: "passthrough" };
  }

  if (!token) {
    const login = new URL("/", requestUrl);
    login.searchParams.set("redirect", pathname);
    return { kind: "redirect", url: login.toString() };
  }

  return { kind: "passthrough" };
}
