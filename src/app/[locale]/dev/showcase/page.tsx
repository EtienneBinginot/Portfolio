import { notFound } from "next/navigation";
import type {
  Case,
  Chart as ChartData,
  Exploration,
  Project,
} from "@/lib/schema";
import PixelBorder from "@/components/PixelBorder/PixelBorder";
import PixelButton from "@/components/PixelButton/PixelButton";
import Badge from "@/components/Badge/Badge";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ExperienceCard from "@/components/ExperienceCard/ExperienceCard";
import ExplorationEntry from "@/components/ExplorationEntry/ExplorationEntry";
import MetricBlock from "@/components/MetricBlock/MetricBlock";
import Chart from "@/components/Chart/Chart";
import PixelField from "@/components/PixelField/PixelField";
import styles from "./page.module.scss";

// Route de diagnostic Stage 1 : rend tous les primitives partagés côte à
// côte avec des données factices minimales, pour que les agents/validateurs
// des stages suivants puissent tout voir sur un seul écran sans crawler le
// vrai site. 404 en production (voir le garde ci-dessous) — jamais ajoutée
// à sitemap.ts/robots.ts.
export default function ShowcasePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const project: Project = {
    id: "showcase-project",
    title: "Projet de démonstration",
    summary: "Résumé factice pour la vitrine de composants.",
    problem: "Problème factice.",
    decisions: "Décisions factices.",
    stack: ["Next.js", "TypeScript", "SCSS"],
    featured: false,
    metrics: [
      {
        label: "Temps de chargement",
        value: "1.2",
        unit: "s",
        method: "Lighthouse",
        measuredAt: "2026-01",
      },
    ],
  };

  const intervention: Case = {
    id: "showcase-case",
    title: "Intervention de démonstration",
    period: "2026",
    context: "Contexte factice.",
    constraints: "Contraintes factices.",
    scope: "mission",
    myRole: "Rôle factice.",
    decisions: "Décisions factices.",
    featured: false,
    metrics: [
      {
        label: "Incidents évités",
        value: "3",
        method: "Suivi manuel",
        measuredAt: "2026-01",
      },
    ],
  };

  const exploration: Exploration = {
    id: "showcase-exploration",
    title: "Exploration de démonstration",
    period: "2026",
    summary: "Résumé factice pour la vitrine de composants.",
    metrics: [
      {
        label: "Score",
        value: "42",
        method: "Mesure factice",
        measuredAt: "2026-01",
      },
    ],
  };

  const chart: ChartData = {
    type: "bar-compare",
    title: "Graphique de démonstration",
    unit: "%",
    scale: "linear",
    caption: "Données factices — vitrine de composants.",
    source: "Fixture showcase",
    series: [
      {
        name: "Série A",
        points: [
          { label: "Q1", value: 12 },
          { label: "Q2", value: 18, highlight: true },
          { label: "Q3", value: 9 },
        ],
      },
    ],
  };

  return (
    <main className={styles.main}>
      <PixelField accent="green" corner="bottom-left" density="sparse" />
      <PixelField accent="cyan" corner="top-left" />

      <h1>Vitrine de composants (dev only)</h1>

      <section className={styles.section}>
        <h2>PixelBorder</h2>
        <div className={styles.row}>
          <PixelBorder>Contenu par défaut</PixelBorder>
          <PixelBorder thick sweepOnHover>
            Épais + balayage au survol
          </PixelBorder>
          <PixelBorder borderColor="var(--accent-cyan)" fill="var(--surface)">
            Contour personnalisé
          </PixelBorder>
        </div>
      </section>

      <section className={styles.section}>
        <h2>PixelButton</h2>
        <div className={styles.row}>
          <PixelButton>Primaire</PixelButton>
          <PixelButton variant="secondary">Secondaire</PixelButton>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Badge</h2>
        <div className={styles.row}>
          <Badge>Statique</Badge>
          <Badge as="button" active>
            Actif
          </Badge>
          <Badge as="button">Inactif</Badge>
        </div>
      </section>

      <section className={styles.section}>
        <h2>ProjectCard</h2>
        <div className={styles.row}>
          <ProjectCard project={project} />
          <ProjectCard project={project} variant="row" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>ExperienceCard</h2>
        <div className={styles.row}>
          <ExperienceCard case={intervention} scopeLabel="Mission" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>ExplorationEntry</h2>
        <div className={styles.row}>
          <ExplorationEntry exploration={exploration} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>MetricBlock</h2>
        <div className={styles.row}>
          <MetricBlock
            label="Latence P95"
            value="180"
            unit="ms"
            method="Mesure synthétique"
            measuredAt="2026-01"
          />
          <MetricBlock
            label="Latence P95"
            value="180"
            unit="ms"
            method="Mesure synthétique"
            measuredAt="2026-01"
            variant="inline"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Chart</h2>
        <div className={styles.row}>
          <Chart chart={chart} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>PixelField</h2>
        <p>
          Deux instances supplémentaires sont rendues plus haut sur cette page
          (accent=&quot;green&quot; en bas à gauche, accent=&quot;cyan&quot; en
          haut à gauche) en plus de l&apos;instance globale du layout racine
          (accent=&quot;blue&quot;, en haut à droite).
        </p>
      </section>
    </main>
  );
}
