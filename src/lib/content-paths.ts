import path from "node:path";

// Module minimal et sans dépendance lourde : importé à la fois par
// src/lib/mdx.ts (au runtime Next.js) et scripts/validate-data.ts (exécuté
// directement par tsx, hors bundler) — ce dernier planterait s'il importait
// mdx.ts, dont la chaîne d'imports remonte jusqu'à des *.module.scss.
export const PROJECTS_CONTENT_DIR = path.join(
  process.cwd(),
  "content",
  "projects",
);
