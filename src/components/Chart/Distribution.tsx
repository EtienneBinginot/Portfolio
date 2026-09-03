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
import Legend from "./Legend";
import styles from "./Chart.module.scss";

const MAX_ANNOTATED_BARS = 8;
const HIGHLIGHT_COLOR = "var(--accent-cyan)";
const OTHER_COLOR = "var(--accent-blue)";

type DistributionProps = {
  chart: ChartData;
  /** Libellés traduits de la légende à 2 entrées, affichée seulement si au
   * moins un point porte `highlight: true`. */
  highlightLabel?: string;
  otherLabel?: string;
};

export default function Distribution({
  chart,
  highlightLabel,
  otherLabel,
}: DistributionProps) {
  const { titleId, descId } = chartA11yIds(chart.title);

  const points = chart.series[0]?.points ?? [];
  const domainMax = domainMaxOf(points);
  const yTicks = buildYTicks(chart.scale, domainMax);
  const yScale = buildScale(chart.scale, domainMax, PLOT_H);
  const step = labelStep(points.length);
  const showAnnotations = points.length <= MAX_ANNOTATED_BARS;

  const barWidth = computeBarWidth(PLOT_W, points.length, BAR_GAP);
  const hasHighlight = points.some((point) => point.highlight);

  const legendItems =
    hasHighlight && highlightLabel && otherLabel
      ? [
          { label: highlightLabel, color: HIGHLIGHT_COLOR },
          { label: otherLabel, color: OTHER_COLOR },
        ]
      : [];

  return (
    <>
      <Legend items={legendItems} />
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
          const barColor = point.highlight ? HIGHLIGHT_COLOR : OTHER_COLOR;

          return (
            <g key={point.label}>
              <rect
                data-role="bar"
                className={styles.barOutline}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={barColor}
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
    </>
  );
}
