import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { PrimeReactProvider } from "primereact/api";
import PhoneInput from "./index";

describe("PhoneInput", () => {
  it("renders masked input wired to setFieldValue", () => {
    const setFieldValue = vi.fn();

    const { container } = render(
      <PrimeReactProvider>
        <PhoneInput
          name="phone"
          placeholder="Tel"
          setFieldValue={setFieldValue}
          value=""
        />
      </PrimeReactProvider>
    );

    const input = container.querySelector("input");
    expect(input).toBeTruthy();
    fireEvent.input(input!, { target: { value: "11999998888" } });
    expect(setFieldValue).toHaveBeenCalled();
  });
});
