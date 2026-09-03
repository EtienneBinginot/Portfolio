import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Badge from "@/components/Badge/Badge";
import ContactLinks from "@/components/ContactLinks/ContactLinks";
import pixelButtonStyles from "@/components/PixelButton/PixelButton.module.scss";
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
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, "/about"),
      languages: localeAlternates("/about"),
    },
    openGraph: { title, description, url: absoluteUrl(locale, "/about") },
    twitter: { title, description },
  };
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [t, data] = await Promise.all([
    getTranslations("AboutPage"),
    getData(locale),
  ]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("heading")}</h1>
        <p className={styles.prose}>{data.about.bio}</p>
        <a
          href={data.about.cvUrl}
          download
          className={pixelButtonStyles.button}
        >
          {t("cvLabel")}
        </a>
      </header>

      <section className={styles.section} aria-labelledby="formation-heading">
        <h2 id="formation-heading" className={styles.sectionTitle}>
          {t("formationHeading")}
        </h2>
        <ul className={styles.formationList}>
          {data.about.formation.map((entry) => (
            <li key={`${entry.period}-${entry.label}`}>
              <span className={styles.formationPeriod}>{entry.period}</span>
              <span className={styles.formationLabel}>{entry.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="interests-heading">
        <h2 id="interests-heading" className={styles.sectionTitle}>
          {t("interestsHeading")}
        </h2>
        <ul className={styles.badgeList}>
          {data.about.interests.map((interest) => (
            <li key={interest}>
              <Badge>{interest}</Badge>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="contact-heading">
        <h2 id="contact-heading" className={styles.sectionTitle}>
          {t("contactHeading")}
        </h2>
        <ContactLinks
          className={styles.links}
          email={data.meta.email}
          github={data.meta.github}
          linkedin={data.meta.linkedin}
          emailLabel={t("emailLabel")}
          githubLabel={t("githubLabel")}
          linkedinLabel={t("linkedinLabel")}
        />
      </section>
    </main>
  );
}
