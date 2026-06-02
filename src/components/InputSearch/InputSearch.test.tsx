import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PrimeReactProvider } from "primereact/api";
import InputSearch from "./index";

describe("InputSearch", () => {
  it("calls onSearch and onChange when typing", () => {
    const onSearch = vi.fn();
    const onChange = vi.fn();

    render(
      <PrimeReactProvider>
        <InputSearch onSearch={onSearch} onChange={onChange} />
      </PrimeReactProvider>
    );

    const input = screen.getByPlaceholderText("Buscar");
    fireEvent.change(input, { target: { value: "abc" } });

    expect(onSearch).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });
});
