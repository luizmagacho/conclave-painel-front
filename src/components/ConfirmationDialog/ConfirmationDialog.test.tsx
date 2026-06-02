import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimeReactProvider } from "primereact/api";
import ConfirmationDialog from "./index";

describe("ConfirmationDialog", () => {
  it("renders sign-out trigger", () => {
    render(
      <PrimeReactProvider>
        <ConfirmationDialog
          message="Sair do sistema?"
          header="Logout"
          acceptLabel="Sim"
          rejectLabel="Não"
          onConfirm={vi.fn()}
        />
      </PrimeReactProvider>
    );

    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });
});
