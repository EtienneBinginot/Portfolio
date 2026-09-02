import { describe, expect, it } from "vitest";
import { compileProjectMdx, getProjectWriteup } from "./mdx";
import type { Project } from "@/lib/schema";

const project: Project = {
  id: "projet-inexistant-pour-le-test",
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
};

describe("getProjectWriteup", () => {
  it("retourne null quand le fichier content/projects/<id>.<locale>.mdx n'existe pas", async () => {
    const result = await getProjectWriteup(project, "fr");
    expect(result).toBeNull();
  });
});

describe("compileProjectMdx", () => {
  it("compile une chaîne MDX simple en élément rendable", async () => {
    const content = await compileProjectMdx("## Titre\n\nDu texte.", project);
    expect(content).toBeDefined();
  });

  it("permet d'utiliser InlineMetric avec un label connu", async () => {
    const content = await compileProjectMdx(
      '<InlineMetric label="latence p95" />',
      project,
    );
    expect(content).toBeDefined();
  });

  it("relève l'erreur de compilation pour du MDX invalide", async () => {
    await expect(compileProjectMdx("<UnclosedTag>", project)).rejects.toThrow();
  });
});
