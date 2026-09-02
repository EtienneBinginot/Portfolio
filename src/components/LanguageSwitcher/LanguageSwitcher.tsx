"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import styles from "./LanguageSwitcher.module.scss";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const activeLocale = useLocale();
  const t = useTranslations("LanguageSwitcher");

  return (
    <ul className={styles.list} aria-label={t("label")}>
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale as Locale}
              className={cx(styles.link, isActive && styles.active)}
              aria-current={isActive ? "true" : undefined}
              aria-label={t(locale)}
            >
              {locale.toUpperCase()}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
