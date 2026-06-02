import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Calculator from "./index";

describe("Calculator", () => {
  it("appends digits to display", () => {
    const setValue = vi.fn();
    const onClose = vi.fn();

    render(<Calculator value={0} setValue={setValue} onClose={onClose} />);

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("2"));

    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
