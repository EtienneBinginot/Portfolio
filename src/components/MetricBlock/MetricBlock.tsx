import type { Metric } from "@/lib/schema";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import { cx } from "@/lib/cx";
import styles from "./MetricBlock.module.scss";

type MetricBlockProps = Metric & {
  className?: string;
  borderColor?: string;
  fill?: string;
  thick?: boolean;
  /** "standalone" (défaut) : bloc plein PixelBorder.
   * "inline" : chip fine sans PixelBorder (réinsertion MDX). */
  variant?: "standalone" | "inline";
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
  variant = "standalone",
}: MetricBlockProps) {
  const valueWithUnit = (
    <>
      {value}
      {unit ? <span className={styles.unit}> {unit}</span> : null}
    </>
  );

  if (variant === "inline") {
    return (
      <span className={cx(styles.inlineChip, className)}>
        <span className={styles.inlineValue}>{valueWithUnit}</span>
        <span className={styles.inlineLabel}>{label}</span>
      </span>
    );
  }

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
          <dd className={styles.value}>{valueWithUnit}</dd>
        </dl>
        <p className={styles.method}>
          {method} — <span className={styles.date}>{measuredAt}</span>
        </p>
      </div>
    </PixelBorder>
  );
}
