import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import MetricBlock from "./MetricBlock";

const metric = {
  value: "28",
  unit: "s",
  label: "latence endpoint legacy",
  method: "mesure via New Relic sur 7 jours, moyenne p95",
  measuredAt: "2026-08-01",
};

describe("MetricBlock", () => {
  it("affiche la valeur, l'unité, le label, la méthode et la date", () => {
    render(<MetricBlock {...metric} />);
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("s")).toBeInTheDocument();
    expect(screen.getByText(metric.label)).toBeInTheDocument();
    expect(
      screen.getByText(metric.method, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText(metric.measuredAt)).toBeInTheDocument();
  });

  it("n'affiche pas de span d'unité quand unit est absent", () => {
    const { container } = render(<MetricBlock {...metric} unit={undefined} />);
    expect(container.textContent).not.toContain("undefined");
    expect(screen.queryByText("s")).not.toBeInTheDocument();
  });

  it("transmet borderColor/fill/thick à PixelBorder", () => {
    const { container } = render(
      <MetricBlock
        {...metric}
        borderColor="var(--accent-cyan)"
        fill="var(--bg)"
        thick
      />,
    );
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.getPropertyValue("--pixel-border-color")).toBe(
      "var(--accent-cyan)",
    );
    expect(frame.style.getPropertyValue("--pixel-fill")).toBe("var(--bg)");
    expect(frame.style.getPropertyValue("--pixel-border-width")).toBe(
      "var(--border-width-thick)",
    );
  });
});
