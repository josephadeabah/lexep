import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("fires onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Go</Button>);
    fireEvent.click(screen.getByText("Go"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("renders as a link when href is provided", () => {
    render(<Button href="/dashboard">Dashboard</Button>);
    const link = screen.getByText("Dashboard").closest("a");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("respects the disabled state", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByText("Disabled"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
