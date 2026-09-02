import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import InterventionsFilter from "./InterventionsFilter";
import type { Case } from "@/lib/schema";

const cases: Case[] = [
  {
    id: "cas-mission",
    title: "Cas mission",
    period: "2026",
    context: "placeholder",
    constraints: "placeholder",
    scope: "mission",
    myRole: "placeholder",
    decisions: "placeholder",
    featured: true,
    metrics: [],
  },
  {
    id: "cas-infra",
    title: "Cas infrastructure",
    period: "2026",
    context: "placeholder",
    constraints: "placeholder",
    scope: "infrastructure",
    myRole: "placeholder",
    decisions: "placeholder",
    featured: true,
    metrics: [],
  },
];

const scopeLabels = {
  mission: "Mission client",
  infrastructure: "Infrastructure",
  produit: "Produit",
};

function renderFilter() {
  return render(
    <NextIntlClientProvider locale="fr" messages={{}}>
      <InterventionsFilter
        cases={cases}
        scopes={["mission", "infrastructure", "produit"]}
        scopeLabels={scopeLabels}
        allLabel="Tous"
        groupLabel="Filtrer par domaine"
        noResultsLabel="Aucun cas pour ce filtre."
      />
    </NextIntlClientProvider>,
  );
}

describe("InterventionsFilter", () => {
  it("affiche tous les cas initialement", () => {
    renderFilter();
    expect(
      screen.getByRole("heading", { name: "Cas mission" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cas infrastructure" }),
    ).toBeInTheDocument();
  });

  it("filtre par domaine au clic sur un badge", () => {
    renderFilter();
    fireEvent.click(screen.getByRole("button", { name: "Mission client" }));
    expect(
      screen.getByRole("heading", { name: "Cas mission" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Cas infrastructure" }),
    ).not.toBeInTheDocument();
  });

  it("revient à la liste complète avec le filtre 'Tous'", () => {
    renderFilter();
    fireEvent.click(screen.getByRole("button", { name: "Mission client" }));
    fireEvent.click(screen.getByRole("button", { name: "Tous" }));
    expect(
      screen.getByRole("heading", { name: "Cas mission" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cas infrastructure" }),
    ).toBeInTheDocument();
  });

  it("affiche le message vide quand aucun cas ne correspond", () => {
    renderFilter();
    fireEvent.click(screen.getByRole("button", { name: "Produit" }));
    expect(screen.getByText("Aucun cas pour ce filtre.")).toBeInTheDocument();
  });
});
