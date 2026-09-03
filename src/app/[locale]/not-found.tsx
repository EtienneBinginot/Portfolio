import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import pixelButtonStyles from "@/components/PixelButton/PixelButton.module.scss";
import styles from "./not-found.module.scss";

// Même remarque que ci-dessous pour NotFound() : getTranslations() sans
// locale explicite résout la locale de la route courante.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFoundPage");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

// Le layout [locale] a déjà appelé setRequestLocale(locale) avant de rendre
// ce segment (notFound() ne court-circuite que le rendu de la page, pas le
// layout qui l'englobe) — getTranslations() sans locale explicite résout
// donc bien la locale de la route courante, vérifié manuellement sur
// /fr/projets/does-not-exist et /en/projets/does-not-exist.
export default async function NotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <main className={styles.main}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.description}>{t("description")}</p>
      <Link href="/" className={pixelButtonStyles.button}>
        {t("homeLabel")}
      </Link>
    </main>
  );
}
