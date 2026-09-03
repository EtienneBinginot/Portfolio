import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import SkillsList from "./SkillsList";
import type { Case, Project, Skill } from "@/lib/schema";

const project: Project = {
  id: "physigames",
  title: "PhysiGames",
  summary: "résumé",
  problem: "problème",
  decisions: "décisions",
  stack: ["Next.js"],
  featured: true,
  metrics: [],
};

const intervention: Case = {
  id: "incident-legacy",
  title: "Incident endpoint legacy",
  period: "2026",
  context: "contexte",
  constraints: "contraintes",
  scope: "infrastructure",
  myRole: "rôle",
  decisions: "décisions",
  featured: true,
  metrics: [],
};

function renderList(skills: Skill[]) {
  return render(
    <NextIntlClientProvider locale="fr" messages={{}}>
      <SkillsList skills={skills} projects={[project]} cases={[intervention]} />
    </NextIntlClientProvider>,
  );
}

describe("SkillsList", () => {
  it("affiche les compétences regroupées par catégorie, reliées à leur preuve", () => {
    renderList([
      { name: "TypeScript", category: "langage", evidence: "physigames" },
      {
        name: "Diagnostic incident",
        category: "infrastructure",
        evidence: "incident-legacy",
      },
    ]);

    expect(screen.getByText("langage")).toBeInTheDocument();
    expect(screen.getByText("infrastructure")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "TypeScript" })).toHaveAttribute(
      "href",
      "/fr/projets/physigames",
    );
    expect(
      screen.getByRole("link", { name: "Diagnostic incident" }),
    ).toHaveAttribute("href", "/fr/interventions/incident-legacy");
  });

  it("masque une compétence dont la preuve ne correspond à aucun id connu", () => {
    renderList([
      { name: "TypeScript", category: "langage", evidence: "physigames" },
      { name: "Fantôme", category: "langage", evidence: "id-inconnu" },
    ]);

    expect(
      screen.getByRole("link", { name: "TypeScript" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Fantôme")).not.toBeInTheDocument();
  });

  it("ne rend rien si aucune compétence n'a de preuve valide", () => {
    const { container } = renderList([
      { name: "Fantôme", category: "langage", evidence: "id-inconnu" },
    ]);

    expect(container).toBeEmptyDOMElement();
  });
});
