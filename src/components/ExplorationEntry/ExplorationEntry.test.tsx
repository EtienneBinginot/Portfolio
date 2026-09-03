import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import ExplorationEntry from "./ExplorationEntry";
import type { Exploration } from "@/lib/schema";

const exploration: Exploration = {
  id: "exemple-exploration",
  title: "Ancien projet d'entraînement",
  period: "2024",
  summary: "Ce que ça visait à apprendre.",
};

function renderEntry(overrides: Partial<Exploration> = {}) {
  return render(
    <NextIntlClientProvider locale="fr" messages={{}}>
      <ExplorationEntry exploration={{ ...exploration, ...overrides }} />
    </NextIntlClientProvider>,
  );
}

describe("ExplorationEntry", () => {
  it("affiche la période et le titre en en-tête, puis le résumé", () => {
    renderEntry();
    expect(screen.getByText(exploration.period)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: exploration.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(exploration.summary)).toBeInTheDocument();
  });

  it("pointe vers la fiche exploration", () => {
    renderEntry();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/fr/explorations/${exploration.id}`,
    );
  });

  it("affiche la première métrique quand elle existe", () => {
    renderEntry({
      metrics: [
        {
          label: "temps passé",
          value: "3",
          unit: "soirs",
          method: "estimation a posteriori",
          measuredAt: "2024-06-01",
        },
      ],
    });
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/temps passé/)).toBeInTheDocument();
  });

  it("n'affiche aucune métrique quand il n'y en a pas", () => {
    renderEntry();
    expect(screen.queryByText(/soirs/)).not.toBeInTheDocument();
  });
});
