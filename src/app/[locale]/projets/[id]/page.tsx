import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MetricBlock from "@/components/MetricBlock/MetricBlock";
import Chart from "@/components/Chart/Chart";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import { getData } from "@/lib/data";
import { getProjectWriteup } from "@/lib/mdx";
import { routing } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import styles from "./page.module.scss";

type ProjectPageParams = Promise<{ locale: string; id: string }>;

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      data: await getData(locale),
    })),
  );
  return perLocale.flatMap(({ locale, data }) =>
    data.projects.map((project) => ({ locale, id: project.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: ProjectPageParams;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const data = await getData(locale);
  const project = data.projects.find((p) => p.id === id);
  if (!project) {
    return {};
  }
  return {
    title: `${project.title} — Etienne Binginot`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: ProjectPageParams;
}) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [t, tChart, data] = await Promise.all([
    getTranslations("ProjectPage"),
    getTranslations("Chart"),
    getData(locale),
  ]);
  const project = data.projects.find((p) => p.id === id);
  if (!project) {
    notFound();
  }
  const logScaleLabel = tChart("logScale");
  const writeup = await getProjectWriteup(project, locale, logScaleLabel);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.summary}>{project.summary}</p>

        <ul className={styles.stack} aria-label={t("stackLabel")}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        {(project.repo || project.demo) && (
          <ul className={styles.links}>
            {project.repo && (
              <li>
                <a href={project.repo} target="_blank" rel="noreferrer">
                  {t("repoLabel")}
                </a>
              </li>
            )}
            {project.demo && (
              <li>
                <a href={project.demo} target="_blank" rel="noreferrer">
                  {t("demoLabel")}
                </a>
              </li>
            )}
          </ul>
        )}
      </header>

      <section className={styles.section} aria-labelledby="problem-heading">
        <h2
          id="problem-heading"
          className={cx(styles.sectionTitle, styles.sectionTitleNarrative)}
        >
          {t("problemHeading")}
        </h2>
        <p className={styles.prose}>{project.problem}</p>
      </section>

      <section className={styles.section} aria-labelledby="decisions-heading">
        <h2
          id="decisions-heading"
          className={cx(styles.sectionTitle, styles.sectionTitleNarrative)}
        >
          {t("decisionsHeading")}
        </h2>
        <p className={styles.prose}>{project.decisions}</p>
      </section>

      <section className={styles.section} aria-labelledby="metrics-heading">
        <h2
          id="metrics-heading"
          className={cx(styles.sectionTitle, styles.sectionTitleData)}
        >
          {t("metricsHeading")}
        </h2>
        <div className={styles.metricGrid}>
          {project.metrics.map((metric) => (
            <MetricBlock key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      {project.chart && (
        <section className={styles.section} aria-labelledby="chart-heading">
          <h2
            id="chart-heading"
            className={cx(styles.sectionTitle, styles.sectionTitleData)}
          >
            {t("chartHeading")}
          </h2>
          <Chart chart={project.chart} logScaleLabel={logScaleLabel} />
        </section>
      )}

      {writeup && (
        <section className={styles.section} aria-labelledby="writeup-heading">
          <h2
            id="writeup-heading"
            className={cx(styles.sectionTitle, styles.sectionTitleNarrative)}
          >
            {t("writeupHeading")}
          </h2>
          <PixelBorder className={styles.writeup}>{writeup}</PixelBorder>
        </section>
      )}

      {project.retrospective && (
        <section
          className={styles.section}
          aria-labelledby="retrospective-heading"
        >
          <h2
            id="retrospective-heading"
            className={cx(styles.sectionTitle, styles.sectionTitleNarrative)}
          >
            {t("retrospectiveHeading")}
          </h2>
          <p className={styles.prose}>{project.retrospective}</p>
        </section>
      )}
    </main>
  );
}
