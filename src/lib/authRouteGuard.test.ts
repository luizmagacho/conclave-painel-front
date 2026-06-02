import { describe, expect, it } from "vitest";
import { authRouteGuard } from "./authRouteGuard";

const BASE = "http://127.0.0.1:3000";

describe("authRouteGuard", () => {
  it("passes through static asset paths", () => {
    expect(
      authRouteGuard({
        pathname: "/Logo_conclave.png",
        token: undefined,
        requestUrl: `${BASE}/Logo_conclave.png`,
      })
    ).toEqual({ kind: "passthrough" });
  });

  it("redirects authenticated user from / to /home", () => {
    const r = authRouteGuard({
      pathname: "/",
      token: "abc",
      requestUrl: `${BASE}/`,
    });
    expect(r.kind).toBe("redirect");
    if (r.kind === "redirect") {
      expect(r.url).toBe(`${BASE}/home`);
    }
  });

  it("allows unauthenticated /", () => {
    expect(
      authRouteGuard({
        pathname: "/",
        token: undefined,
        requestUrl: `${BASE}/`,
      })
    ).toEqual({ kind: "passthrough" });
  });

  it("redirects unauthenticated protected route to login with redirect param", () => {
    const r = authRouteGuard({
      pathname: "/obras",
      token: undefined,
      requestUrl: `${BASE}/obras`,
    });
    expect(r.kind).toBe("redirect");
    if (r.kind === "redirect") {
      const u = new URL(r.url);
      expect(u.pathname).toBe("/");
      expect(u.searchParams.get("redirect")).toBe("/obras");
    }
  });

  it("allows authenticated protected route", () => {
    expect(
      authRouteGuard({
        pathname: "/obras",
        token: "t",
        requestUrl: `${BASE}/obras`,
      })
    ).toEqual({ kind: "passthrough" });
  });
});
