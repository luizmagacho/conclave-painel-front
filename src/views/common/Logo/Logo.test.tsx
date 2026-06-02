import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimeReactProvider } from "primereact/api";
import Logo from "./index";

describe("Logo", () => {
  it("renders branded image with default home link", () => {
    render(
      <PrimeReactProvider>
        <Logo />
      </PrimeReactProvider>
    );

    const img = screen.getByAltText("Conclave logo");
    expect(img).toBeInTheDocument();
    expect(img.closest("a")).toHaveAttribute("href", "/home");
  });

  it("respects custom redirect href", () => {
    render(
      <PrimeReactProvider>
        <Logo redirect="/obras" />
      </PrimeReactProvider>
    );

    expect(screen.getByAltText("Conclave logo").closest("a")).toHaveAttribute(
      "href",
      "/obras"
    );
  });
});
