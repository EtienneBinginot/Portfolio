// @vitest-environment node
// Tests purs (maths de mise à l'échelle) : pas besoin du DOM jsdom.
import { describe, expect, it } from "vitest";
import { buildScale, describeChart, labelStep, quantize } from "./scale";
import type { Chart as ChartData } from "@/lib/schema";

describe("quantize", () => {
  it("arrondit au multiple de 4 le plus proche", () => {
    expect(quantize(5)).toBe(4);
    expect(quantize(6)).toBe(8);
    expect(quantize(0)).toBe(0);
  });

  it("gère les valeurs négatives", () => {
    expect(quantize(-5)).toBe(-4);
  });

  it("accepte une unité de grille personnalisée", () => {
    expect(quantize(12, 10)).toBe(10);
  });
});

describe("buildScale — linear", () => {
  it("est strictement proportionnelle", () => {
    const scale = buildScale("linear", 100, 200);
    expect(scale(100)).toBe(200);
    expect(scale(50)).toBe(100);
    expect(scale(0)).toBe(0);
  });

  it("renvoie 0 partout quand domainMax vaut 0", () => {
    const scale = buildScale("linear", 0, 200);
    expect(scale(0)).toBe(0);
  });
});

describe("buildScale — log", () => {
  it("est monotone croissante", () => {
    const scale = buildScale("log", 1000, 300);
    expect(scale(1)).toBeLessThan(scale(10));
    expect(scale(10)).toBeLessThan(scale(100));
    expect(scale(100)).toBeLessThan(scale(1000));
  });

  it("compresse les écarts : deux facteurs 10 produisent des écarts de pixels comparables", () => {
    const scale = buildScale("log", 1000, 300);
    const step1 = scale(100) - scale(10);
    const step2 = scale(1000) - scale(100);
    expect(Math.abs(step1 - step2)).toBeLessThan(1);
  });

  it("n'est pas proportionnelle comme une échelle linéaire le serait", () => {
    const log = buildScale("log", 600, 300);
    const linear = buildScale("linear", 600, 300);
    // 2 -> 600 : le ratio linéaire (300x) et le ratio log ne coïncident pas.
    const ratioLinear = linear(600) / linear(2);
    const ratioLog = log(600) / log(2);
    expect(ratioLog).toBeLessThan(ratioLinear);
  });
});

describe("labelStep", () => {
  it("renvoie 1 quand count <= maxLabels", () => {
    expect(labelStep(5, 6)).toBe(1);
    expect(labelStep(6, 6)).toBe(1);
  });

  it("renvoie un pas qui ramène le nombre affiché sous maxLabels", () => {
    const count = 20;
    const step = labelStep(count, 6);
    expect(Math.ceil(count / step)).toBeLessThanOrEqual(6);
    expect(step).toBeGreaterThan(1);
  });
});

describe("describeChart", () => {
  it("liste chaque point avec son label, sa valeur et l'unité", () => {
    const chart: ChartData = {
      type: "bar-compare",
      title: "titre",
      unit: "s",
      scale: "linear",
      caption: "caption",
      source: "source",
      series: [{ name: "s1", points: [{ label: "avant", value: 30 }] }],
    };
    expect(describeChart(chart)).toBe("avant : 30 s");
  });
});
