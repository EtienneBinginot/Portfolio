// Injecte un bloc JSON-LD (`<script type="application/ld+json">`) dans la
// page. Server Component pur — pas de style associé.
//
// Échappe les "<" pour empêcher qu'une chaîne de donnée contenant
// "</script>" ne referme prématurément la balise et n'ouvre une injection
// (XSS via le contenu de data.json, par exemple un titre malveillant).
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
