import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

// Forme commune des `params` reçus par les layouts/pages sous
// src/app/[locale]/.
export type LocaleParams = Promise<{ locale: string }>;
