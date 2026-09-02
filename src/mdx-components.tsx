import type { Project } from "@/lib/schema";
import MetricBlock from "@/components/MetricBlock/MetricBlock";
import Chart from "@/components/Chart/Chart";

type InlineMetricProps = {
  label: string;
};

// Les write-ups référencent une métrique par son label exact plutôt que de
// dupliquer la valeur en prose — un chiffre écrit deux fois finit par
// diverger. Un label introuvable est une erreur d'auteur, pas un cas à
// afficher silencieusement : elle doit faire échouer le build.
export function buildMdxComponents(project: Project) {
  return {
    InlineMetric({ label }: InlineMetricProps) {
      const metric = project.metrics.find((m) => m.label === label);
      if (!metric) {
        throw new Error(
          `InlineMetric : aucune métrique "${label}" trouvée pour le projet "${project.id}"`,
        );
      }
      return <MetricBlock {...metric} />;
    },
    InlineChart() {
      if (!project.chart) {
        throw new Error(
          `InlineChart utilisé dans le write-up de "${project.id}" mais ce projet n'a pas de chart en donnée`,
        );
      }
      return <Chart chart={project.chart} />;
    },
  };
}
