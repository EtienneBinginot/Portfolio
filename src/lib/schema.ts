import { z } from "zod";

// Schéma de src/data/data.json — source unique de contenu du site.
// Reprend le modèle de données décrit dans Notion (Projets / Portfolio).
//
// Deux règles structurantes, imposées ici et pas seulement documentées :
//   1. Aucune métrique sans `method` et `measuredAt`. Un chiffre sans
//      méthode est une affirmation ; avec méthode, c'est une mesure.
//   2. `skills[].evidence` doit pointer vers un id de projet ou de cas
//      existant. Une compétence sans preuve liée n'a pas sa place.
// Ces deux règles s'appliquent à `projects` et `cases`, pas à `chantiers` :
// les chantiers racontent une progression, ils ne prouvent rien par des
// chiffres.

export const MetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  method: z
    .string()
    .min(
      1,
      "method est obligatoire : comment cette mesure a-t-elle été prise ?",
    ),
  measuredAt: z
    .string()
    .min(
      1,
      "measuredAt est obligatoire : quand cette mesure a-t-elle été prise ?",
    ),
});

export const ChartPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const ChartSeriesSchema = z.object({
  name: z.string(),
  points: z.array(ChartPointSchema),
});

export const ChartSchema = z
  .object({
    type: z.enum(["bar-compare", "timeseries", "distribution"]),
    title: z.string().min(1),
    unit: z.string(),
    // Échelle explicite, "linear" par défaut (rétro-compatible avec les
    // charts existants qui n'ont pas ce champ). Le signalement visuel de
    // l'échelle log est porté par les composants Chart, pas par le schéma.
    scale: z.enum(["linear", "log"]).default("linear"),
    caption: z.string().min(1, "caption obligatoire : source + date de mesure"),
    source: z.string().min(1),
    series: z.array(ChartSeriesSchema).min(1),
  })
  .superRefine((chart, ctx) => {
    if (chart.scale !== "log") return;
    chart.series.forEach((series, si) => {
      series.points.forEach((point, pi) => {
        if (point.value <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["series", si, "points", pi, "value"],
            message:
              "échelle logarithmique incompatible avec une valeur <= 0 (log indéfini)",
          });
        }
      });
    });
  });

export const MetaSchema = z.object({
  name: z.string(),
  role: z.string(),
  lane: z.string(),
  tagline: z.string(),
  email: z.string().email(),
  github: z.string().url(),
  linkedin: z.string().url(),
});

export const HighlightSchema = z.object({
  value: z.string(),
  label: z.string(),
  context: z.string(),
  href: z.string(),
});

export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  problem: z.string(),
  decisions: z.string(),
  stack: z.array(z.string()),
  repo: z.string().url().optional(),
  demo: z.string().url().optional(),
  featured: z.boolean().default(false),
  metrics: z.array(MetricSchema),
  chart: ChartSchema.optional(),
  retrospective: z.string().optional(),
});

export const CaseScopeSchema = z.enum(["mission", "infrastructure", "produit"]);

export const CaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  period: z.string(),
  context: z.string(),
  constraints: z.string(),
  scope: CaseScopeSchema,
  myRole: z.string(),
  decisions: z.string(),
  featured: z.boolean().default(false),
  metrics: z.array(MetricSchema),
  chart: ChartSchema.optional(),
  retrospective: z.string().optional(),
});

export const SkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  evidence: z
    .string()
    .min(1, "evidence obligatoire : id d'un projet ou d'un cas"),
});

export const ChantierSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  period: z.string(),
  summary: z.string(),
  repo: z.string().url().optional(),
});

export const AboutSchema = z.object({
  bio: z.string(),
  formation: z.array(z.string()),
  interests: z.array(z.string()),
});

export const DataSchema = z
  .object({
    meta: MetaSchema,
    highlights: z.array(HighlightSchema),
    projects: z.array(ProjectSchema),
    cases: z.array(CaseSchema),
    skills: z.array(SkillSchema),
    chantiers: z.array(ChantierSchema),
    about: AboutSchema,
  })
  .superRefine((root, ctx) => {
    const knownIds = new Set([
      ...root.projects.map((p) => p.id),
      ...root.cases.map((c) => c.id),
    ]);

    root.skills.forEach((skill, index) => {
      if (!knownIds.has(skill.evidence)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["skills", index, "evidence"],
          message: `evidence "${skill.evidence}" ne correspond à aucun id de projet ou de cas — une compétence sans preuve ne doit pas s'afficher`,
        });
      }
    });

    const idPattern = /^\/(projets|interventions)\/([^/#]+)/;
    root.highlights.forEach((highlight, index) => {
      const match = highlight.href.match(idPattern);
      if (match && !knownIds.has(match[2])) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highlights", index, "href"],
          message: `href "${highlight.href}" pointe vers un id "${match[2]}" introuvable parmi projects/cases`,
        });
      }
    });
  });

export type Data = z.infer<typeof DataSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type Chart = z.infer<typeof ChartSchema>;
export type Highlight = z.infer<typeof HighlightSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Case = z.infer<typeof CaseSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Chantier = z.infer<typeof ChantierSchema>;
