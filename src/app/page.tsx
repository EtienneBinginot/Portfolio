import PixelBorder from "@/components/PixelBorder/PixelBorder";
import PixelButton from "@/components/PixelButton/PixelButton";
import { data } from "@/lib/data";
import styles from "./page.module.scss";

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
        <span className={styles.eyebrow}>Portfolio — Phase 1 / Socle</span>
        <h1 className={styles.title}>{data.meta.name}</h1>
        <p className={styles.tagline}>{data.meta.tagline}</p>
      </section>

      <section className={styles.section} aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className={styles.sectionTitle}>
          Bloc chiffre (PixelBorder)
        </h2>
        <p className={styles.sectionNote}>
          Aucun chiffre n&apos;est affiché sans méthode de mesure ni date — la
          règle est imposée par le schéma Zod, pas seulement documentée.
        </p>
        <div className={styles.metricGrid}>
          {metric && (
            <PixelBorder>
              <span className={styles.metricValue}>
                {metric.value}
                {metric.unit ? ` ${metric.unit}` : ""}
              </span>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricMethod}>
                {metric.method} — {metric.measuredAt}
              </span>
            </PixelBorder>
          )}
          <PixelBorder fill="var(--bg)" thick>
            <span className={styles.metricValue}>4/8px</span>
            <span className={styles.metricLabel}>grille d&apos;espacement</span>
            <span className={styles.metricMethod}>
              PixelBorder, variante contour épais
            </span>
          </PixelBorder>
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
