import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import styles from "./Footer.module.scss";
import { getData } from "@/lib/data";
import type { Locale } from "@/i18n/routing";

export default async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Footer");
  const format = await getFormatter();
  const data = await getData(locale);

  // Évaluée au rendu : reflète la date de génération du site, pas la date
  // de visite.
  const lastUpdated = format.dateTime(new Date(), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>
          {data.meta.name} — {data.meta.role}
        </span>
        <ul className={styles.links}>
          <li>
            <a href={`mailto:${data.meta.email}`}>{t("contact")}</a>
          </li>
          <li>
            <a href={data.meta.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={data.meta.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
        <span className={styles.meta}>
          {t("lastUpdated", { date: lastUpdated })}
        </span>
      </div>
    </footer>
  );
}
