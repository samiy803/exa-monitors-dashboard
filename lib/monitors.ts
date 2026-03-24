import { MonitorConfig } from "./types";

/**
 * Static monitor configuration.
 *
 * The `id` field must be populated after running the recreate-monitors script.
 * Until then, use empty strings — the page will show an empty state.
 */
export const MONITORS: MonitorConfig[] = [
  {
    id: "01kmgy0pd4b12t68c2gy3yhj25",
    name: "Chess Drama & News",
    category: "chess",
    color: "var(--color-chess)",
  },
  {
    id: "01kmgy0pqv0n19nhj1cg3zz7n1",
    name: "OpenClaw Updates",
    category: "openclaw",
    color: "var(--color-openclaw)",
  },
  {
    id: "01kmgy0pzhk3bgpn50cfhyv27g",
    name: "Practical ML / Transformers",
    category: "ml",
    color: "var(--color-ml)",
  },
  {
    id: "01kmgy0q6avy1qqhc1y26vftqz",
    name: "Major AI Only",
    category: "ai",
    color: "var(--color-ai)",
  },
];

/** Look up a monitor's config by its ID. */
export function getMonitorConfig(monitorId: string): MonitorConfig | undefined {
  return MONITORS.find((m) => m.id === monitorId);
}
