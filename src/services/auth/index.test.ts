import { beforeEach, describe, expect, it, vi } from "vitest";

const postMock = vi.hoisted(() => vi.fn());

vi.mock("../http", () => ({
  default: {
    post: postMock,
  },
}));

import { authenticate, login } from "./index";

describe("auth service", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it("login posts credentials and returns payload", async () => {
    postMock.mockResolvedValue({
      data: {
        id: "id-1",
        name: "Nome",
        username: "user",
        highestPriorityRole: "USER",
        token: "jwt",
      },
    });

    const out = await login({ username: "user", password: "secret" });

    expect(postMock).toHaveBeenCalledWith("/auth/login", {
      username: "user",
      password: "secret",
    });
    expect(out.token).toBe("jwt");
    expect(out.name).toBe("Nome");
  });

  it("authenticate posts email string to login route", async () => {
    postMock.mockResolvedValue({ data: { token: "t" } });

    await authenticate({ email: "a@example.com" });

    expect(postMock).toHaveBeenCalledWith("/auth/login", "a@example.com");
  });
});
