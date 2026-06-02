import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimeReactProvider } from "primereact/api";
import {
  MaterialContext,
  type MaterialContextProps,
} from "@/context/MaterialContext";
import type { Material } from "@/services/material/type";
import MaterialAccordion from "./index";

const mat: Material = {
  id: "m1",
  name: "Areia",
  observation: "",
  unit: "m³",
  enabled: true,
};

function createMaterialContext(
  overrides: Partial<MaterialContextProps> = {}
): MaterialContextProps {
  return {
    materials: [],
    allMaterials: [mat],
    loading: false,
    totalElements: 1,
    handleGetMaterials: vi.fn(),
    handleGetAllMaterials: vi.fn().mockResolvedValue(undefined),
    handlePostMaterial: vi.fn(),
    handleUpdateMaterial: vi.fn(),
    ...overrides,
  };
}

describe("MaterialAccordion", () => {
  it("renders add-material control", () => {
    const setList = vi.fn();

    render(
      <PrimeReactProvider>
        <MaterialContext.Provider value={createMaterialContext()}>
          <MaterialAccordion
            listMaterialsPurchase={[]}
            setListMaterialsPurchase={setList}
          />
        </MaterialContext.Provider>
      </PrimeReactProvider>
    );

    expect(
      screen.getByRole("button", { name: /Adicionar Material/i })
    ).toBeInTheDocument();
  });
});
