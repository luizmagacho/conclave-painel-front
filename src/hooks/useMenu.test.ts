import { describe, expect, it } from "vitest";
import type { MenuItem } from "primereact/menuitem";
import { filterMenuItemsByRole } from "./useMenu";

const sampleItems: MenuItem[] = [
  { label: "Material", icon: "pi pi-box" },
  { label: "Contas a Pagar", icon: "pi pi-money-bill" },
];

describe("filterMenuItemsByRole", () => {
  it("returns all items for non-Assistente roles", () => {
    expect(filterMenuItemsByRole(sampleItems, "Administrador")).toEqual(
      sampleItems
    );
  });

  it("removes Contas a Pagar for Assistente", () => {
    const out = filterMenuItemsByRole(sampleItems, "Assistente");
    expect(out.map((i) => i.label)).toEqual(["Material"]);
  });
});
