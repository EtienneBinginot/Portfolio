import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PixelButton from "@/components/PixelButton/PixelButton";
import MetricBlock from "@/components/MetricBlock/MetricBlock";
import Chart from "@/components/Chart/Chart";
import { getData } from "@/lib/data";
import type { Chart as ChartData } from "@/lib/schema";
import { routing, type LocaleParams } from "@/i18n/routing";
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

export default async function Home({ params }: { params: LocaleParams }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  const data = await getData(locale);
  const metric = data.projects[0]?.metrics[0];

  // Démo locale : la distribution n'a pas de projet/cas dédié dans data.json
  // (chaque fiche ne porte qu'un seul chart), même précédent que PALETTE
  // ci-dessous pour du contenu de démonstration hors modèle de données.
  const distributionDemo: ChartData = {
    type: "distribution",
    title: t("distributionDemoTitle"),
    unit: "ms",
    scale: "linear",
    caption: t("distributionDemoCaption"),
    source: "placeholder",
    series: [
      {
        name: t("distributionSeriesName"),
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

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h1 className={styles.title}>{data.meta.name}</h1>
        <p className={styles.tagline}>{data.meta.tagline}</p>
      </section>

      <section className={styles.section} aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className={styles.sectionTitle}>
          {t("metricsHeading")}
        </h2>
        <p className={styles.sectionNote}>{t("metricsNote")}</p>
        <div className={styles.metricGrid}>
          {metric && <MetricBlock {...metric} />}
          <MetricBlock
            value={t("spacingValue")}
            label={t("spacingLabel")}
            method={t("spacingMethod")}
            measuredAt={t("spacingMeasuredAt")}
            fill="var(--bg)"
            thick
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className={styles.sectionTitle}>
          {t("buttonsHeading")}
        </h2>
        <p className={styles.sectionNote}>{t("buttonsNote")}</p>
        <div className={styles.buttonRow}>
          <PixelButton>{t("buttonPrimary")}</PixelButton>
          <PixelButton variant="secondary">{t("buttonSecondary")}</PixelButton>
          <PixelButton disabled>{t("buttonDisabled")}</PixelButton>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="charts-heading">
        <h2 id="charts-heading" className={styles.sectionTitle}>
          {t("chartsHeading")}
        </h2>
        <p className={styles.sectionNote}>{t("chartsNote")}</p>
        <div className={styles.chartGrid}>
          {data.projects[0]?.chart && <Chart chart={data.projects[0].chart} />}
          {data.cases[0]?.chart && <Chart chart={data.cases[0].chart} />}
          <Chart chart={distributionDemo} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="palette-heading">
        <h2 id="palette-heading" className={styles.sectionTitle}>
          {t("paletteHeading")}
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
          {t("typeHeading")}
        </h2>
        <div className={styles.typeSpecimen}>
          <span className={styles.typePixel}>{t("typePixelLabel")}</span>
          <span className={styles.typeMono}>{t("typeMonoLabel")}</span>
          <p className={styles.typeRead}>{t("typeReadSample")}</p>
        </div>
      </section>
    </main>
  );
}
