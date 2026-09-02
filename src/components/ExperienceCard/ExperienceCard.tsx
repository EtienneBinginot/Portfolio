import type { Case } from "@/lib/schema";
import { Link } from "@/i18n/navigation";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import styles from "./ExperienceCard.module.scss";

type ExperienceCardProps = {
  case: Case;
  scopeLabel: string;
  className?: string;
};

// Mène par le résultat mesuré, comme ProjectCard : le badge de contexte
// (scope) situe l'intervention, mais ce n'est pas lui qui accroche.
export default function ExperienceCard({
  case: intervention,
  scopeLabel,
  className,
}: ExperienceCardProps) {
  const leadMetric = intervention.metrics[0];

  return (
    <Link
      href={`/interventions/${intervention.id}`}
      className={[styles.link, className].filter(Boolean).join(" ")}
    >
      <PixelBorder className={styles.frame}>
        <span className={styles.badge}>{scopeLabel}</span>
        {leadMetric && (
          <p className={styles.result}>
            <span className={styles.resultValue}>{leadMetric.value}</span>
            {leadMetric.unit && (
              <span className={styles.resultUnit}> {leadMetric.unit}</span>
            )}
            <span className={styles.resultLabel}> — {leadMetric.label}</span>
          </p>
        )}
        <h3 className={styles.title}>{intervention.title}</h3>
        <p className={styles.context}>{intervention.myRole}</p>
      </PixelBorder>
    </Link>
  );
}
