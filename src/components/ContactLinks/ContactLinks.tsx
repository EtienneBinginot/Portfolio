import { cx } from "@/lib/cx";
import styles from "./ContactLinks.module.scss";

type ContactLinksProps = {
  email: string;
  github: string;
  linkedin: string;
  emailLabel: string;
  githubLabel: string;
  linkedinLabel: string;
  className?: string;
};

// Triplet mail/GitHub/LinkedIn partagé par le Footer et la page À propos —
// même source (meta) et même logique de lien, seul l'habillage visuel change
// (via `className`, appliqué en plus de la structure de base de ce module).
export default function ContactLinks({
  email,
  github,
  linkedin,
  emailLabel,
  githubLabel,
  linkedinLabel,
  className,
}: ContactLinksProps) {
  return (
    <ul className={cx(styles.links, className)}>
      <li>
        <a href={`mailto:${email}`}>{emailLabel}</a>
      </li>
      <li>
        <a href={github} target="_blank" rel="noreferrer">
          {githubLabel}
        </a>
      </li>
      <li>
        <a href={linkedin} target="_blank" rel="noreferrer">
          {linkedinLabel}
        </a>
      </li>
    </ul>
  );
}
