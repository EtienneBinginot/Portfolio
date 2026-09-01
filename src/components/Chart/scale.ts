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
export const MARGIN = { top: 16, right: 16, bottom: 44, left: 44 };
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
  return [0, domainMax / 4, domainMax / 2, (domainMax * 3) / 4, domainMax];
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
