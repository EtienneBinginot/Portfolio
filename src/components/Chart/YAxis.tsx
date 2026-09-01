import { MARGIN, PLOT_W, TICK_LABEL_GAP, yPosition } from "./scale";
import type { ScaleFn } from "./scale";
import styles from "./Chart.module.scss";

type YAxisProps = {
  ticks: number[];
  yScale: ScaleFn;
  formatTick: (tick: number, index: number) => string;
};

// Grille horizontale + graduations de l'axe Y, partagée par les trois
// variantes de Chart (bar-compare, timeseries, distribution) : elles
// dessinaient auparavant ce bloc trois fois, à l'identique.
export default function YAxis({ ticks, yScale, formatTick }: YAxisProps) {
  return (
    <>
      {ticks.map((tick, index) => {
        const y = yPosition(yScale, tick);
        return (
          <g key={tick}>
            <line
              className={styles.gridline}
              x1={MARGIN.left}
              y1={y}
              x2={MARGIN.left + PLOT_W}
              y2={y}
            />
            <text
              className={styles.axisLabel}
              x={MARGIN.left - TICK_LABEL_GAP}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {formatTick(tick, index)}
            </text>
          </g>
        );
      })}
    </>
  );
}
