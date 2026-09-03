import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

// icons reste limité à favicon.ico : aucun icon.png/apple-icon.png n'est
// encore prévu (voir la décision "image statique plus tard" du README) —
// à enrichir si ces fichiers sont ajoutés un jour, sans autre changement.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Etienne Binginot",
    description: "Personal showcase site built around measured proof.",
    start_url: "/",
    display: "standalone",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
    theme_color: "#081615",
    background_color: "#081615",
  };
}
