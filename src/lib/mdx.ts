import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { evaluate } from "next-mdx-remote-client/rsc";
import type { Project } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";
import { buildMdxComponents } from "@/mdx-components";
import { PROJECTS_CONTENT_DIR } from "@/lib/content-paths";

// Séparée de getProjectWriteup pour rester testable sans dépendre des
// fichiers réels de content/projects/ : une chaîne MDX inline suffit.
// `evaluate` ne throw pas ses erreurs de compilation, il les renvoie dans
// `result.error` — on les relève nous-mêmes.
export async function compileProjectMdx(
  source: string,
  project: Project,
  logScaleLabel?: string,
) {
  const { content } = matter(source);
  const result = await evaluate({
    source: content,
    components: buildMdxComponents(project, { logScaleLabel }),
    options: { parseFrontmatter: false },
  });

  if (result.error) {
    throw result.error;
  }

  return result.content;
}

// Absence de fichier = pas de write-up pour ce projet/cette locale, pas une
// erreur : c'est la seule source de vérité (voir suppression du champ
// `writeup` du schéma).
export async function getProjectWriteup(
  project: Project,
  locale: Locale,
  logScaleLabel?: string,
) {
  const filePath = path.join(
    PROJECTS_CONTENT_DIR,
    `${project.id}.${locale}.mdx`,
  );
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    return null;
  }

  return compileProjectMdx(raw, project, logScaleLabel);
}
