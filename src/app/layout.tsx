import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Silkscreen } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
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

export const metadata: Metadata = {
  title: "Étienne Binginot — Portfolio",
  description: "Site vitrine personnel orienté preuve mesurée.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${silkscreen.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
