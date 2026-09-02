import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import HighlightTile from "./HighlightTile";

const highlight = {
  value: "28s",
  label: "latence endpoint legacy",
  context: "avant/après refonte, mesuré sur 7 jours",
  href: "/projets/exemple-projet#resultat",
};

function renderTile() {
  return render(
    <NextIntlClientProvider locale="fr" messages={{}}>
      <HighlightTile {...highlight} />
    </NextIntlClientProvider>,
  );
}

describe("HighlightTile", () => {
  it("affiche la valeur, le label et le contexte", () => {
    renderTile();
    expect(screen.getByText(highlight.value)).toBeInTheDocument();
    expect(screen.getByText(highlight.label)).toBeInTheDocument();
    expect(screen.getByText(highlight.context)).toBeInTheDocument();
  });

  it("pointe vers l'ancre exacte de la fiche justificative", () => {
    renderTile();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/fr${highlight.href}`,
    );
  });
});
