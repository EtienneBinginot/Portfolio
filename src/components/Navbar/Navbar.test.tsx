import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import messages from "@/messages/fr.json";

// next/link n'a pas besoin d'être mocké : sans AppRouterContext (absent
// sous jsdom), le composant réel se dégrade proprement en <a href> et
// transmet les props (dont aria-current) — voir
// node_modules/next/dist/client/app-dir/link.js. Seul usePathname n'a pas
// d'équivalent jsdom-safe et doit être mocké ; next-intl le lit via
// next/navigation en interne (voir useBasePathname), d'où le mock partagé
// dans __mocks__/next/navigation.ts plutôt qu'un mock de @/i18n/navigation.
vi.mock("next/navigation");

const { default: Navbar, NAV_ITEMS } = await import("./Navbar");

function renderNavbar() {
  return render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <Navbar />
    </NextIntlClientProvider>,
  );
}

describe("Navbar", () => {
  it("marque Accueil comme actif sur la route racine", () => {
    vi.mocked(usePathname).mockReturnValue("/fr");
    renderNavbar();
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Projets" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marque Projets comme actif sur une route imbriquée /projets/*", () => {
    vi.mocked(usePathname).mockReturnValue("/fr/projets/exemple-projet");
    renderNavbar();
    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Accueil" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("affiche toutes les entrées de navigation", () => {
    vi.mocked(usePathname).mockReturnValue("/fr");
    renderNavbar();
    for (const item of NAV_ITEMS) {
      expect(
        screen.getByRole("link", { name: messages.Navbar[item.key] }),
      ).toBeInTheDocument();
    }
  });
});
