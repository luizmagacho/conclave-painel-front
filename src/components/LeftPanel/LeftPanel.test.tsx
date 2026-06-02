import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import LeftPanel from "./index";
import { renderWithProviders } from "@/test/renderWithProviders";

describe("LeftPanel", () => {
  it("renders children and logout control", () => {
    const logout = vi.fn();

    renderWithProviders(
      <LeftPanel>
        <div>Child content</div>
      </LeftPanel>,
      { auth: { logout } }
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });
});
