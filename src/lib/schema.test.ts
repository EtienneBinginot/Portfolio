// @vitest-environment node
// Tests purs (validation Zod) : pas besoin du DOM jsdom.
import { describe, expect, it } from "vitest";
import { ChartSchema, DataSchema, MetricSchema } from "./schema";
import type { Data } from "./schema";

const validMetric = {
  label: "latence endpoint legacy",
  value: "28",
  unit: "s",
  method: "mesure via New Relic sur 7 jours, moyenne p95",
  measuredAt: "2026-08-01",
};

describe("MetricSchema", () => {
  it("accepte une métrique avec method et measuredAt", () => {
    expect(MetricSchema.safeParse(validMetric).success).toBe(true);
  });

  it("rejette une métrique sans method", () => {
    const { method: _method, ...rest } = validMetric;
    expect(MetricSchema.safeParse(rest).success).toBe(false);
  });

  it("rejette une métrique sans measuredAt", () => {
    const { measuredAt: _measuredAt, ...rest } = validMetric;
    expect(MetricSchema.safeParse(rest).success).toBe(false);
  });

  it("rejette une method vide", () => {
    expect(MetricSchema.safeParse({ ...validMetric, method: "" }).success).toBe(
      false,
    );
  });
});

const validChart = {
  type: "bar-compare" as const,
  title: "avant / après",
  unit: "s",
  caption: "Source : New Relic — date de mesure : 2026-08-01",
  source: "New Relic",
  series: [{ name: "latence", points: [{ label: "avant", value: 30 }] }],
};

describe("ChartSchema", () => {
  it("accepte un chart sans scale et applique le défaut linear", () => {
    const result = ChartSchema.safeParse(validChart);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scale).toBe("linear");
    }
  });

  it("accepte scale: log avec des valeurs toutes positives", () => {
    const result = ChartSchema.safeParse({ ...validChart, scale: "log" });
    expect(result.success).toBe(true);
  });

  it("rejette scale: log avec un point <= 0", () => {
    const chart = {
      ...validChart,
      scale: "log" as const,
      series: [{ name: "latence", points: [{ label: "avant", value: 0 }] }],
    };
    const result = ChartSchema.safeParse(chart);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual([
        "series",
        0,
        "points",
        0,
        "value",
      ]);
    }
  });
});

function buildValidData(): Data {
  return {
    meta: {
      name: "Etienne Binginot",
      role: "Développeur",
      lane: "sécurité applicative",
      tagline: "accroche",
      email: "etienne.binginot@gmail.com",
      github: "https://github.com/EtienneBinginot",
      linkedin: "https://www.linkedin.com/in/etienne-binginot",
    },
    highlights: [
      {
        value: "28 s",
        label: "latence endpoint legacy",
        context: "30 min avant refonte",
        href: "/interventions/incident-legacy#resultat",
      },
    ],
    projects: [
      {
        id: "physigames",
        title: "PhysiGames",
        summary: "résumé",
        problem: "problème",
        decisions: "décisions",
        stack: ["Next.js"],
        featured: true,
        metrics: [validMetric],
      },
    ],
    cases: [
      {
        id: "incident-legacy",
        title: "Incident endpoint legacy",
        period: "2026",
        context: "contexte",
        constraints: "contraintes",
        scope: "infrastructure",
        myRole: "rôle",
        decisions: "décisions",
        featured: true,
        metrics: [validMetric],
      },
    ],
    skills: [
      { name: "TypeScript", category: "langage", evidence: "physigames" },
    ],
    chantiers: [],
    about: { bio: "bio", formation: [], interests: [], cvUrl: "/cv-fr.pdf" },
  };
}

describe("DataSchema — règle skills[].evidence", () => {
  it("accepte une evidence qui pointe vers un id de projet existant", () => {
    expect(DataSchema.safeParse(buildValidData()).success).toBe(true);
  });

  it("accepte une evidence qui pointe vers un id de cas existant", () => {
    const data = buildValidData();
    data.skills[0].evidence = "incident-legacy";
    expect(DataSchema.safeParse(data).success).toBe(true);
  });

  it("rejette une evidence qui ne correspond à aucun id", () => {
    const data = buildValidData();
    data.skills[0].evidence = "id-inexistant";
    const result = DataSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["skills", 0, "evidence"]);
    }
  });
});

describe("DataSchema — liens profonds des highlights", () => {
  it("rejette un href /projets/<id> vers un id inconnu", () => {
    const data = buildValidData();
    data.highlights[0].href = "/projets/id-inconnu#resultat";
    expect(DataSchema.safeParse(data).success).toBe(false);
  });

  it("accepte un href /projets/<id> vers un id connu", () => {
    const data = buildValidData();
    data.highlights[0].href = "/projets/physigames#resultat";
    expect(DataSchema.safeParse(data).success).toBe(true);
  });
});
