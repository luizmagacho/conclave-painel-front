import { describe, expect, it } from "vitest";
import { handleValidationErrors } from "./errorsHandler";

describe("handleValidationErrors", () => {
  it("merges keys from a single error object", () => {
    expect(handleValidationErrors([{ email: "inválido" }])).toEqual({
      email: "inválido",
    });
  });

  it("merges keys from multiple objects", () => {
    expect(
      handleValidationErrors([
        { email: "bad" },
        { password: "short" },
      ])
    ).toEqual({ email: "bad", password: "short" });
  });

  it("later keys overwrite earlier ones", () => {
    expect(
      handleValidationErrors([{ x: "1" }, { x: "2" }])
    ).toEqual({ x: "2" });
  });
});
