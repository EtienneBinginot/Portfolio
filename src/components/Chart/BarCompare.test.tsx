import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BarCompare from "./BarCompare";
import type { Chart as ChartData } from "@/lib/schema";

const chart: ChartData = {
  type: "bar-compare",
  title: "avant / après",
  unit: "s",
  scale: "linear",
  caption: "caption",
  source: "source",
  series: [
    {
      name: "endpoint A",
      points: [
        { label: "avant", value: 30 },
        { label: "après", value: 5 },
      ],
    },
    {
      name: "endpoint B",
      points: [
        { label: "avant", value: 20 },
        { label: "après", value: 4 },
      ],
    },
  ],
};

describe("BarCompare", () => {
  it("affiche une barre par point, tous groupes confondus", () => {
    const { container } = render(<BarCompare chart={chart} />);
    const bars = container.querySelectorAll('rect[data-role="bar"]');
    const totalPoints = chart.series.reduce(
      (sum, s) => sum + s.points.length,
      0,
    );
    expect(bars).toHaveLength(totalPoints);
  });

  it("annote chaque barre avec la valeur du point", () => {
    render(<BarCompare chart={chart} />);
    expect(screen.getByText("30 s")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("affiche un label de groupe par série", () => {
    render(<BarCompare chart={chart} />);
    expect(screen.getByText("endpoint A")).toBeInTheDocument();
    expect(screen.getByText("endpoint B")).toBeInTheDocument();
  });

  it("affiche la légende avec les labels de points", () => {
    render(<BarCompare chart={chart} />);
    expect(screen.getByText("avant")).toBeInTheDocument();
    expect(screen.getByText("après")).toBeInTheDocument();
  });
});
