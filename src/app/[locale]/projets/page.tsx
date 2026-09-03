import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import { getData } from "@/lib/data";
import { routing, type LocaleParams } from "@/i18n/routing";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { Link } from "@/i18n/navigation";
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
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, "/projets"),
      languages: localeAlternates("/projets"),
    },
    openGraph: { title, description, url: absoluteUrl(locale, "/projets") },
    twitter: { title, description },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: LocaleParams;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("ProjectsPage");
  const data = await getData(locale);

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>{t("heading")}</h1>
      <div className={styles.list}>
        {data.projects.map((project) => (
          <ProjectCard key={project.id} project={project} variant="row" />
        ))}
      </div>
      {/* Volontairement hors NAV_ITEMS/Navbar : les explorations sont un
          contenu secondaire, accessible depuis Projets plutôt que promu au
          même rang que Projets/Interventions/À propos dans la nav. */}
      <p className={styles.explorationsLink}>
        <Link href="/explorations">{t("explorationsLinkLabel")}</Link>
      </p>
    </main>
  );
}
