import type { Chart as ChartData } from "@/lib/schema";
import {
  AXIS_LABEL_GAP,
  chartA11yIds,
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
  VIEW_H,
  VIEW_W,
  yPosition,
} from "./scale";
import YAxis from "./YAxis";
import styles from "./Chart.module.scss";

const MARKER_SIZE = 8;

type TimeseriesProps = { chart: ChartData };

export default function Timeseries({ chart }: TimeseriesProps) {
  const { titleId, descId } = chartA11yIds(chart.title);

  // Une seule série rendue : le schéma autorise plusieurs séries pour
  // couvrir des besoins futurs, hors scope Phase 2 (overlay multi-séries).
  const points = chart.series[0]?.points ?? [];
  const domainMax = domainMaxOf(points);
  const yTicks = buildYTicks(chart.scale, domainMax);
  const yScale = buildScale(chart.scale, domainMax, PLOT_H);
  const step = labelStep(points.length);

  // Ligne "en escalier" : uniquement des segments horizontaux/verticaux,
  // jamais de diagonale — écho au motif des coins en escalier de PixelBorder,
  // et garantie de bords nets quel que soit le moteur de rendu. coords et
  // pathParts sont construits en une seule passe sur points.
  const coords: { x: number; y: number; label: string }[] = [];
  const pathParts: string[] = [];
  points.forEach((point, index) => {
    const x = quantize(
      MARGIN.left +
        (points.length > 1 ? (index / (points.length - 1)) * PLOT_W : 0),
    );
    const y = yPosition(yScale, point.value);
    coords.push({ x, y, label: point.label });
    pathParts.push(index === 0 ? `M ${x} ${y}` : `H ${x} V ${y}`);
  });
  const pathD = pathParts.join(" ");

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

      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-green)"
          strokeWidth={2}
          shapeRendering="crispEdges"
        />
      )}

      {coords.map(({ x, y, label }, index) => {
        const showLabel = shouldShowLabel(index, coords.length, step);
        return (
          <g key={label}>
            <rect
              data-role="point"
              x={x - MARKER_SIZE / 2}
              y={y - MARKER_SIZE / 2}
              width={MARKER_SIZE}
              height={MARKER_SIZE}
              fill="var(--accent-green)"
              className={styles.barOutline}
              shapeRendering="crispEdges"
            />
            {showLabel && (
              <text
                className={styles.axisLabel}
                x={x}
                y={VIEW_H - MARGIN.bottom + AXIS_LABEL_GAP}
                textAnchor="middle"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
