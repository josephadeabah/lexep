import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, formatTime, initials } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("supports conditional objects", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });
});

describe("formatCurrency", () => {
  it("formats USD with no decimals by default", () => {
    expect(formatCurrency(1500)).toBe("$1,500");
  });

  it("formats a different currency", () => {
    expect(formatCurrency(100, "GHS")).toContain("100");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string", () => {
    const result = formatDate("2026-03-15T00:00:00Z");
    expect(result).toContain("2026");
    expect(result).toContain("Mar");
  });
});

describe("formatTime", () => {
  it("formats a time string", () => {
    const result = formatTime("2026-03-15T14:30:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("initials", () => {
  it("returns initials for a full name", () => {
    expect(initials("Amina Diop")).toBe("AD");
  });

  it("caps at two initials for long names", () => {
    expect(initials("John James Doe Smith")).toBe("JJ");
  });

  it("handles a single name", () => {
    expect(initials("Cher")).toBe("C");
  });
});
