import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Chart from "./Chart";
import type { Chart as ChartData } from "@/lib/schema";

const barChart: ChartData = {
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
};

describe("Chart", () => {
  it("affiche le titre et la légende (caption + source)", () => {
    render(<Chart chart={barChart} />);
    expect(
      screen.getByRole("heading", { name: "avant / après" }),
    ).toBeInTheDocument();
    expect(screen.getByText(barChart.caption)).toBeInTheDocument();
    expect(screen.getByText("— Source : New Relic")).toBeInTheDocument();
  });

  it("n'affiche pas le badge d'échelle log par défaut (linear)", () => {
    render(<Chart chart={barChart} />);
    expect(screen.queryByText("échelle logarithmique")).not.toBeInTheDocument();
  });

  it("affiche le badge d'échelle log quand scale vaut log", () => {
    render(<Chart chart={{ ...barChart, scale: "log" }} />);
    expect(screen.getByText("échelle logarithmique")).toBeInTheDocument();
  });

  it.each([
    ["bar-compare", barChart],
    [
      "timeseries",
      {
        ...barChart,
        type: "timeseries" as const,
        series: [{ name: "s1", points: [{ label: "j1", value: 10 }] }],
      },
    ],
    [
      "distribution",
      {
        ...barChart,
        type: "distribution" as const,
        series: [{ name: "s1", points: [{ label: "0-10", value: 4 }] }],
      },
    ],
  ])("pose data-chart-type=%s pour le bon type", (type, chart) => {
    const { container } = render(<Chart chart={chart as ChartData} />);
    expect(
      container.querySelector(`[data-chart-type="${type}"]`),
    ).toBeInTheDocument();
  });
});
