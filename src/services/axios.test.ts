import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { getExternalClient } from "./axios";

describe("getExternalClient", () => {
  const createSpy = vi.spyOn(axios, "create");

  afterEach(() => {
    createSpy.mockReset();
  });

  it("creates axios instance with given baseURL", () => {
    const instance = {
      interceptors: { response: { use: vi.fn() } },
      defaults: { headers: { put: {} as Record<string, string> } },
    };
    createSpy.mockReturnValue(instance as never);

    const client = getExternalClient("https://example.com/api");

    expect(createSpy).toHaveBeenCalledWith({ baseURL: "https://example.com/api" });
    expect(client.defaults.headers.put["Content-Type"]).toBe("application/pdf");
    expect(instance.interceptors.response.use).toHaveBeenCalled();
  });
});
