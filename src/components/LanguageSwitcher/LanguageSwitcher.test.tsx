import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import messages from "@/messages/fr.json";

// Voir Navbar.test.tsx : next-intl lit usePathname via next/navigation en
// interne (useBasePathname), d'où le mock partagé dans
// __mocks__/next/navigation.ts plutôt qu'un mock de @/i18n/navigation.
vi.mock("next/navigation");

const { default: LanguageSwitcher } = await import("./LanguageSwitcher");

function renderSwitcher(locale: "fr" | "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  );
}

describe("LanguageSwitcher", () => {
  it("affiche un lien pour chaque locale et marque la locale active", () => {
    vi.mocked(usePathname).mockReturnValue("/fr/projets/exemple-projet");
    renderSwitcher("fr");

    const fr = screen.getByRole("link", { name: "Français" });
    const en = screen.getByRole("link", { name: "English" });

    expect(fr).toHaveAttribute("aria-current", "true");
    expect(en).not.toHaveAttribute("aria-current");
  });

  it("conserve le chemin courant en changeant de locale", () => {
    vi.mocked(usePathname).mockReturnValue("/fr/projets/exemple-projet");
    renderSwitcher("fr");

    const en = screen.getByRole("link", { name: "English" });
    expect(en).toHaveAttribute("href", "/en/projets/exemple-projet");
  });
});
