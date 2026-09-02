import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import frMessages from "@/messages/fr.json";
import enMessages from "@/messages/en.json";

// Footer est un composant serveur async ; testable directement (voir
// `renderFooter` ci-dessous) car il n'utilise que des primitives next-intl
// simples (pas de <Suspense> ni de flux RSC réel). next-intl/server lit son
// contexte via l'AsyncLocalStorage posée par le vrai serveur Next.js, absente
// sous Vitest : on mocke donc directement getLocale/getTranslations/getFormatter
// plutôt que de tenter de simuler cette requête.
type Messages = typeof frMessages;

const state: { locale: "fr" | "en"; messages: Messages } = {
  locale: "fr",
  messages: frMessages,
};

vi.mock("next-intl/server", () => ({
  getLocale: async () => state.locale,
  getTranslations: async (namespace: string) => {
    const bundle = state.messages[namespace as keyof Messages] as Record<
      string,
      string
    >;
    return (key: string, values?: Record<string, string>) => {
      const template = bundle[key];
      return values
        ? template.replace(/\{(\w+)\}/g, (_, name) => values[name])
        : template;
    };
  },
  getFormatter: async () => ({
    dateTime: (value: Date, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(
        state.locale === "fr" ? "fr-FR" : "en-US",
        options,
      ).format(value),
  }),
}));

const { default: Footer } = await import("./Footer");

async function renderFooter(locale: "fr" | "en") {
  state.locale = locale;
  state.messages = locale === "fr" ? frMessages : enMessages;
  render(await Footer());
}

describe("Footer", () => {
  it("affiche les liens contact, GitHub et LinkedIn", async () => {
    await renderFooter("fr");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("affiche une mention de dernière mise à jour", async () => {
    await renderFooter("fr");
    expect(screen.getByText(/Mise à jour/)).toBeInTheDocument();
  });

  it("affiche la mise à jour en anglais quand la locale est en", async () => {
    await renderFooter("en");
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
  });
});
