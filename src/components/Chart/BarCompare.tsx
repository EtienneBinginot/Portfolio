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
  quantize,
  VALUE_LABEL_OFFSET,
  VIEW_H,
  VIEW_W,
  yPosition,
} from "./scale";
import YAxis from "./YAxis";
import Legend from "./Legend";
import styles from "./Chart.module.scss";

const BAR_COLORS = [
  "var(--accent-blue)",
  "var(--accent-green)",
  "var(--accent-cyan)",
];

type BarCompareProps = { chart: ChartData };

export default function BarCompare({ chart }: BarCompareProps) {
  const { titleId, descId } = chartA11yIds(chart.title);

  const domainMax = domainMaxOf(chart.series.flatMap((s) => s.points));
  const yTicks = buildYTicks(chart.scale, domainMax);
  const yScale = buildScale(chart.scale, domainMax, PLOT_H);

  const clusterWidth = PLOT_W / chart.series.length;
  const pointCount = chart.series[0]?.points.length ?? 0;
  const barWidth = computeBarWidth(clusterWidth, pointCount, BAR_GAP);

  const legendItems = (chart.series[0]?.points ?? []).map((point, index) => ({
    label: point.label,
    color: BAR_COLORS[index % BAR_COLORS.length],
  }));

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
                const y = yPosition(yScale, point.value);

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
                      y={y - VALUE_LABEL_OFFSET}
                      textAnchor="middle"
                    >
                      {point.value}
                    </text>
                  </g>
                );
              })}
              <text
                className={styles.axisLabel}
                x={clusterX + clusterWidth / 2}
                y={VIEW_H - MARGIN.bottom + AXIS_LABEL_GAP}
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
