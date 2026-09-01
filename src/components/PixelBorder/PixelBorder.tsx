import type { CSSProperties, ReactNode } from "react";
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
};

export default function PixelBorder({
  children,
  className,
  borderColor,
  fill,
  thick = false,
}: PixelBorderProps) {
  const style = {
    ...(borderColor ? { "--pixel-border-color": borderColor } : {}),
    ...(fill ? { "--pixel-fill": fill } : {}),
    ...(thick ? { "--pixel-border-width": "var(--border-width-thick)" } : {}),
  } as CSSProperties;

  return (
    <div className={[styles.frame, className].filter(Boolean).join(" ")} style={style}>
      <div className={styles.panel}>{children}</div>
    </div>
  );
}
