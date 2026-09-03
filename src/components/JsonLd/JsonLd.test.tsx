import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import JsonLd from "./JsonLd";

describe("JsonLd", () => {
  it('rend un <script type="application/ld+json"> avec les données sérialisées', () => {
    const { container } = render(
      <JsonLd data={{ "@type": "Person", name: "Etienne Binginot" }} />,
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.innerHTML)).toEqual({
      "@type": "Person",
      name: "Etienne Binginot",
    });
  });

  it("échappe les '<' pour empêcher une fermeture prématurée de la balise script", () => {
    const { container } = render(
      <JsonLd data={{ name: "</script><script>alert(1)</script>" }} />,
    );
    const script = container.querySelector("script");
    expect(script!.innerHTML).not.toContain("</script><script>");
    expect(script!.innerHTML).toContain("\\u003c/script>\\u003cscript>");
  });
});
