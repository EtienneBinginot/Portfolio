import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./PixelBorder.module.scss";

type PixelBorderProps = {
  children: ReactNode;
  className?: string;
  /** Couleur du contour (var CSS ou couleur). Défaut : var(--ink). */
  borderColor?: string;
  /** Couleur de remplissage (var CSS ou couleur). Défaut : var(--surface). */
  fill?: string;
  /** Épaisseur du contour. Défaut : var(--border-width). */
  thick?: boolean;
  /** Balayage clip-path au survol, en paliers — opt-in explicite pour les
   * cartes cliquables (ProjectCard/ExperienceCard), pas une généralisation
   * à tout PixelBorder. S'ajoute au swap de --pixel-border-color existant
   * sans le remplacer. */
  sweepOnHover?: boolean;
};

export default function PixelBorder({
  children,
  className,
  borderColor,
  fill,
  thick = false,
  sweepOnHover = false,
}: PixelBorderProps) {
  const style = {
    ...(borderColor ? { "--pixel-border-color": borderColor } : {}),
    ...(fill ? { "--pixel-fill": fill } : {}),
    ...(thick ? { "--pixel-border-width": "var(--border-width-thick)" } : {}),
  } as CSSProperties;

  return (
    <div
      className={cx(styles.frame, sweepOnHover && styles.sweepable, className)}
      style={style}
    >
      <div className={styles.panel}>{children}</div>
    </div>
  );
}
