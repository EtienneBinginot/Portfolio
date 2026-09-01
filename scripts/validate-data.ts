import { z } from "zod";
import raw from "../src/data/data.json";
import { DataSchema } from "../src/lib/schema";

// Garde-fou explicite pour le build : `npm run build` déclenche ce script
// via "prebuild". Échec bloquant si data.json ne respecte pas le schéma —
// notamment les deux règles structurantes (metric.method/measuredAt,
// skill.evidence) qui ne doivent jamais passer silencieusement.
const result = DataSchema.safeParse(raw);

if (!result.success) {
  console.error("✗ src/data/data.json invalide :\n");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

console.log("✓ src/data/data.json conforme au schéma.");
