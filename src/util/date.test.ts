import { describe, expect, it } from "vitest";
import {
  convertOrderTimeToDate,
  convertStringToDate,
  formatDateToHHMM,
  formatDateToYYYYMMDD,
  formatarDataBR,
  getMonthInPortuguese,
  getMonthNames,
  getMonthsNames,
  getPreviousYears,
  parseHHMMToDate,
} from "@/util/date";

describe("formatDateToYYYYMMDD", () => {
  it("returns null for null input", () => {
    expect(formatDateToYYYYMMDD(null)).toBeNull();
  });

  it("formats date in local calendar components", () => {
    const d = new Date(2026, 3, 14);
    expect(formatDateToYYYYMMDD(d)).toBe("2026-04-14");
  });
});

describe("parseHHMMToDate", () => {
  it("returns null for empty string", () => {
    expect(parseHHMMToDate("")).toBeNull();
  });

  it("returns null for invalid format", () => {
    expect(parseHHMMToDate("99:99")).toBeNull();
  });

  it("parses valid HH:MM", () => {
    const d = parseHHMMToDate("14:30");
    expect(d).not.toBeNull();
    expect(d!.getHours()).toBe(14);
    expect(d!.getMinutes()).toBe(30);
  });
});

describe("convertStringToDate", () => {
  it("returns null for empty string", () => {
    expect(convertStringToDate("")).toBeNull();
  });

  it("parses ISO string to a Date instance", () => {
    const d = convertStringToDate("2026-01-15T12:00:00.000Z");
    expect(d).toBeInstanceOf(Date);
  });
});

describe("convertOrderTimeToDate", () => {
  it("throws on invalid format", () => {
    expect(() => convertOrderTimeToDate("9:05")).toThrow(
      "Formato de hora inválido"
    );
  });

  it("parses HH:MM", () => {
    const d = convertOrderTimeToDate("09:15");
    expect(d.getHours()).toBe(9);
    expect(d.getMinutes()).toBe(15);
  });
});

describe("formatDateToHHMM", () => {
  it("returns null for null", () => {
    expect(formatDateToHHMM(null)).toBeNull();
  });

  it("returns ISO-like local string", () => {
    const s = formatDateToHHMM(new Date(2026, 0, 2, 8, 5, 0));
    expect(s).toMatch(/^2026-01-02T08:05:00Z$/);
  });
});

describe("getMonthNames", () => {
  it("returns Portuguese month name", () => {
    expect(getMonthNames(0)).toBe("Janeiro");
    expect(getMonthNames(11)).toBe("Dezembro");
  });
});

describe("getMonthsNames", () => {
  it("returns array with empty first slot", () => {
    const m = getMonthsNames();
    expect(m[0]).toBe("");
    expect(m[1]).toBe("Janeiro");
  });
});

describe("getPreviousYears", () => {
  it("includes current year and spans 51 entries", () => {
    const y = new Date().getFullYear();
    const years = getPreviousYears();
    expect(years[0]).toBe(y);
    expect(years).toHaveLength(51);
    expect(years[years.length - 1]).toBe(y - 50);
  });
});

describe("getMonthInPortuguese", () => {
  it("returns empty for falsy input", () => {
    expect(getMonthInPortuguese(null)).toBe("");
    expect(getMonthInPortuguese("")).toBe("");
  });

  it("returns a non-empty month label for valid ISO date", () => {
    const m = getMonthInPortuguese("2026-06-15T12:00:00.000Z");
    expect(m.trim().length).toBeGreaterThan(2);
  });
});

describe("formatarDataBR", () => {
  it("formats as DD/MM/YYYY", () => {
    expect(formatarDataBR(new Date(2026, 0, 5))).toBe("05/01/2026");
  });
});
