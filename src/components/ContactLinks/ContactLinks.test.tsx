import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactLinks from "./ContactLinks";

describe("ContactLinks", () => {
  it("affiche les liens mail, GitHub et LinkedIn avec les bons attributs", () => {
    render(
      <ContactLinks
        email="test@example.com"
        github="https://github.com/example"
        linkedin="https://www.linkedin.com/in/example"
        emailLabel="Email"
        githubLabel="GitHub"
        linkedinLabel="LinkedIn"
      />,
    );

    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:test@example.com",
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
});
