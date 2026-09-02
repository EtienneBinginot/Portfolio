import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildMdxComponents } from "./mdx-components";
import type { Project } from "@/lib/schema";

const baseProject: Project = {
  id: "exemple-projet",
  title: "Exemple",
  summary: "résumé",
  problem: "problème",
  decisions: "décisions",
  stack: ["Next.js"],
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
  chart: {
    type: "bar-compare",
    title: "avant / après",
    unit: "s",
    scale: "linear",
    caption: "Source : New Relic — date de mesure : 2026-08-01",
    source: "New Relic",
    series: [
      {
        name: "latence",
        points: [
          { label: "avant", value: 30 },
          { label: "après", value: 5 },
        ],
      },
    ],
  },
};

describe("buildMdxComponents", () => {
  it("InlineMetric rend MetricBlock pour un label connu", () => {
    const { InlineMetric } = buildMdxComponents(baseProject);
    render(<InlineMetric label="latence p95" />);
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText(/latence p95/)).toBeInTheDocument();
  });

  it("InlineMetric lève une erreur pour un label inconnu", () => {
    const { InlineMetric } = buildMdxComponents(baseProject);
    expect(() => render(<InlineMetric label="inconnu" />)).toThrow(
      /aucune métrique/,
    );
  });

  it("InlineChart rend Chart quand project.chart existe", () => {
    const { InlineChart } = buildMdxComponents(baseProject);
    render(<InlineChart />);
    expect(
      screen.getByRole("heading", { name: "avant / après" }),
    ).toBeInTheDocument();
  });

  it("InlineChart lève une erreur quand project.chart est absent", () => {
    const { InlineChart } = buildMdxComponents({
      ...baseProject,
      chart: undefined,
    });
    expect(() => render(<InlineChart />)).toThrow(/pas de chart/);
  });
});
