import { existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import frRaw from "../src/data/data.fr.json";
import enRaw from "../src/data/data.en.json";
import { DataSchema } from "../src/lib/schema";
import { PROJECTS_CONTENT_DIR } from "../src/lib/content-paths";
import type { Locale } from "../src/i18n/routing";

// Garde-fou explicite pour le build : `npm run build` déclenche ce script
// via "prebuild". Échec bloquant si un data.*.json ne respecte pas le schéma
// — notamment les deux règles structurantes (metric.method/measuredAt,
// skill.evidence) qui ne doivent jamais passer silencieusement.
const files: Array<[Locale, string, unknown]> = [
  ["fr", "src/data/data.fr.json", frRaw],
  ["en", "src/data/data.en.json", enRaw],
];

let hasError = false;
const projectIdsByLocale: Partial<Record<Locale, string[]>> = {};

for (const [locale, filePath, raw] of files) {
  const result = DataSchema.safeParse(raw);
  if (!result.success) {
    console.error(`✗ ${filePath} invalide :\n`);
    console.error(z.prettifyError(result.error));
    hasError = true;
  } else {
    console.log(`✓ ${filePath} conforme au schéma.`);
    projectIdsByLocale[locale] = result.data.projects.map((p) => p.id);
  }
}

// Un write-up MDX publié dans une seule locale laisserait l'autre locale
// silencieusement sans section "En détail" — cette asymétrie doit bloquer
// le build plutôt que d'être découverte en production.
if (projectIdsByLocale.fr && projectIdsByLocale.en) {
  const allIds = new Set([...projectIdsByLocale.fr, ...projectIdsByLocale.en]);
  for (const id of allIds) {
    const hasFr = existsSync(path.join(PROJECTS_CONTENT_DIR, `${id}.fr.mdx`));
    const hasEn = existsSync(path.join(PROJECTS_CONTENT_DIR, `${id}.en.mdx`));
    if (hasFr !== hasEn) {
      console.error(
        `✗ write-up asymétrique pour "${id}" : fr=${hasFr}, en=${hasEn} — les deux locales doivent avoir le fichier ou aucune.`,
      );
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}
