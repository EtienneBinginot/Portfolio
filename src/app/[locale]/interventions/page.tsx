import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import InterventionsFilter from "@/components/InterventionsFilter/InterventionsFilter";
import { getData } from "@/lib/data";
import { CaseScopeSchema, type CaseScope } from "@/lib/schema";
import { routing, type LocaleParams } from "@/i18n/routing";
import styles from "./page.module.scss";

const SCOPES = CaseScopeSchema.options;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "InterventionsPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function InterventionsPage({
  params,
}: {
  params: LocaleParams;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [t, tScope, data] = await Promise.all([
    getTranslations("InterventionsPage"),
    getTranslations("Scope"),
    getData(locale),
  ]);
  const scopeLabels = Object.fromEntries(
    SCOPES.map((scope) => [scope, tScope(scope)]),
  ) as Record<CaseScope, string>;

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>{t("heading")}</h1>
      <InterventionsFilter
        cases={data.cases}
        scopes={[...SCOPES]}
        scopeLabels={scopeLabels}
        allLabel={t("filterAllLabel")}
        groupLabel={t("filterGroupLabel")}
        noResultsLabel={t("noResultsLabel")}
      />
    </main>
  );
}
