import type { Chart as ChartData } from "@/lib/schema";
import {
  buildScale,
  buildYTicks,
  describeChart,
  MARGIN,
  PLOT_H,
  PLOT_W,
  quantize,
  slugify,
  VIEW_H,
  VIEW_W,
} from "./scale";
import styles from "./Chart.module.scss";

const BAR_COLORS = [
  "var(--accent-blue)",
  "var(--accent-green)",
  "var(--accent-cyan)",
];

const BAR_GAP = 4;

type BarCompareProps = { chart: ChartData };

export default function BarCompare({ chart }: BarCompareProps) {
  const titleId = `${slugify(chart.title)}-title`;
  const descId = `${slugify(chart.title)}-desc`;

  const domainMax = Math.max(
    0,
    ...chart.series.flatMap((s) => s.points.map((p) => p.value)),
  );
  const yTicks = buildYTicks(chart.scale, domainMax);
  const yScale = buildScale(chart.scale, domainMax, PLOT_H);

  const clusterWidth = PLOT_W / chart.series.length;
  const pointCount = chart.series[0]?.points.length ?? 0;
  const barWidth = quantize(
    (clusterWidth - BAR_GAP * (pointCount - 1)) / Math.max(pointCount, 1),
  );

  const legendLabels = chart.series[0]?.points.map((p) => p.label) ?? [];

  return (
    <>
      {legendLabels.length > 0 && (
        <ul className={styles.legend}>
          {legendLabels.map((label, index) => (
            <li key={label} className={styles.legendItem}>
              <span
                className={styles.swatch}
                style={
                  {
                    "--swatch-color": BAR_COLORS[index % BAR_COLORS.length],
                  } as React.CSSProperties
                }
              />
              <span className={styles.legendLabel}>{label}</span>
            </li>
          ))}
        </ul>
      )}
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

        {chart.series.map((series, seriesIndex) => {
          const clusterX = MARGIN.left + seriesIndex * clusterWidth;
          const groupWidth = quantize(
            barWidth * series.points.length +
              BAR_GAP * (series.points.length - 1),
          );
          const groupStart = quantize(
            clusterX + (clusterWidth - groupWidth) / 2,
          );

          return (
            <g key={series.name}>
              {series.points.map((point, pointIndex) => {
                const barHeight = quantize(yScale(point.value));
                const x = quantize(
                  groupStart + pointIndex * (barWidth + BAR_GAP),
                );
                const y = quantize(MARGIN.top + PLOT_H - barHeight);
                const isFirstBar = seriesIndex === 0 && pointIndex === 0;

                return (
                  <g key={point.label}>
                    <rect
                      data-role="bar"
                      className={styles.barOutline}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={BAR_COLORS[pointIndex % BAR_COLORS.length]}
                      shapeRendering="crispEdges"
                    />
                    <text
                      className={styles.valueLabel}
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                    >
                      {point.value}
                      {isFirstBar && chart.unit ? ` ${chart.unit}` : ""}
                    </text>
                  </g>
                );
              })}
              <text
                className={styles.axisLabel}
                x={clusterX + clusterWidth / 2}
                y={VIEW_H - MARGIN.bottom + 20}
                textAnchor="middle"
              >
                {series.name}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
}
