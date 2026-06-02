import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PrimeReactProvider } from "primereact/api";
import CurrencyInput from "./index";

describe("CurrencyInput", () => {
  it("renders currency field and calculator toggle", () => {
    const onChange = vi.fn();

    render(
      <PrimeReactProvider>
        <CurrencyInput value={100} onChange={onChange} />
      </PrimeReactProvider>
    );

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(document.querySelector(".calculator-button")).toBeTruthy();
  });

  it("opens calculator dialog when clicking calculator", () => {
    const onChange = vi.fn();

    const { container } = render(
      <PrimeReactProvider>
        <CurrencyInput value={0} onChange={onChange} />
      </PrimeReactProvider>
    );

    const calcBtn = container.querySelector(".calculator-button");
    expect(calcBtn).toBeTruthy();
    fireEvent.click(calcBtn!);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
