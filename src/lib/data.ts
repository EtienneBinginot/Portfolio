import raw from "@/data/data.json";
import { DataSchema } from "./schema";

// Parsé au niveau module : comme ce module est importé par des pages
// statiquement générées, un data.json invalide fait échouer `next build`
// directement ici, en plus du garde-fou explicite de scripts/validate-data.ts.
export const data = DataSchema.parse(raw);
