import type { Chart as ChartData } from "@/lib/schema";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import BarCompare from "./BarCompare";
import Timeseries from "./Timeseries";
import Distribution from "./Distribution";
import { cx } from "@/lib/cx";
import styles from "./Chart.module.scss";

type ChartProps = {
  chart: ChartData;
  className?: string;
  /** Libellé traduit du badge d'échelle logarithmique (voir Chart.logScale
   * dans les fichiers de messages) — pas de texte codé en dur ici. */
  logScaleLabel?: string;
  /** "standalone" (défaut) : présentation pleine page. "inline" : largeur
   * contrainte à la mesure de prose et légende plus discrète (MDX). */
  variant?: "standalone" | "inline";
  /** Libellés traduits de la légende de mise en évidence d'un graphique
   * `distribution` (voir Distribution.tsx) — sans effet sur les autres
   * types de graphique. */
  highlightLabel?: string;
  otherLabel?: string;
};

export default function Chart({
  chart,
  className,
  logScaleLabel,
  variant = "standalone",
  highlightLabel,
  otherLabel,
}: ChartProps) {
  const inline = variant === "inline";

  return (
    <figure className={cx(styles.figure, inline && styles.inline, className)}>
      <PixelBorder>
        <div className={styles.header}>
          <h3 className={styles.title}>{chart.title}</h3>
          {chart.scale === "log" && logScaleLabel && (
            <span className={styles.logBadge} role="note">
              {logScaleLabel}
            </span>
          )}
        </div>
        <div data-chart-type={chart.type}>
          {chart.type === "bar-compare" && <BarCompare chart={chart} />}
          {chart.type === "timeseries" && <Timeseries chart={chart} />}
          {chart.type === "distribution" && (
            <Distribution
              chart={chart}
              highlightLabel={highlightLabel}
              otherLabel={otherLabel}
            />
          )}
        </div>
      </PixelBorder>
      <figcaption
        className={cx(styles.caption, inline && styles.captionInline)}
      >
        {chart.caption}
        <span className={styles.source}> — Source : {chart.source}</span>
      </figcaption>
    </figure>
  );
}
