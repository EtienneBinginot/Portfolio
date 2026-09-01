import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PixelBorder from "./PixelBorder";

describe("PixelBorder", () => {
  it("affiche ses enfants", () => {
    render(
      <PixelBorder>
        <span>28 s</span>
      </PixelBorder>,
    );
    expect(screen.getByText("28 s")).toBeInTheDocument();
  });

  it("ne pose aucune variable CSS custom par défaut", () => {
    const { container } = render(<PixelBorder>contenu</PixelBorder>);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.getPropertyValue("--pixel-border-color")).toBe("");
    expect(frame.style.getPropertyValue("--pixel-fill")).toBe("");
  });

  it("expose borderColor/fill en variables CSS custom", () => {
    const { container } = render(
      <PixelBorder borderColor="var(--accent-cyan)" fill="var(--bg)">
        contenu
      </PixelBorder>,
    );
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.getPropertyValue("--pixel-border-color")).toBe(
      "var(--accent-cyan)",
    );
    expect(frame.style.getPropertyValue("--pixel-fill")).toBe("var(--bg)");
  });

  it("pose --pixel-border-width sur var(--border-width-thick) quand thick", () => {
    const { container } = render(<PixelBorder thick>contenu</PixelBorder>);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.getPropertyValue("--pixel-border-width")).toBe(
      "var(--border-width-thick)",
    );
  });
});
