import type { Project } from "@/lib/schema";
import { Link } from "@/i18n/navigation";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import { cx } from "@/lib/cx";
import styles from "./ProjectCard.module.scss";

type ProjectCardProps = {
  project: Project;
  className?: string;
  /** "card" (défaut) : grille de cartes (page d'accueil).
   * "row" : liste de lignes pleine largeur (page Projets), résultat et
   * titre sur une même ligne d'en-tête façon ExplorationEntry. */
  variant?: "card" | "row";
};

// Mène par le résultat, pas par la stack (Phase 3 TODO) : la première
// métrique du projet ouvre la carte, la stack ne vient qu'en métadonnée
// discrète en bas — jamais en titre.
export default function ProjectCard({
  project,
  className,
  variant = "card",
}: ProjectCardProps) {
  const leadMetric = project.metrics[0];
  const isRow = variant === "row";

  return (
    <Link
      href={`/projets/${project.id}`}
      className={cx(styles.link, isRow && styles.linkRow, className)}
    >
      <PixelBorder
        className={cx(styles.frame, isRow && styles.frameRow)}
        sweepOnHover
      >
        <div className={styles.heading}>
          {leadMetric && (
            <p className={styles.result}>
              <span className={styles.resultValue}>{leadMetric.value}</span>
              {leadMetric.unit && (
                <span className={styles.resultUnit}> {leadMetric.unit}</span>
              )}
              <span className={styles.resultLabel}> — {leadMetric.label}</span>
            </p>
          )}
          <h3 className={styles.title}>{project.title}</h3>
        </div>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.stack}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </PixelBorder>
    </Link>
  );
}
