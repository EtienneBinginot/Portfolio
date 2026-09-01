import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Distribution from "./Distribution";
import type { Chart as ChartData } from "@/lib/schema";

function buildChart(pointCount: number): ChartData {
  const points = Array.from({ length: pointCount }, (_, i) => ({
    label: `bucket-${i}`,
    value: i + 1,
  }));
  return {
    type: "distribution",
    title: "distribution",
    unit: "ms",
    scale: "linear",
    caption: "caption",
    source: "source",
    series: [{ name: "s1", points }],
  };
}

describe("Distribution", () => {
  it("affiche une barre par bucket", () => {
    const { container } = render(<Distribution chart={buildChart(5)} />);
    expect(container.querySelectorAll('rect[data-role="bar"]')).toHaveLength(5);
  });

  it("affiche les annotations de valeur quand il y a <= 8 buckets", () => {
    const { container } = render(<Distribution chart={buildChart(5)} />);
    const valueLabels = Array.from(
      container.querySelectorAll('[class*="valueLabel"]'),
    ).map((el) => el.textContent);
    expect(valueLabels).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("masque les annotations de valeur au-delà de 8 buckets", () => {
    const chart = buildChart(10);
    const { container } = render(<Distribution chart={chart} />);
    const valueLabels = container.querySelectorAll(`[class*="valueLabel"]`);
    expect(valueLabels).toHaveLength(0);
  });

  it("affiche les labels de bucket", () => {
    render(<Distribution chart={buildChart(5)} />);
    expect(screen.getByText("bucket-0")).toBeInTheDocument();
  });
});
