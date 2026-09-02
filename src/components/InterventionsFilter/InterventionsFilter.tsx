"use client";

import { useState } from "react";
import type { Case, CaseScope } from "@/lib/schema";
import ExperienceCard from "@/components/ExperienceCard/ExperienceCard";
import Badge from "@/components/Badge/Badge";
import styles from "./InterventionsFilter.module.scss";

type ScopeFilter = CaseScope | "all";

type InterventionsFilterProps = {
  cases: Case[];
  scopes: CaseScope[];
  scopeLabels: Record<CaseScope, string>;
  allLabel: string;
  groupLabel: string;
  noResultsLabel: string;
};

// Filtrage côté client, état local : le jeu de cas est petit et rien
// n'exige de lien partageable — voir le plan de la Phase 5 pour le choix
// écarté (search params).
export default function InterventionsFilter({
  cases,
  scopes,
  scopeLabels,
  allLabel,
  groupLabel,
  noResultsLabel,
}: InterventionsFilterProps) {
  const [activeScope, setActiveScope] = useState<ScopeFilter>("all");
  const filtered =
    activeScope === "all"
      ? cases
      : cases.filter((intervention) => intervention.scope === activeScope);

  return (
    <>
      <div className={styles.filterBar} role="group" aria-label={groupLabel}>
        <Badge
          as="button"
          active={activeScope === "all"}
          onClick={() => setActiveScope("all")}
        >
          {allLabel}
        </Badge>
        {scopes.map((scope) => (
          <Badge
            key={scope}
            as="button"
            active={activeScope === scope}
            onClick={() => setActiveScope(scope)}
          >
            {scopeLabels[scope]}
          </Badge>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className={styles.cardGrid}>
          {filtered.map((intervention) => (
            <ExperienceCard
              key={intervention.id}
              case={intervention}
              scopeLabel={scopeLabels[intervention.scope]}
            />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>{noResultsLabel}</p>
      )}
    </>
  );
}
