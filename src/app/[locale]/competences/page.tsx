import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SkillsList from "@/components/SkillsList/SkillsList";
import Chart from "@/components/Chart/Chart";
import { getData } from "@/lib/data";
import { routing, type LocaleParams } from "@/i18n/routing";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import styles from "./page.module.scss";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "CompetencesPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, "/competences"),
      languages: localeAlternates("/competences"),
    },
    openGraph: { title, description, url: absoluteUrl(locale, "/competences") },
    twitter: { title, description },
  };
}

export default async function CompetencesPage({
  params,
}: {
  params: LocaleParams;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [t, tChart, data] = await Promise.all([
    getTranslations("CompetencesPage"),
    getTranslations("Chart"),
    getData(locale),
  ]);
  const rootMe = data.rootMe;

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>{t("heading")}</h1>

      <section className={styles.section} aria-labelledby="skills-heading">
        <h2 id="skills-heading" className={styles.sectionTitle}>
          {t("skillsHeading")}
        </h2>
        <SkillsList
          skills={data.skills}
          projects={data.projects}
          cases={data.cases}
        />
      </section>

      {rootMe && (
        <section className={styles.section} aria-labelledby="rootme-heading">
          <h2 id="rootme-heading" className={styles.sectionTitle}>
            {t("rootMeHeading")}
          </h2>

          <Chart
            chart={rootMe.distribution}
            logScaleLabel={tChart("logScale")}
            highlightLabel={t("rootMeHighlightLabel")}
            otherLabel={t("rootMeOtherLabel")}
          />

          {rootMe.timeseries && (
            <Chart
              chart={rootMe.timeseries}
              logScaleLabel={tChart("logScale")}
            />
          )}

          <p className={styles.rootMeLegend}>
            {t("rootMeRecordedAt", { date: rootMe.recordedAt })}
            {" — "}
            <a href={rootMe.profileUrl} target="_blank" rel="noreferrer">
              {t("rootMeProfileLabel")}
            </a>
          </p>

          <p className={styles.prose}>{t("rootMeNoWriteups")}</p>

          {rootMe.writeups.length > 0 && (
            <div className={styles.writeups}>
              <h3 className={styles.sectionTitle}>
                {t("rootMeWriteupsHeading")}
              </h3>
              <ul className={styles.writeupsList}>
                {rootMe.writeups.map((writeup) => (
                  <li key={writeup.href}>
                    <a href={writeup.href} target="_blank" rel="noreferrer">
                      {writeup.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
