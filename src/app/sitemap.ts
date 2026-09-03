import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getData } from "@/lib/data";
import { absoluteUrl, localeAlternates } from "@/lib/site";

// Convention de fichier App Router, indépendante de l'arborescence
// [locale] : vit à la racine de src/app/ (à côté de favicon.ico) et produit
// un unique /sitemap.xml non préfixé par une locale.
const STATIC_PATHS = [
  "",
  "/about",
  "/competences",
  "/projets",
  "/interventions",
  "/explorations",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Les ids sont partagés entre data.fr.json et data.en.json (même
  // hypothèse que generateStaticParams sur chaque page [id]) : une seule
  // entrée par id suffit, avec ses alternates hreflang par locale.
  const data = await getData(routing.defaultLocale);

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(routing.defaultLocale, path),
    alternates: { languages: localeAlternates(path) },
  }));

  const dynamicEntries = [
    ...data.projects.map((p) => ({
      url: absoluteUrl(routing.defaultLocale, `/projets/${p.id}`),
      alternates: { languages: localeAlternates(`/projets/${p.id}`) },
    })),
    ...data.cases.map((c) => ({
      url: absoluteUrl(routing.defaultLocale, `/interventions/${c.id}`),
      alternates: { languages: localeAlternates(`/interventions/${c.id}`) },
    })),
    ...data.explorations.map((e) => ({
      url: absoluteUrl(routing.defaultLocale, `/explorations/${e.id}`),
      alternates: { languages: localeAlternates(`/explorations/${e.id}`) },
    })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
