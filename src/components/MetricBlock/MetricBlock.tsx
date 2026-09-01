import type { Metric } from "@/lib/schema";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import styles from "./MetricBlock.module.scss";

type MetricBlockProps = Metric & {
  className?: string;
  borderColor?: string;
  fill?: string;
  thick?: boolean;
};

export default function MetricBlock({
  value,
  unit,
  label,
  method,
  measuredAt,
  className,
  borderColor,
  fill,
  thick,
}: MetricBlockProps) {
  return (
    <PixelBorder
      className={className}
      borderColor={borderColor}
      fill={fill}
      thick={thick}
    >
      <div className={styles.metric}>
        <dl className={styles.stat}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>
            {value}
            {unit ? <span className={styles.unit}> {unit}</span> : null}
          </dd>
        </dl>
        <p className={styles.method}>
          {method} — <span className={styles.date}>{measuredAt}</span>
        </p>
      </div>
    </PixelBorder>
  );
}
