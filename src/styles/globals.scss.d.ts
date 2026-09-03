// Déclaration ambiante pour l'import "side-effect" de globals.scss
// (import "@/styles/globals.scss";) dans src/app/[locale]/layout.tsx.
//
// TypeScript >= 6 active `noUncheckedSideEffectImports` par défaut : un
// import qui ne récupère aucun export nommé/par défaut doit correspondre à
// une déclaration de module connue. Next.js fournit déjà une déclaration
// typée pour les fichiers `*.module.scss` (CSS Modules, voir
// node_modules/next/types/global.d.ts) mais pas pour un import brut de
// feuille de style globale — d'où cette déclaration minimale.
declare module "*.scss";
