import type { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import styles from "./Badge.module.scss";

type BadgeProps = {
  as?: "span" | "button";
  active?: boolean;
} & HTMLAttributes<HTMLElement>;

// Badge partagé (ExperienceCard, filtre d'interventions, fiche intervention).
// `as="button"` ajoute la sémantique interactive (aria-pressed, état actif)
// nécessaire aux contrôles de filtre ; `as="span"` (défaut) reste un badge
// d'affichage statique.
export default function Badge({
  as = "span",
  active,
  className,
  ...rest
}: BadgeProps) {
  const classes = cx(styles.badge, active && styles.active, className);

  if (as === "button") {
    return (
      <button
        type="button"
        aria-pressed={active}
        className={classes}
        {...rest}
      />
    );
  }

  return <span className={classes} {...rest} />;
}
