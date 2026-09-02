import { vi } from "vitest";

// Mock partagé de next/navigation, repris automatiquement par
// `vi.mock("next/navigation")` (sans factory) dans les tests de composants
// qui passent par @/i18n/navigation — next-intl lit next/navigation en
// interne (voir useBasePathname), pas seulement via son propre wrapper.
export const usePathname = vi.fn();
export const useRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
});
export const redirect = vi.fn();
export const permanentRedirect = vi.fn();
