import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import pixelButtonStyles from "@/components/PixelButton/PixelButton.module.scss";
import HighlightTile from "@/components/HighlightTile/HighlightTile";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ExperienceCard from "@/components/ExperienceCard/ExperienceCard";
import JsonLd from "@/components/JsonLd/JsonLd";
import PixelField from "@/components/PixelField/PixelField";
import { getData } from "@/lib/data";
import { routing, type LocaleParams } from "@/i18n/routing";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { cx } from "@/lib/cx";
import styles from "./page.module.scss";

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, ""),
      languages: localeAlternates(""),
    },
    openGraph: { title, description, url: absoluteUrl(locale, "") },
    twitter: { title, description },
  };
}

export default async function Home({ params }: { params: LocaleParams }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [t, tScope, data] = await Promise.all([
    getTranslations("HomePage"),
    getTranslations("Scope"),
    getData(locale),
  ]);

  const featuredProjects = data.projects
    .filter((project) => project.featured)
    .slice(0, 3);
  const featuredCases = data.cases
    .filter((intervention) => intervention.featured)
    .slice(0, 2);

  return (
    <main className={styles.main}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: data.meta.name,
          jobTitle: data.meta.role,
          email: `mailto:${data.meta.email}`,
          url: absoluteUrl(locale, ""),
          sameAs: [data.meta.github, data.meta.linkedin],
        }}
      />
      <section className={styles.hero}>
        {/* Seule instance PixelField propre à cette page (budget Stage 3 :
            1 max) — accent cyan, resté libre par les 2 clusters globaux
            (bleu haut-droite, vert bas-gauche, voir layout.tsx). Coin
            haut-gauche = quasiment sous le nom en haut de page, densité
            sparse pour ne pas concurrencer le titre. */}
        <PixelField accent="cyan" corner="top-left" density="sparse" />
        <span className={styles.eyebrow}>{data.meta.lane}</span>
        <h1 className={styles.title}>{data.meta.name}</h1>
        <p className={styles.tagline}>{data.meta.tagline}</p>
      </section>

      <section className={styles.section} aria-labelledby="highlights-heading">
        <h2
          id="highlights-heading"
          className={cx(styles.sectionTitle, styles.sectionTitleData)}
        >
          {t("highlightsHeading")}
        </h2>
        <div className={styles.highlightGrid}>
          {data.highlights.map((highlight) => (
            <HighlightTile key={highlight.href} {...highlight} />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="projects-heading">
        <h2 id="projects-heading" className={styles.sectionTitle}>
          {t("projectsHeading")}
        </h2>
        <div className={styles.cardGrid}>
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="interventions-heading"
      >
        <h2 id="interventions-heading" className={styles.sectionTitle}>
          {t("interventionsHeading")}
        </h2>
        <div className={styles.cardGrid}>
          {featuredCases.map((intervention) => (
            <ExperienceCard
              key={intervention.id}
              case={intervention}
              scopeLabel={tScope(intervention.scope)}
            />
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <Link href="/projets" className={pixelButtonStyles.button}>
          {t("ctaLabel")}
        </Link>
      </section>
    </main>
  );
}
