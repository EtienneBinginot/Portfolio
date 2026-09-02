"use client";

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

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          etienne.dev
        </Link>
        <ul className={styles.links}>
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
