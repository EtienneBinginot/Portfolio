import type { Chart as ChartData } from "@/lib/schema";
import {
  buildScale,
  buildYTicks,
  describeChart,
  labelStep,
  MARGIN,
  PLOT_H,
  PLOT_W,
  quantize,
  slugify,
  VIEW_H,
  VIEW_W,
} from "./scale";
import styles from "./Chart.module.scss";

const BAR_GAP = 4;
const MAX_ANNOTATED_BARS = 8;

type DistributionProps = { chart: ChartData };

export default function Distribution({ chart }: DistributionProps) {
  const titleId = `${slugify(chart.title)}-title`;
  const descId = `${slugify(chart.title)}-desc`;

  const points = chart.series[0]?.points ?? [];
  const domainMax = Math.max(0, ...points.map((p) => p.value));
  const yTicks = buildYTicks(chart.scale, domainMax);
  const yScale = buildScale(chart.scale, domainMax, PLOT_H);
  const step = labelStep(points.length);
  const showAnnotations = points.length <= MAX_ANNOTATED_BARS;

  const barWidth = quantize(
    (PLOT_W - BAR_GAP * (points.length - 1)) / Math.max(points.length, 1),
  );

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{chart.title}</title>
      <desc id={descId}>{describeChart(chart)}</desc>

      {yTicks.map((tick) => {
        const y = quantize(MARGIN.top + PLOT_H - yScale(tick));
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
              x={MARGIN.left - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {Math.round(tick)}
            </text>
          </g>
        );
      })}

      {points.map((point, index) => {
        const barHeight = quantize(yScale(point.value));
        const x = quantize(MARGIN.left + index * (barWidth + BAR_GAP));
        const y = quantize(MARGIN.top + PLOT_H - barHeight);
        const showLabel = index % step === 0 || index === points.length - 1;

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
                y={y - 6}
                textAnchor="middle"
              >
                {point.value}
              </text>
            )}
            {showLabel && (
              <text
                className={styles.axisLabel}
                x={x + barWidth / 2}
                y={VIEW_H - MARGIN.bottom + 20}
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
