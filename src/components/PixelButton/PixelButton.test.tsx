import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PixelButton from "./PixelButton";

describe("PixelButton", () => {
  it("affiche son contenu comme un vrai bouton", () => {
    render(<PixelButton>Action principale</PixelButton>);
    expect(
      screen.getByRole("button", { name: "Action principale" }),
    ).toBeInTheDocument();
  });

  it("porte la classe secondary en variant secondary", () => {
    render(<PixelButton variant="secondary">Secondaire</PixelButton>);
    const button = screen.getByRole("button", { name: "Secondaire" });
    expect(button.className).toContain("secondary");
  });

  it("ne porte pas la classe secondary par défaut (variant primary)", () => {
    render(<PixelButton>Principal</PixelButton>);
    const button = screen.getByRole("button", { name: "Principal" });
    expect(button.className).not.toContain("secondary");
  });

  it("transmet les props natives (disabled, onClick)", () => {
    const handleClick = vi.fn();
    render(
      <PixelButton onClick={handleClick} disabled>
        Désactivé
      </PixelButton>,
    );
    expect(screen.getByRole("button", { name: "Désactivé" })).toBeDisabled();
  });
});
