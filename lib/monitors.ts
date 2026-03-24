import { MonitorConfig } from "./types";

/**
 * Static monitor configuration.
 *
 * The `id` field must be populated after running the recreate-monitors script.
 * Until then, use empty strings — the page will show an empty state.
 */
export const MONITORS: MonitorConfig[] = [
  {
    id: "01kmgt56hnspt155zfhscmsx6p",
    name: "Chess Drama & News",
    category: "chess",
    color: "var(--color-chess)",
  },
  {
    id: "01kmgt56s7034q5mx7tew629yb",
    name: "OpenClaw Updates",
    category: "openclaw",
    color: "var(--color-openclaw)",
  },
  {
    id: "01kmgt571c0wes28ke4jaepekf",
    name: "Practical ML / Transformers",
    category: "ml",
    color: "var(--color-ml)",
  },
  {
    id: "01kmgt577p2zejae2k81fy1tya",
    name: "Major AI Only",
    category: "ai",
    color: "var(--color-ai)",
  },
];

/** Look up a monitor's config by its ID. */
export function getMonitorConfig(monitorId: string): MonitorConfig | undefined {
  return MONITORS.find((m) => m.id === monitorId);
}
