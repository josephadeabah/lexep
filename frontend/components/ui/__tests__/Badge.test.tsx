import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders a dot indicator when requested", () => {
    const { container } = render(<Badge dot>Pending</Badge>);
    expect(container.querySelector("span > span")).toBeTruthy();
  });
});
