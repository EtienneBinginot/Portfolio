import styles from "./Chart.module.scss";

type LegendItem = { label: string; color: string };

type LegendProps = { items: LegendItem[] };

// Légende à pastille de couleur partagée par BarCompare (une entrée par
// série) et Distribution (mise en évidence de deux catégories).
export default function Legend({ items }: LegendProps) {
  if (items.length === 0) return null;

  return (
    <ul className={styles.legend}>
      {items.map((item) => (
        <li key={item.label} className={styles.legendItem}>
          <span
            className={styles.swatch}
            style={{ "--swatch-color": item.color } as React.CSSProperties}
          />
          <span className={styles.legendLabel}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
