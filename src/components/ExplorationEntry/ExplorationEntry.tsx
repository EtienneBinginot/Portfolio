import type { Exploration } from "@/lib/schema";
import { Link } from "@/i18n/navigation";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import MetricBlock from "@/components/MetricBlock/MetricBlock";
import { cx } from "@/lib/cx";
import styles from "./ExplorationEntry.module.scss";

type ExplorationEntryProps = {
  exploration: Exploration;
  className?: string;
};

// Ligne de liste chronologique compacte qui pointe vers la fiche détail —
// même logique que ProjectCard/ExperienceCard (résultat en en-tête, reste en
// métadonnée), mais sans repo/chart en aperçu : ça reste sur la fiche.
export default function ExplorationEntry({
  exploration,
  className,
}: ExplorationEntryProps) {
  const leadMetric = exploration.metrics?.[0];

  return (
    <Link
      href={`/explorations/${exploration.id}`}
      className={cx(styles.link, className)}
    >
      <PixelBorder className={styles.frame} sweepOnHover>
        <div className={styles.heading}>
          <span className={styles.period}>{exploration.period}</span>
          <h3 className={styles.title}>{exploration.title}</h3>
        </div>
        <p className={styles.summary}>{exploration.summary}</p>
        {leadMetric && (
          <MetricBlock
            {...leadMetric}
            variant="inline"
            className={styles.metric}
          />
        )}
      </PixelBorder>
    </Link>
  );
}
