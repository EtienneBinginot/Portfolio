import prettierConfig from "eslint-config-prettier";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // eslint-config-next 16 fournit directement des configs flat natives ;
  // passer par `FlatCompat.extends("next/core-web-vitals", "next/typescript")`
  // (ancienne approche, encore nécessaire avec Next 15) fait planter ESLint 10
  // avec "TypeError: Converting circular structure to JSON" — le validateur
  // de @eslint/eslintrc s'étouffe sur la config flat auto-référentielle
  // d'eslint-plugin-react. Voir https://github.com/vercel/next.js/discussions/84596.
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Doit rester en dernier : désactive les règles ESLint stylistiques qui
  // entreraient en conflit avec le formatage Prettier.
  prettierConfig,
  {
    rules: {
      // Convention : préfixer par _ une variable volontairement inutilisée
      // (ex: destructuring pour omettre un champ dans un test).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
