// @vitest-environment node
// Tests purs (calcul d'URL) : pas besoin du DOM jsdom.
//
// SITE_URL est calculée une fois, au chargement du module — chaque test qui
// dépend de NEXT_PUBLIC_SITE_URL doit donc stub l'env AVANT un import frais
// du module (vi.resetModules() après coup pour ne pas polluer les tests
// suivants avec un module déjà évalué).
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("SITE_URL", () => {
  it("retombe sur l'URL placeholder si NEXT_PUBLIC_SITE_URL est absente", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const { SITE_URL } = await import("./site");
    expect(SITE_URL.toString()).toBe("https://etienne-binginot.example/");
  });

  it("utilise NEXT_PUBLIC_SITE_URL quand elle est définie", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { SITE_URL } = await import("./site");
    expect(SITE_URL.toString()).toBe("https://example.com/");
  });
});

describe("absoluteUrl", () => {
  it("ne laisse pas de chemin vide pour la racine", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { absoluteUrl } = await import("./site");
    expect(absoluteUrl("fr", "")).toBe("https://example.com/fr");
  });

  it("ne laisse pas de chemin pour '/'", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { absoluteUrl } = await import("./site");
    expect(absoluteUrl("en", "/")).toBe("https://example.com/en");
  });

  it("concatène un chemin donné après la locale", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { absoluteUrl } = await import("./site");
    expect(absoluteUrl("en", "/projets/exemple-projet")).toBe(
      "https://example.com/en/projets/exemple-projet",
    );
  });
});

describe("localeAlternates", () => {
  it("produit une entrée fr, en, et x-default sur le défaut (fr)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { localeAlternates } = await import("./site");
    expect(localeAlternates("/about")).toEqual({
      fr: "https://example.com/fr/about",
      en: "https://example.com/en/about",
      "x-default": "https://example.com/fr/about",
    });
  });

  it("sans chemin, pointe vers les racines de chaque locale", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { localeAlternates } = await import("./site");
    expect(localeAlternates()).toEqual({
      fr: "https://example.com/fr",
      en: "https://example.com/en",
      "x-default": "https://example.com/fr",
    });
  });
});
