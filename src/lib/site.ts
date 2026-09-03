import { routing, type Locale } from "@/i18n/routing";

// URL absolue par défaut, utilisée tant que NEXT_PUBLIC_SITE_URL n'est pas
// définie (avant mise en ligne). Voir .env.example.
const DEFAULT_SITE_URL = "https://etienne-binginot.example";

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL,
);
export const SITE_NAME = "Etienne Binginot";

// Construit l'URL absolue d'une page pour une locale donnée. `path` est
// vide (accueil) ou commence par "/" — jamais de slash final.
export function absoluteUrl(locale: Locale, path = ""): string {
  const normalized = path === "/" ? "" : path;
  return new URL(`/${locale}${normalized}`, SITE_URL).toString();
}

// Construit la map hreflang (une entrée par locale + x-default) pour un
// même chemin, utilisée dans `alternates.languages` et le sitemap.
export function localeAlternates(path = ""): Record<string, string> {
  const entries = routing.locales.map(
    (locale) => [locale, absoluteUrl(locale, path)] as const,
  );
  return {
    ...Object.fromEntries(entries),
    "x-default": absoluteUrl(routing.defaultLocale, path),
  };
}
