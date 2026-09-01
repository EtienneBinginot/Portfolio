import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(import.meta.dirname, "src") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // Les tests unitaires vérifient le comportement des composants, pas le
    // rendu visuel (déjà validé manuellement via les captures Playwright) :
    // les imports *.scss/*.css sont remplacés par des chaînes vides plutôt
    // que compilés, ce qui éviterait aussi de devoir résoudre l'alias
    // "@/styles/tokens" utilisé dans les *.module.scss depuis Vite.
    css: false,
  },
});
