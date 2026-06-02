import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimeReactProvider } from "primereact/api";
import DeleteDialog from "./index";

describe("DeleteDialog", () => {
  it("shows message and action labels when visible", () => {
    const onHide = vi.fn();
    const onDelete = vi.fn();

    render(
      <PrimeReactProvider>
        <DeleteDialog
          message="Confirma exclusão?"
          header="Excluir"
          acceptLabel="Excluir"
          rejectLabel="Cancelar"
          visible
          onHide={onHide}
          onDelete={onDelete}
        />
      </PrimeReactProvider>
    );

    expect(screen.getByText("Confirma exclusão?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Excluir" })).toBeInTheDocument();
  });
});
