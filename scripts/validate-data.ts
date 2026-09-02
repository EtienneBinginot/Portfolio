import { z } from "zod";
import frRaw from "../src/data/data.fr.json";
import enRaw from "../src/data/data.en.json";
import { DataSchema } from "../src/lib/schema";

// Garde-fou explicite pour le build : `npm run build` déclenche ce script
// via "prebuild". Échec bloquant si un data.*.json ne respecte pas le schéma
// — notamment les deux règles structurantes (metric.method/measuredAt,
// skill.evidence) qui ne doivent jamais passer silencieusement.
const files: Array<[string, unknown]> = [
  ["src/data/data.fr.json", frRaw],
  ["src/data/data.en.json", enRaw],
];

let hasError = false;

for (const [path, raw] of files) {
  const result = DataSchema.safeParse(raw);
  if (!result.success) {
    console.error(`✗ ${path} invalide :\n`);
    console.error(z.prettifyError(result.error));
    hasError = true;
  } else {
    console.log(`✓ ${path} conforme au schéma.`);
  }
}

if (hasError) {
  process.exit(1);
}
