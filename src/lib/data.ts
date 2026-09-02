import { DataSchema } from "./schema";
import type { Locale } from "@/i18n/routing";

const loaders: Record<Locale, () => Promise<unknown>> = {
  fr: () => import("@/data/data.fr.json").then((m) => m.default),
  en: () => import("@/data/data.en.json").then((m) => m.default),
};

// Mémoïsée par locale : chaque requête ne charge et ne valide que le fichier
// dont elle a besoin, plutôt que de parser les deux locales à chaque import
// du module. Un data.*.json invalide fait échouer `next build` dès la
// génération statique de la locale concernée (generateStaticParams couvre
// les deux), en plus du garde-fou explicite de scripts/validate-data.ts.
const cache = new Map<Locale, ReturnType<typeof DataSchema.parse>>();

export async function getData(locale: Locale) {
  const cached = cache.get(locale);
  if (cached) return cached;

  const raw = await loaders[locale]();
  const data = DataSchema.parse(raw);
  cache.set(locale, data);
  return data;
}
