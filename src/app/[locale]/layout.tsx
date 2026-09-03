import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { IBM_Plex_Mono, Inter, Silkscreen } from "next/font/google";
import { routing, type Locale, type LocaleParams } from "@/i18n/routing";
import { SITE_URL, SITE_NAME, absoluteUrl, localeAlternates } from "@/lib/site";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PixelField from "@/components/PixelField/PixelField";
import "@/styles/globals.scss";

// --font-pixel : titres, chiffres d'accroche, UI, navigation.
const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixel",
  display: "swap",
});

// --font-read : prose, write-ups.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-read",
  display: "swap",
});

// --font-mono : chiffres de données (tabular-nums posé en CSS, voir globals.scss).
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await params;
  // Le layout racine reste rendu même pour une locale invalide (notFound()
  // ne court-circuite que le rendu de la page) : on retombe sur la locale
  // par défaut pour que generateMetadata ne plante jamais.
  const safeLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale: safeLocale,
    namespace: "Metadata",
  });
  const title = { default: t("title"), template: t("titleTemplate") };
  const description = t("description");

  return {
    metadataBase: SITE_URL,
    title,
    description,
    alternates: {
      canonical: absoluteUrl(safeLocale, ""),
      languages: localeAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: absoluteUrl(safeLocale, ""),
      locale: safeLocale === "fr" ? "fr_FR" : "en_US",
      images: [
        { url: "/og-image.png", width: 1200, height: 630, alt: t("ogAlt") },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LocaleParams;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${silkscreen.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* Coque globale, deux clusters fixed derrière tout le contenu :
              chacun reste dans son propre coin et sa propre couleur d'accent
              (doctrine "un accent par zone"), jamais empilés. Bleu en haut à
              droite = zone nav (écho du bord de header). Vert en bas à
              gauche, density="sparse" = zone pied de page/contact, plus en
              retrait puisqu'il vit en permanence à l'écran (position: fixed)
              même sur les pages longues. Deux instances fixed = deux clusters
              visibles à tout instant ; les pages peuvent en ajouter une
              troisième (cyan, rare) au maximum — voir le plan de rework pour
              la règle des 2-3 clusters/écran. */}
          <PixelField accent="blue" corner="top-right" />
          <PixelField accent="green" corner="bottom-left" density="sparse" />
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
