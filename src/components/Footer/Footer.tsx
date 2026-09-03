import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import ContactLinks from "@/components/ContactLinks/ContactLinks";
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
        <ContactLinks
          className={styles.links}
          email={data.meta.email}
          github={data.meta.github}
          linkedin={data.meta.linkedin}
          emailLabel={t("contact")}
          githubLabel="GitHub"
          linkedinLabel="LinkedIn"
        />
        <span className={styles.meta}>
          {t("lastUpdated", { date: lastUpdated })}
        </span>
      </div>
    </footer>
  );
}
