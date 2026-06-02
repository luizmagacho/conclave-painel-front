import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: function MockImage({
    alt,
    src,
    ...rest
  }: {
    alt: string;
    src: unknown;
    width?: number;
  }) {
    return React.createElement("img", {
      alt,
      "data-testid": "next-image",
      src: typeof src === "string" ? src : "mock-static",
      ...rest,
    });
  },
}));

vi.mock("next/link", () => ({
  default: function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return React.createElement("a", { href }, children);
  },
}));
