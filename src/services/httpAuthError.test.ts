import { describe, expect, it } from "vitest";
import { isAccessDeniedUnauthorized } from "./httpAuthError";

describe("isAccessDeniedUnauthorized", () => {
  it("returns false when message is not Acesso Negado", () => {
    expect(
      isAccessDeniedUnauthorized({
        response: { status: 401, data: { message: "Other" } },
      })
    ).toBe(false);
  });

  it("returns true for status 401 and Acesso Negado", () => {
    expect(
      isAccessDeniedUnauthorized({
        response: { status: 401, data: { message: "Acesso Negado" } },
      })
    ).toBe(true);
  });

  it("returns true for data.statusCode 401 and Acesso Negado", () => {
    expect(
      isAccessDeniedUnauthorized({
        response: {
          status: 200,
          data: { statusCode: 401, message: "Acesso Negado" },
        },
      })
    ).toBe(true);
  });

  it("returns false when no response", () => {
    expect(isAccessDeniedUnauthorized({})).toBe(false);
  });
});
