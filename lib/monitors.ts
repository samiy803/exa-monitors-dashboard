import { MonitorConfig } from "./types";

/**
 * Static monitor configuration.
 *
 * The `id` field must be populated after running the create-monitors script.
 * Until then, use empty strings — the page will show an empty state.
 */
export const MONITORS: MonitorConfig[] = [
  {
    id: "01kmgqhym857b4kfjd2qcs4aez",
    name: "Chess Drama & News",
    category: "chess",
    color: "var(--color-chess)",
  },
  {
    id: "01kmgqhz28ndreydgg1yx0eerm",
    name: "OpenClaw Updates",
    category: "openclaw",
    color: "var(--color-openclaw)",
  },
  {
    id: "01kmgqhz7m6fa4t4tn3megq6vb",
    name: "Practical ML / Transformers",
    category: "ml",
    color: "var(--color-ml)",
  },
  {
    id: "01kmgqhze3awby9v3z442nh6s0",
    name: "Major AI Only",
    category: "ai",
    color: "var(--color-ai)",
  },
];

/** Look up a monitor's config by its ID. */
export function getMonitorConfig(monitorId: string): MonitorConfig | undefined {
  return MONITORS.find((m) => m.id === monitorId);
}
