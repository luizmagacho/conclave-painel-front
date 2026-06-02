import { describe, expect, it } from "vitest";
import { EMPTY_MESSAGES, TABLE_SCROLL_HEIGHT } from "./tableUi";

describe("tableUi constants", () => {
  it("defines scroll height", () => {
    expect(TABLE_SCROLL_HEIGHT).toBe("85vh");
  });

  it("defines empty messages", () => {
    expect(EMPTY_MESSAGES.obra).toContain("obra");
    expect(EMPTY_MESSAGES.material).toContain("material");
    expect(EMPTY_MESSAGES.custo).toContain("custo");
    expect(EMPTY_MESSAGES.pedido).toContain("pedido");
  });
});
