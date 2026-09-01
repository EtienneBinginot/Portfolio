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

const MARKER_SIZE = 8;

type TimeseriesProps = { chart: ChartData };

export default function Timeseries({ chart }: TimeseriesProps) {
  const titleId = `${slugify(chart.title)}-title`;
  const descId = `${slugify(chart.title)}-desc`;

  // Une seule série rendue : le schéma autorise plusieurs séries pour
  // couvrir des besoins futurs, hors scope Phase 2 (overlay multi-séries).
  const points = chart.series[0]?.points ?? [];
  const domainMax = Math.max(0, ...points.map((p) => p.value));
  const yTicks = buildYTicks(chart.scale, domainMax);
  const yScale = buildScale(chart.scale, domainMax, PLOT_H);
  const step = labelStep(points.length);

  const coords = points.map((point, index) => {
    const x = quantize(
      MARGIN.left +
        (points.length > 1 ? (index / (points.length - 1)) * PLOT_W : 0),
    );
    const y = quantize(MARGIN.top + PLOT_H - yScale(point.value));
    return { x, y, point };
  });

  // Ligne "en escalier" : uniquement des segments horizontaux/verticaux,
  // jamais de diagonale — écho au motif des coins en escalier de PixelBorder,
  // et garantie de bords nets quel que soit le moteur de rendu.
  const pathParts: string[] = [];
  coords.forEach((coord, index) => {
    if (index === 0) {
      pathParts.push(`M ${coord.x} ${coord.y}`);
    } else {
      pathParts.push(`H ${coord.x}`);
      pathParts.push(`V ${coord.y}`);
    }
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

      {yTicks.map((tick, index) => {
        const y = quantize(MARGIN.top + PLOT_H - yScale(tick));
        const isTopTick = index === yTicks.length - 1;
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
              {isTopTick && chart.scale === "log" ? " (log)" : ""}
            </text>
          </g>
        );
      })}

      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-green)"
          strokeWidth={2}
          shapeRendering="crispEdges"
        />
      )}

      {coords.map(({ x, y, point }, index) => {
        const showLabel = index % step === 0 || index === coords.length - 1;
        return (
          <g key={point.label}>
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
