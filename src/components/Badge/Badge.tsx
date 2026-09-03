import type { ComponentProps, HTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";
import { cx } from "@/lib/cx";
import styles from "./Badge.module.scss";

type BadgeProps = {
  as?: "span" | "button";
  active?: boolean;
} & HTMLAttributes<HTMLElement>;

type BadgeLinkProps = {
  as: "link";
  active?: boolean;
} & ComponentProps<typeof Link>;

// Badge partagé (ExperienceCard, filtre d'interventions, fiche intervention,
// liste de compétences). `as="button"` ajoute la sémantique interactive
// (aria-pressed, état actif) nécessaire aux contrôles de filtre ; `as="link"`
// rend un lien de navigation interne (compétence → preuve), via le `Link`
// i18n pour garder le préfixe de locale ; `as="span"` (défaut) reste un
// badge d'affichage statique.
//
// On discrimine sur `props.as` avant toute déstructuration : TypeScript ne
// peut affiner l'union `BadgeProps | BadgeLinkProps` qu'à cette condition,
// ce qui évite les casts `as ...` sur `rest` dans chaque branche.
export default function Badge(props: BadgeProps | BadgeLinkProps) {
  const classes = cx(
    styles.badge,
    props.active && styles.active,
    props.className,
  );

  if (props.as === "link") {
    const { as: _as, active: _active, className: _className, ...rest } = props;
    return <Link className={classes} {...rest} />;
  }

  const { as = "span", active, className: _className, ...rest } = props;

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
