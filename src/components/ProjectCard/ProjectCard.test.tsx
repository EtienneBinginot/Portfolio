import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/schema";

const project: Project = {
  id: "exemple-projet",
  title: "Refonte endpoint legacy",
  summary: "Migration progressive sans interruption de service.",
  problem: "placeholder",
  decisions: "placeholder",
  stack: ["Next.js", "TypeScript"],
  featured: true,
  metrics: [
    {
      label: "latence p95",
      value: "28",
      unit: "s",
      method: "New Relic, moyenne 7 jours",
      measuredAt: "2026-08-01",
    },
  ],
};

function renderCard() {
  return render(
    <NextIntlClientProvider locale="fr" messages={{}}>
      <ProjectCard project={project} />
    </NextIntlClientProvider>,
  );
}

describe("ProjectCard", () => {
  it("mène par le résultat mesuré avant le titre", () => {
    renderCard();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("s")).toBeInTheDocument();
    expect(screen.getByText(/latence p95/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: project.title }),
    ).toBeInTheDocument();
  });

  it("affiche la stack en métadonnée, pas en titre", () => {
    renderCard();
    expect(
      screen.getByRole("heading", { name: project.title }),
    ).not.toHaveTextContent("Next.js");
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("pointe vers la fiche projet", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/fr/projets/${project.id}`,
    );
  });
});
