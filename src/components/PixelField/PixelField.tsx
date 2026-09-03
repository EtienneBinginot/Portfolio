"use client";

import { useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./PixelField.module.scss";

type Accent = "green" | "blue" | "cyan";
type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type Density = "sparse" | "default";

type PixelFieldProps = {
  /** Un seul accent par instance — jamais mélangé (règle "un accent par
   * zone" du plan de rework). */
  accent: Accent;
  /** Coin/bord de page auquel le cluster de blocs est ancré. */
  corner?: Corner;
  /** Nombre de blocs du cluster. "sparse" pour les zones où la texture doit
   * rester en retrait. */
  density?: Density;
  className?: string;
};

type Tone = "a" | "b" | "accent";

type BlockDef = {
  /** Taille en px, multiples de la grille 4/8px. */
  w: number;
  h: number;
  /** Décalage depuis le coin ancré (axe horizontal/vertical), en px. */
  x: number;
  y: number;
  tone: Tone;
  /** Facteur de profondeur du parallax pointeur (0-1) : les blocs "proches"
   * bougent plus que les blocs "loin" pour un effet de couches bon marché. */
  depth: number;
};

// Cluster de base (8 blocs), déclaré dans le référentiel du coin ancré :
// x grandit "vers l'intérieur" horizontalement, y grandit "vers l'intérieur"
// verticalement. density="sparse" n'en garde qu'une partie (voir
// SPARSE_INDICES) plutôt que de dupliquer une seconde liste.
const BASE_BLOCKS: BlockDef[] = [
  { w: 64, h: 64, x: 0, y: 0, tone: "a", depth: 0.5 },
  { w: 32, h: 32, x: 80, y: 16, tone: "b", depth: 0.8 },
  { w: 24, h: 48, x: 8, y: 88, tone: "accent", depth: 1 },
  { w: 48, h: 24, x: 104, y: 64, tone: "a", depth: 0.4 },
  { w: 16, h: 16, x: 48, y: 120, tone: "b", depth: 0.9 },
  { w: 32, h: 16, x: 136, y: 8, tone: "a", depth: 0.65 },
  { w: 16, h: 32, x: 0, y: 144, tone: "b", depth: 0.55 },
  { w: 24, h: 24, x: 168, y: 72, tone: "accent", depth: 0.85 },
];

const SPARSE_INDICES = [0, 2, 4, 6];

// Traqueur de pointeur partagé par toutes les instances de PixelField
// (jusqu'à 2-3 montées simultanément par page) : un seul listener
// pointermove + une seule boucle rAF pour toute la page, pas un par
// instance. Écrit --pointer-x/--pointer-y sur <html> plutôt que sur chaque
// racine d'instance — ces custom properties héritent nativement dans le
// DOM, donc chaque .block de chaque instance les lit déjà par la cascade
// (voir PixelField.module.scss) sans qu'aucune instance n'ait à les reposer
// elle-même. Compteur de références : le listener ne démarre qu'à la
// première instance montée et s'arrête à la dernière démontée.
let pointerSubscribers = 0;
let stopPointerTracking: (() => void) | null = null;

function subscribePointer(): () => void {
  pointerSubscribers += 1;

  if (pointerSubscribers === 1) {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (finePointer && !reduced) {
      const root = document.documentElement;
      let rafId: number | null = null;
      let pendingX = 0;
      let pendingY = 0;

      const applyPointer = () => {
        rafId = null;
        root.style.setProperty("--pointer-x", pendingX.toFixed(3));
        root.style.setProperty("--pointer-y", pendingY.toFixed(3));
      };

      // Normalisé env. -1..1 par rapport au centre du viewport.
      const handlePointerMove = (event: PointerEvent) => {
        pendingX = (event.clientX / window.innerWidth) * 2 - 1;
        pendingY = (event.clientY / window.innerHeight) * 2 - 1;
        if (rafId === null) {
          rafId = window.requestAnimationFrame(applyPointer);
        }
      };

      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      stopPointerTracking = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
        root.style.removeProperty("--pointer-x");
        root.style.removeProperty("--pointer-y");
      };
    }
  }

  return () => {
    pointerSubscribers = Math.max(0, pointerSubscribers - 1);
    if (pointerSubscribers === 0 && stopPointerTracking) {
      stopPointerTracking();
      stopPointerTracking = null;
    }
  };
}

function toneToVar(tone: Tone, accent: Accent): string {
  if (tone === "accent") return `var(--accent-${accent})`;
  return tone === "a" ? "var(--block-a)" : "var(--block-b)";
}

function positionStyle(corner: Corner, block: BlockDef): CSSProperties {
  const horizontal =
    corner === "top-left" || corner === "bottom-left"
      ? { left: block.x }
      : { right: block.x };
  const vertical =
    corner === "top-left" || corner === "top-right"
      ? { top: block.y }
      : { bottom: block.y };

  return {
    ...horizontal,
    ...vertical,
    width: block.w,
    height: block.h,
  };
}

// Cluster décoratif de gros blocs pixel, partagé par les pages qui veulent
// de la texture de fond (hero, rails de section) — voir _colors.scss pour
// la rampe --block-a/--block-b dédiée. Deux mouvements sanctionnés
// s'appliquent ici (voir _motion.scss) : une dérive d'ambiance très lente en
// CSS pur (@keyframes, steps()) et un léger parallax pointeur en JS vanilla,
// tous deux purement décoratifs et coupés sous prefers-reduced-motion.
export default function PixelField({
  accent,
  corner = "top-right",
  density = "default",
  className,
}: PixelFieldProps) {
  const blocks = useMemo(() => {
    const indices =
      density === "sparse"
        ? SPARSE_INDICES
        : BASE_BLOCKS.map((_, index) => index);
    return indices.map((index) => BASE_BLOCKS[index]);
  }, [density]);

  useEffect(() => subscribePointer(), []);

  return (
    <div className={cx(styles.field, className)} aria-hidden="true">
      {blocks.map((block, index) => (
        <span
          key={`${block.x}-${block.y}-${block.tone}`}
          className={styles.slot}
          style={{
            ...positionStyle(corner, block),
            animationDelay: `${-(index * 7)}s`,
          }}
        >
          <span
            className={styles.block}
            style={
              {
                background: toneToVar(block.tone, accent),
                "--field-depth": block.depth,
              } as CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}
