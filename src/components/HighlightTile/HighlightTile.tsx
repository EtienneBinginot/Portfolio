import type { Highlight } from "@/lib/schema";
import { Link } from "@/i18n/navigation";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import styles from "./HighlightTile.module.scss";

type HighlightTileProps = Highlight & {
  className?: string;
};

export default function HighlightTile({
  value,
  label,
  context,
  href,
  className,
}: HighlightTileProps) {
  return (
    <Link
      href={href}
      className={[styles.link, className].filter(Boolean).join(" ")}
    >
      <PixelBorder className={styles.frame}>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
        <p className={styles.context}>{context}</p>
      </PixelBorder>
    </Link>
  );
}
