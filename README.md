# Portfolio

Site vitrine personnel orienté « preuve mesurée » — direction artistique
pixel art non décorative (palette forêt/lagon, coins en escalier, relief à
deux tons plats, dithering encadré). Voir la page Notion _Projets /
Portfolio_ pour la vision complète et le modèle de données.

**État actuel : Phase 1 — Socle.** Le contenu réel (Phase 0, dans Notion)
n'est pas encore rédigé : `src/data/data.json` contient des données
d'exemple explicitement marquées `[placeholder]`, valides selon le schéma
mais à remplacer avant mise en ligne.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript, sans Tailwind
- SCSS en CSS Modules (un fichier par composant), jetons de design en
  variables CSS globales (`src/styles/tokens/`, `src/styles/globals.scss`)
- Zod pour valider `data.json` — le build échoue si une métrique n'a pas de
  méthode/date de mesure, ou si une compétence n'a pas de preuve liée
- Polices : Silkscreen (pixel — titres/chiffres/UI/nav), Inter (lecture),
  IBM Plex Mono (chiffres, `tabular-nums`), chargées via `next/font/google`

## Développement

```bash
npm install
npm run dev           # http://localhost:3000
npm run build          # valide data.json (prebuild) puis build de production
npm run lint
npm run format          # Prettier --write
npm run format:check     # Prettier --check (utilisé en CI)
npm test                  # Vitest
```

Avant de considérer une tâche terminée, faire passer le skill
`quality-gate` (`.claude/skills/quality-gate/SKILL.md`) : `/simplify` puis
format, lint, test, build, dans cet ordre. La CI GitHub Actions
(`.github/workflows/ci.yml`) rejoue format:check/lint/test/build sur chaque
pull request.

## Structure

```
.claude/skills/quality-gate/  # gate qualité (simplify, format, lint, test, build)
.github/workflows/ci.yml       # CI : format:check, lint, test, build sur chaque PR
src/
  app/                 # routes App Router
  components/          # un dossier par composant : Component.tsx + Component.module.scss + Component.test.tsx
  styles/
    globals.scss       # reset + :root { --var } généré depuis les jetons
    tokens/             # SCSS : couleurs, spacing, typographie, bordures, mixins
  lib/
    schema.ts           # schéma Zod de data.json (+ schema.test.ts)
    data.ts              # data.json parsé et validé
  data/
    data.json             # contenu du site — placeholder tant que la Phase 0 n'est pas faite
scripts/
  validate-data.ts        # validation Zod en CLI, branchée sur "prebuild"
test/
  setup.ts                 # setup Vitest (jest-dom, cleanup)
```

## Règles de la direction artistique (rappel)

- Pas de `border-radius` sur les éléments pixel art : coins en escalier
  (`clip-path`, mixin `staircase-corners`)
- Pas de `box-shadow` flou : relief simulé par deux couleurs plates
  (mixin `two-tone-relief`)
- Dithering autorisé uniquement entre teintes proches d'un même ramp, sur
  des éléments statiques — jamais entre fond sombre et accent vif, jamais
  sur l'interactif (détail dans `src/styles/tokens/_colors.scss`)
