import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  it("affiche un span statique par défaut", () => {
    render(<Badge>Infrastructure</Badge>);
    const badge = screen.getByText("Infrastructure");
    expect(badge.tagName).toBe("SPAN");
  });

  it("affiche un bouton avec aria-pressed reflétant l'état actif", () => {
    render(
      <Badge as="button" active>
        Mission client
      </Badge>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("déclenche onClick au clic", () => {
    const onClick = vi.fn();
    render(
      <Badge as="button" onClick={onClick}>
        Produit
      </Badge>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
