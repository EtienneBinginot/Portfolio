import PixelButton from "@/components/PixelButton/PixelButton";
import MetricBlock from "@/components/MetricBlock/MetricBlock";
import Chart from "@/components/Chart/Chart";
import { data } from "@/lib/data";
import type { Chart as ChartData } from "@/lib/schema";
import styles from "./page.module.scss";

// Démo locale : la distribution n'a pas de projet/cas dédié dans data.json
// (chaque fiche ne porte qu'un seul chart), même précédent que PALETTE
// ci-dessous pour du contenu de démonstration hors modèle de données.
const DISTRIBUTION_DEMO: ChartData = {
  type: "distribution",
  title: "[placeholder] distribution des temps de réponse",
  unit: "ms",
  scale: "linear",
  caption: "Source : placeholder — date de mesure : 2026-09-01",
  source: "placeholder",
  series: [
    {
      name: "temps de réponse",
      points: [
        { label: "0-50", value: 4 },
        { label: "50-100", value: 12 },
        { label: "100-150", value: 27 },
        { label: "150-200", value: 15 },
        { label: "200-250", value: 6 },
        { label: "250+", value: 2 },
      ],
    },
  ],
};

const PALETTE = [
  { name: "--bg", var: "var(--bg)" },
  { name: "--surface", var: "var(--surface)" },
  { name: "--ink", var: "var(--ink)" },
  { name: "--text", var: "var(--text)" },
  { name: "--text-muted", var: "var(--text-muted)" },
  { name: "--accent-green", var: "var(--accent-green)" },
  { name: "--accent-blue", var: "var(--accent-blue)" },
  { name: "--accent-cyan", var: "var(--accent-cyan)" },
];

export default function Home() {
  const metric = data.projects[0]?.metrics[0];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>
          Portfolio — Phase 2 / Composants de données
        </span>
        <h1 className={styles.title}>{data.meta.name}</h1>
        <p className={styles.tagline}>{data.meta.tagline}</p>
      </section>

      <section className={styles.section} aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className={styles.sectionTitle}>
          Bloc chiffre (MetricBlock)
        </h2>
        <p className={styles.sectionNote}>
          Aucun chiffre n&apos;est affiché sans méthode de mesure ni date — la
          règle est imposée par le schéma Zod, pas seulement documentée.
        </p>
        <div className={styles.metricGrid}>
          {metric && <MetricBlock {...metric} />}
          <MetricBlock
            value="4/8px"
            label="grille d'espacement"
            method="PixelBorder, variante contour épais"
            measuredAt="Phase 1"
            fill="var(--bg)"
            thick
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className={styles.sectionTitle}>
          Boutons (PixelButton)
        </h2>
        <p className={styles.sectionNote}>
          Relief à deux couleurs plates sur les bords, jamais de box-shadow
          flou. Le hover permute entre deux tons plats du même ramp.
        </p>
        <div className={styles.buttonRow}>
          <PixelButton>Action principale</PixelButton>
          <PixelButton variant="secondary">Action secondaire</PixelButton>
          <PixelButton disabled>Désactivé</PixelButton>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="charts-heading">
        <h2 id="charts-heading" className={styles.sectionTitle}>
          Graphiques (Chart)
        </h2>
        <p className={styles.sectionNote}>
          Rendu 100% côté serveur, zéro JS client : SVG en aplats, coordonnées
          alignées sur la grille 4px, shape-rendering: crispEdges.
          L&apos;échelle logarithmique est signalée explicitement (badge +
          suffixe d&apos;axe) quand elle est utilisée.
        </p>
        <div className={styles.chartGrid}>
          {data.projects[0]?.chart && <Chart chart={data.projects[0].chart} />}
          {data.cases[0]?.chart && <Chart chart={data.cases[0].chart} />}
          <Chart chart={DISTRIBUTION_DEMO} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="palette-heading">
        <h2 id="palette-heading" className={styles.sectionTitle}>
          Palette forêt / lagon
        </h2>
        <div className={styles.palette}>
          {PALETTE.map((color) => (
            <div key={color.name} className={styles.swatch}>
              <div
                className={styles.swatchColor}
                style={{ "--swatch-color": color.var } as React.CSSProperties}
              />
              <span className={styles.swatchLabel}>{color.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="type-heading">
        <h2 id="type-heading" className={styles.sectionTitle}>
          Spécimen typographique
        </h2>
        <div className={styles.typeSpecimen}>
          <span className={styles.typePixel}>
            Silkscreen — titres, UI, navigation
          </span>
          <span className={styles.typeMono}>
            1 234,56 — IBM Plex Mono, tabular-nums
          </span>
          <p className={styles.typeRead}>
            Inter — police de lecture pour la prose et les write-ups, mesure
            limitée à environ 70 caractères pour rester confortable sur les
            paragraphes longs.
          </p>
        </div>
      </section>
    </main>
  );
}
