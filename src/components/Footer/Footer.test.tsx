import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("affiche les liens contact, GitHub et LinkedIn", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("affiche une mention de dernière mise à jour", () => {
    render(<Footer />);
    expect(screen.getByText(/Mise à jour/)).toBeInTheDocument();
  });
});
