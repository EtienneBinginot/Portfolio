import styles from "./Footer.module.scss";
import { data } from "@/lib/data";

// Évaluée au build (page statique) : reflète la date de génération du site,
// pas la date de visite.
const lastUpdated = new Date().toLocaleDateString("fr-FR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>
          {data.meta.name} — {data.meta.role}
        </span>
        <ul className={styles.links}>
          <li>
            <a href={`mailto:${data.meta.email}`}>Contact</a>
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
        <span className={styles.meta}>Mise à jour : {lastUpdated}</span>
      </div>
    </footer>
  );
}
