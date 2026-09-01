import type { Chart as ChartData } from "@/lib/schema";
import {
  AXIS_LABEL_GAP,
  BAR_GAP,
  chartA11yIds,
  computeBarWidth,
  describeChart,
  domainMaxOf,
  formatYAxisTick,
  MARGIN,
  PLOT_H,
  PLOT_W,
  buildScale,
  buildYTicks,
  labelStep,
  quantize,
  shouldShowLabel,
  VALUE_LABEL_OFFSET,
  VIEW_H,
  VIEW_W,
  yPosition,
} from "./scale";
import YAxis from "./YAxis";
import styles from "./Chart.module.scss";

const MAX_ANNOTATED_BARS = 8;

type DistributionProps = { chart: ChartData };

export default function Distribution({ chart }: DistributionProps) {
  const { titleId, descId } = chartA11yIds(chart.title);

  const points = chart.series[0]?.points ?? [];
  const domainMax = domainMaxOf(points);
  const yTicks = buildYTicks(chart.scale, domainMax);
  const yScale = buildScale(chart.scale, domainMax, PLOT_H);
  const step = labelStep(points.length);
  const showAnnotations = points.length <= MAX_ANNOTATED_BARS;

  const barWidth = computeBarWidth(PLOT_W, points.length, BAR_GAP);

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{chart.title}</title>
      <desc id={descId}>{describeChart(chart)}</desc>

      <YAxis
        ticks={yTicks}
        yScale={yScale}
        formatTick={(tick, index) =>
          formatYAxisTick(chart, tick, index === yTicks.length - 1)
        }
      />

      {points.map((point, index) => {
        const barHeight = quantize(yScale(point.value));
        const x = quantize(MARGIN.left + index * (barWidth + BAR_GAP));
        const y = yPosition(yScale, point.value);
        const showLabel = shouldShowLabel(index, points.length, step);

        return (
          <g key={point.label}>
            <rect
              data-role="bar"
              className={styles.barOutline}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="var(--accent-blue)"
              shapeRendering="crispEdges"
            />
            {showAnnotations && (
              <text
                className={styles.valueLabel}
                x={x + barWidth / 2}
                y={y - VALUE_LABEL_OFFSET}
                textAnchor="middle"
              >
                {point.value}
              </text>
            )}
            {showLabel && (
              <text
                className={styles.axisLabel}
                x={x + barWidth / 2}
                y={VIEW_H - MARGIN.bottom + AXIS_LABEL_GAP}
                textAnchor="middle"
              >
                {point.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
