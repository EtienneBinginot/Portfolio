import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MetricBlock from "@/components/MetricBlock/MetricBlock";
import Chart from "@/components/Chart/Chart";
import Badge from "@/components/Badge/Badge";
import { getData } from "@/lib/data";
import { routing } from "@/i18n/routing";
import styles from "./page.module.scss";

type InterventionPageParams = Promise<{ locale: string; id: string }>;

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      data: await getData(locale),
    })),
  );
  return perLocale.flatMap(({ locale, data }) =>
    data.cases.map((intervention) => ({ locale, id: intervention.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: InterventionPageParams;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const data = await getData(locale);
  const intervention = data.cases.find((c) => c.id === id);
  if (!intervention) {
    return {};
  }
  return {
    title: `${intervention.title} — Etienne Binginot`,
    description: intervention.context,
  };
}

export default async function InterventionPage({
  params,
}: {
  params: InterventionPageParams;
}) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [t, tScope, data] = await Promise.all([
    getTranslations("InterventionPage"),
    getTranslations("Scope"),
    getData(locale),
  ]);
  const intervention = data.cases.find((c) => c.id === id);
  if (!intervention) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Badge>{tScope(intervention.scope)}</Badge>
        <h1 className={styles.title}>{intervention.title}</h1>
        <p className={styles.period}>
          {t("periodLabel")} — {intervention.period}
        </p>
      </header>

      <section className={styles.section} aria-labelledby="context-heading">
        <h2 id="context-heading" className={styles.sectionTitle}>
          {t("contextHeading")}
        </h2>
        <p className={styles.prose}>{intervention.context}</p>
      </section>

      <section className={styles.section} aria-labelledby="constraints-heading">
        <h2 id="constraints-heading" className={styles.sectionTitle}>
          {t("constraintsHeading")}
        </h2>
        <p className={styles.prose}>{intervention.constraints}</p>
      </section>

      <section className={styles.section} aria-labelledby="role-heading">
        <h2 id="role-heading" className={styles.sectionTitle}>
          {t("roleHeading")}
        </h2>
        <p className={styles.prose}>{intervention.myRole}</p>
      </section>

      <section className={styles.section} aria-labelledby="decisions-heading">
        <h2 id="decisions-heading" className={styles.sectionTitle}>
          {t("decisionsHeading")}
        </h2>
        <p className={styles.prose}>{intervention.decisions}</p>
      </section>

      <section className={styles.section} aria-labelledby="result-heading">
        <h2 id="result-heading" className={styles.sectionTitle}>
          {t("resultHeading")}
        </h2>
        <div className={styles.metricGrid}>
          {intervention.metrics.map((metric) => (
            <MetricBlock key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      {intervention.chart && (
        <section className={styles.section} aria-labelledby="chart-heading">
          <h2 id="chart-heading" className={styles.sectionTitle}>
            {t("chartHeading")}
          </h2>
          <Chart chart={intervention.chart} />
        </section>
      )}

      {intervention.retrospective && (
        <section
          className={styles.section}
          aria-labelledby="retrospective-heading"
        >
          <h2 id="retrospective-heading" className={styles.sectionTitle}>
            {t("retrospectiveHeading")}
          </h2>
          <p className={styles.prose}>{intervention.retrospective}</p>
        </section>
      )}
    </main>
  );
}
