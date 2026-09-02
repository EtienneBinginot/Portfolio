"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { cx } from "@/lib/cx";
import styles from "./Navbar.module.scss";

export const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/projets", key: "projects" },
  { href: "/interventions", key: "interventions" },
  { href: "/about", key: "about" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const [open, setOpen] = useState(false);

  // Fermeture automatique au changement de route : rouvrir le menu à chaque
  // navigation forcerait l'utilisateur à le refermer lui-même à chaque clic.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Fermeture au clavier (Échap), norme d'accessibilité pour tout panneau
  // qui se superpose au contenu — seulement écouté pendant que le menu est
  // ouvert.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          etienne.dev
        </Link>
        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-controls="navbar-links"
          onClick={() => setOpen((prev) => !prev)}
        >
          {t("menuToggle")}
        </button>
        <ul
          id="navbar-links"
          className={cx(styles.links, open && styles.linksOpen)}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cx(styles.link, isActive && styles.active)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
