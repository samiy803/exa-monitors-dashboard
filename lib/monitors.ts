import { MonitorConfig } from "./types";

/**
 * Static monitor configuration.
 *
 * The `id` field must be populated after running the create-monitors script.
 * Until then, use empty strings — the page will show an empty state.
 */
export const MONITORS: MonitorConfig[] = [
  {
    id: "",
    name: "Chess Drama & News",
    category: "chess",
    color: "var(--color-chess)",
  },
  {
    id: "",
    name: "OpenClaw Updates",
    category: "openclaw",
    color: "var(--color-openclaw)",
  },
  {
    id: "",
    name: "Practical ML / Transformers",
    category: "ml",
    color: "var(--color-ml)",
  },
  {
    id: "",
    name: "Major AI Only",
    category: "ai",
    color: "var(--color-ai)",
  },
];

/** Look up a monitor's config by its ID. */
export function getMonitorConfig(monitorId: string): MonitorConfig | undefined {
  return MONITORS.find((m) => m.id === monitorId);
}
