import type { Chart as ChartData } from "@/lib/schema";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import BarCompare from "./BarCompare";
import Timeseries from "./Timeseries";
import Distribution from "./Distribution";
import styles from "./Chart.module.scss";

type ChartProps = {
  chart: ChartData;
  className?: string;
};

export default function Chart({ chart, className }: ChartProps) {
  return (
    <figure className={[styles.figure, className].filter(Boolean).join(" ")}>
      <PixelBorder>
        <div className={styles.header}>
          <h3 className={styles.title}>{chart.title}</h3>
          {chart.scale === "log" && (
            <span className={styles.logBadge} role="note">
              échelle logarithmique
            </span>
          )}
        </div>
        <div data-chart-type={chart.type}>
          {chart.type === "bar-compare" && <BarCompare chart={chart} />}
          {chart.type === "timeseries" && <Timeseries chart={chart} />}
          {chart.type === "distribution" && <Distribution chart={chart} />}
        </div>
      </PixelBorder>
      <figcaption className={styles.caption}>
        {chart.caption}
        <span className={styles.source}> — Source : {chart.source}</span>
      </figcaption>
    </figure>
  );
}
