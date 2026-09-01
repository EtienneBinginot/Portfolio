import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Timeseries from "./Timeseries";
import type { Chart as ChartData } from "@/lib/schema";

function buildChart(overrides: Partial<ChartData> = {}): ChartData {
  return {
    type: "timeseries",
    title: "évolution",
    unit: "req/s",
    scale: "linear",
    caption: "caption",
    source: "source",
    series: [
      {
        name: "s1",
        points: [
          { label: "j0", value: 1 },
          { label: "j1", value: 5 },
          { label: "j2", value: 9 },
        ],
      },
    ],
    ...overrides,
  };
}

describe("Timeseries", () => {
  it("affiche un marqueur par point", () => {
    const { container } = render(<Timeseries chart={buildChart()} />);
    expect(container.querySelectorAll('rect[data-role="point"]')).toHaveLength(
      3,
    );
  });

  it("ne dessine que des segments horizontaux/verticaux (jamais de diagonale)", () => {
    const { container } = render(<Timeseries chart={buildChart()} />);
    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    const d = path?.getAttribute("d") ?? "";
    expect(d).not.toMatch(/[LCSQTA]/);
    expect(d).toMatch(/^M/);
  });

  it("éclaircit les labels au-delà de 6 points tout en gardant le dernier", () => {
    const points = Array.from({ length: 12 }, (_, i) => ({
      label: `j${i}`,
      value: i + 1,
    }));
    const chart = buildChart({ series: [{ name: "s1", points }] });
    const { container } = render(<Timeseries chart={chart} />);
    const texts = Array.from(container.querySelectorAll("text")).map(
      (el) => el.textContent,
    );
    const shownLabels = points
      .map((p) => p.label)
      .filter((label) => texts.includes(label));
    expect(shownLabels.length).toBeLessThan(points.length);
    expect(texts).toContain("j11");
  });

  it("compresse les écarts en échelle logarithmique", () => {
    const chart = buildChart({
      scale: "log",
      series: [
        {
          name: "s1",
          points: [
            { label: "a", value: 1 },
            { label: "b", value: 10 },
            { label: "c", value: 100 },
          ],
        },
      ],
    });
    const { container } = render(<Timeseries chart={chart} />);
    const markers = Array.from(
      container.querySelectorAll('rect[data-role="point"]'),
    );
    const ys = markers.map((el) => Number(el.getAttribute("y")));
    const gap1 = Math.abs(ys[0] - ys[1]);
    const gap2 = Math.abs(ys[1] - ys[2]);
    // Deux écarts d'un ordre de grandeur (1->10, 10->100) doivent produire
    // des écarts de pixels comparables — une échelle linéaire donnerait des
    // écarts très différents (9 vs 90 sur 100).
    expect(Math.abs(gap1 - gap2)).toBeLessThanOrEqual(8);
  });
});
