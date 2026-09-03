import type { Chart as ChartData } from "@/lib/schema";

// Grille 4px du site (voir tokens/_spacing.scss) : toute coordonnée SVG
// passe par quantize() pour tomber sur cette grille — c'est ce qui garantit
// des bords nets ("pixels visibles") indépendamment du moteur de rendu.
export const PIXEL_UNIT = 4;

export function quantize(n: number, unit: number = PIXEL_UNIT): number {
  return Math.round(n / unit) * unit;
}

// Géométrie commune aux trois variantes : un viewBox fixe, mis à l'échelle
// de façon fluide par le composant (width="100%" height="auto"), sans JS.
export const VIEW_W = 600;
export const VIEW_H = 300;

export const BAR_GAP = 4;
// Écart entre le haut d'une barre et son annotation de valeur au-dessus.
export const VALUE_LABEL_OFFSET = 8;
// Hauteur de ligne du plus grand corps utilisé par une annotation de valeur
// (.valueLabel passe à --fs-md, 20 unités, sous la media query mobile de
// Chart.module.scss) — sert à dimensionner MARGIN.top ci-dessous pour que le
// label du point le plus haut ne dépasse jamais le viewBox, à n'importe
// quelle taille d'écran.
const MAX_VALUE_LABEL_LINE_HEIGHT = 24;
export const TICK_LABEL_GAP = 8; // entre l'axe Y et le texte de ses graduations
export const AXIS_LABEL_GAP = 20; // entre le bas du plot et un label d'axe X

export const MARGIN = {
  top: VALUE_LABEL_OFFSET + MAX_VALUE_LABEL_LINE_HEIGHT,
  right: 16,
  bottom: 44,
  left: 44,
};
export const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
export const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;

export type ScaleFn = (value: number) => number;

// Mappe une valeur vers une distance en unités SVG (0..rangeMax), linéaire ou
// logarithmique. En log, les valeurs <= 0 sont exclues en amont par le
// schéma Zod (ChartSchema.superRefine) : on peut supposer value > 0 ici.
export function buildScale(
  kind: "linear" | "log",
  domainMax: number,
  rangeMax: number,
): ScaleFn {
  if (kind === "log") {
    const safeMax = Math.max(domainMax, 10);
    const logMax = Math.log10(safeMax) || 1;
    return (value) => (Math.log10(Math.max(value, 1)) / logMax) * rangeMax;
  }
  return (value) => (domainMax === 0 ? 0 : (value / domainMax) * rangeMax);
}

// Valeurs des lignes de grille horizontales de l'axe Y : quatre paliers
// linéaires, ou les puissances de 10 qui couvrent le domaine en log.
export function buildYTicks(
  kind: "linear" | "log",
  domainMax: number,
): number[] {
  if (kind === "log") {
    const safeMax = Math.max(domainMax, 10);
    const topExponent = Math.ceil(Math.log10(safeMax));
    const ticks: number[] = [];
    for (let exp = 0; exp <= topExponent; exp += 1) {
      ticks.push(10 ** exp);
    }
    return ticks;
  }
  // domainMax à 0 (aucune valeur positive dans la série, ex: Root-Me avant
  // tout relevé) : une grille à quatre paliers dégénérerait en cinq
  // graduations à 0 (clés React dupliquées) — une seule graduation à 0
  // suffit à représenter l'absence de données.
  if (domainMax === 0) return [0];
  return [0, domainMax / 4, domainMax / 2, (domainMax * 3) / 4, domainMax];
}

// Position Y (quantifiée) d'une valeur sur le plot, haut de plot vers le bas
// — formule partagée par les graduations d'axe et les marques de données.
export function yPosition(yScale: ScaleFn, value: number): number {
  return quantize(MARGIN.top + PLOT_H - yScale(value));
}

// Identifiants déterministes liant <title>/<desc> au SVG via
// aria-labelledby/aria-describedby, sans hook React (composants Server).
export function chartA11yIds(title: string): {
  titleId: string;
  descId: string;
} {
  const slug = slugify(title);
  return { titleId: `${slug}-title`, descId: `${slug}-desc` };
}

export function domainMaxOf(points: { value: number }[]): number {
  return points.reduce((max, p) => (p.value > max ? p.value : max), 0);
}

// Largeur d'une barre quantifiée sur la grille, pour un nombre de barres
// donné réparties sur une largeur disponible avec un espacement gap.
export function computeBarWidth(
  availableWidth: number,
  count: number,
  gap: number = BAR_GAP,
): number {
  return quantize(
    (availableWidth - gap * Math.max(count - 1, 0)) / Math.max(count, 1),
  );
}

// Un label sur deux (ou plus, selon step) est affiché, mais le dernier est
// toujours forcé — évite le chevauchement sans jamais couper la série avant
// son dernier point.
export function shouldShowLabel(
  index: number,
  count: number,
  step: number,
): boolean {
  return index % step === 0 || index === count - 1;
}

// Texte d'une graduation de l'axe Y : la graduation la plus haute porte
// l'information de dimension du graphique (unité, ou échelle logarithmique)
// pour éviter de la répéter sur chaque marque de donnée.
export function formatYAxisTick(
  chart: Pick<ChartData, "unit" | "scale">,
  tick: number,
  isTopTick: boolean,
): string {
  const rounded = Math.round(tick);
  if (!isTopTick) return String(rounded);
  if (chart.scale === "log") return `${rounded} (log)`;
  return chart.unit ? `${rounded} ${chart.unit}` : String(rounded);
}

// Nombre de labels à sauter pour ne pas dépasser maxLabels affichés — évite
// le chevauchement sur mobile ou avec une série longue.
export function labelStep(count: number, maxLabels = 6): number {
  return Math.max(1, Math.ceil(count / maxLabels));
}

// Identifiant déterministe dérivé du titre, pour lier <title>/<desc> au SVG
// via aria-labelledby/aria-describedby sans hook React (composants Server).
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "chart"
  );
}

// Description textuelle complète des données, pour le <desc> SVG — garde le
// graphique lisible aux lecteurs d'écran malgré le zéro-JS et l'absence de
// tableau de données à côté.
export function describeChart(chart: ChartData): string {
  return chart.series
    .flatMap((s) => s.points)
    .map((p) => `${p.label} : ${p.value}${chart.unit ? ` ${chart.unit}` : ""}`)
    .join(". ");
}
