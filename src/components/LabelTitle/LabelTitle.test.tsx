import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LabelTitle from "./index";

describe("LabelTitle", () => {
  it("renders label text", () => {
    render(
      <LabelTitle
        text="Nome"
        htmlFor="field-name"
        className="font-bold"
      />
    );
    const label = screen.getByText("Nome");
    expect(label).toHaveAttribute("for", "field-name");
    expect(label).toHaveClass("font-bold");
  });

  it("shows required marker when required", () => {
    render(
      <LabelTitle
        text="Campo"
        htmlFor="f"
        className=""
        required
      />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
