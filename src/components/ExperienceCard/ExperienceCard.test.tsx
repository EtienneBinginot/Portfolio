import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import ExperienceCard from "./ExperienceCard";
import type { Case } from "@/lib/schema";

const intervention: Case = {
  id: "exemple-intervention",
  title: "Incident en cascade",
  period: "2026",
  context: "placeholder",
  constraints: "placeholder",
  scope: "infrastructure",
  myRole: "Diagnostic et correctif en autonomie.",
  decisions: "placeholder",
  featured: true,
  metrics: [
    {
      label: "durée d'indisponibilité",
      value: "42",
      unit: "min",
      method: "logs de supervision",
      measuredAt: "2026-07-01",
    },
  ],
};

function renderCard() {
  return render(
    <NextIntlClientProvider locale="fr" messages={{}}>
      <ExperienceCard case={intervention} scopeLabel="Infrastructure" />
    </NextIntlClientProvider>,
  );
}

describe("ExperienceCard", () => {
  it("mène par le résultat mesuré et affiche le badge de contexte", () => {
    renderCard();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/durée d'indisponibilité/)).toBeInTheDocument();
    expect(screen.getByText("Infrastructure")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: intervention.title }),
    ).toBeInTheDocument();
  });

  it("pointe vers la fiche intervention", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/fr/interventions/${intervention.id}`,
    );
  });
});
