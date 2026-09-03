import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MetricBlock from "@/components/MetricBlock/MetricBlock";
import Chart from "@/components/Chart/Chart";
import JsonLd from "@/components/JsonLd/JsonLd";
import { getData } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { cx } from "@/lib/cx";
import styles from "./page.module.scss";

type ExplorationPageParams = Promise<{ locale: string; id: string }>;

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      data: await getData(locale),
    })),
  );
  return perLocale.flatMap(({ locale, data }) =>
    data.explorations.map((exploration) => ({ locale, id: exploration.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: ExplorationPageParams;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const data = await getData(locale);
  const exploration = data.explorations.find((e) => e.id === id);
  if (!exploration) {
    return {};
  }
  const title = exploration.title;
  const description = exploration.summary;
  const path = `/explorations/${exploration.id}`;
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, path),
      languages: localeAlternates(path),
    },
    openGraph: { title, description, url: absoluteUrl(locale, path) },
    twitter: { title, description },
  };
}

export default async function ExplorationPage({
  params,
}: {
  params: ExplorationPageParams;
}) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [t, tChart, data] = await Promise.all([
    getTranslations("ExplorationPage"),
    getTranslations("Chart"),
    getData(locale),
  ]);
  const exploration = data.explorations.find((e) => e.id === id);
  if (!exploration) {
    notFound();
  }
  const logScaleLabel = tChart("logScale");

  return (
    <main className={styles.main}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: exploration.title,
          description: exploration.summary,
          url: absoluteUrl(locale, `/explorations/${exploration.id}`),
          author: { "@type": "Person", name: "Etienne Binginot" },
        }}
      />
      <header className={styles.header}>
        <h1 className={styles.title}>{exploration.title}</h1>
        <p className={styles.period}>
          {t("periodLabel")} — {exploration.period}
        </p>
        <p className={styles.summary}>{exploration.summary}</p>
        {exploration.repo && (
          <ul className={styles.links}>
            <li>
              <a href={exploration.repo} target="_blank" rel="noreferrer">
                {t("repoLabel")}
              </a>
            </li>
          </ul>
        )}
      </header>

      {exploration.metrics && exploration.metrics.length > 0 && (
        <section className={styles.section} aria-labelledby="metrics-heading">
          <h2
            id="metrics-heading"
            className={cx(styles.sectionTitle, styles.sectionTitleData)}
          >
            {t("metricsHeading")}
          </h2>
          <div className={styles.metricGrid}>
            {exploration.metrics.map((metric) => (
              <MetricBlock key={metric.label} {...metric} />
            ))}
          </div>
        </section>
      )}

      {exploration.chart && (
        <section className={styles.section} aria-labelledby="chart-heading">
          <h2
            id="chart-heading"
            className={cx(styles.sectionTitle, styles.sectionTitleData)}
          >
            {t("chartHeading")}
          </h2>
          <Chart chart={exploration.chart} logScaleLabel={logScaleLabel} />
        </section>
      )}
    </main>
  );
}
