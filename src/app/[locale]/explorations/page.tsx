import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ExplorationEntry from "@/components/ExplorationEntry/ExplorationEntry";
import { getData } from "@/lib/data";
import { routing, type LocaleParams } from "@/i18n/routing";
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
  const t = await getTranslations({ locale, namespace: "ExplorationsPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ExplorationsPage({
  params,
}: {
  params: LocaleParams;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [t, data] = await Promise.all([
    getTranslations("ExplorationsPage"),
    getData(locale),
  ]);

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>{t("heading")}</h1>
      <div className={styles.list}>
        {data.explorations.map((exploration) => (
          <ExplorationEntry key={exploration.id} exploration={exploration} />
        ))}
      </div>
    </main>
  );
}
