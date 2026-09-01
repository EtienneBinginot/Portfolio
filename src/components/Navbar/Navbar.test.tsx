import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// next/link n'a pas besoin d'être mocké : sans AppRouterContext (absent
// sous jsdom), le composant réel se dégrade proprement en <a href> et
// transmet les props (dont aria-current) — voir
// node_modules/next/dist/client/app-dir/link.js. Seul usePathname n'a pas
// d'équivalent jsdom-safe et doit être mocké.
const usePathname = vi.fn();
vi.mock("next/navigation", () => ({ usePathname: () => usePathname() }));

const { default: Navbar, NAV_ITEMS } = await import("./Navbar");

describe("Navbar", () => {
  it("marque Accueil comme actif sur la route racine", () => {
    usePathname.mockReturnValue("/");
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Projets" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marque Projets comme actif sur une route imbriquée /projets/*", () => {
    usePathname.mockReturnValue("/projets/exemple-projet");
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Accueil" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("affiche toutes les entrées de navigation", () => {
    usePathname.mockReturnValue("/");
    render(<Navbar />);
    for (const item of NAV_ITEMS) {
      expect(
        screen.getByRole("link", { name: item.label }),
      ).toBeInTheDocument();
    }
  });
});
