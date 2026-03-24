import { MonitorConfig } from "./types";

/**
 * Static monitor configuration.
 *
 * The `id` field must be populated after running the recreate-monitors script.
 * Until then, use empty strings — the page will show an empty state.
 */
export const MONITORS: MonitorConfig[] = [
  {
    id: "01kmgyj4s00ve4fy4m2bn6tqp0",
    name: "Chess Drama & News",
    category: "chess",
    color: "var(--color-chess)",
  },
  {
    id: "01kmgyj51g3kgzgfnn9p4zcasy",
    name: "OpenClaw Updates",
    category: "openclaw",
    color: "var(--color-openclaw)",
  },
  {
    id: "01kmgyj57qdem6zfhy3aedbajb",
    name: "Practical ML / Transformers",
    category: "ml",
    color: "var(--color-ml)",
  },
  {
    id: "01kmgyj5nhdatna0v1t1vhsrc1",
    name: "Major AI Only",
    category: "ai",
    color: "var(--color-ai)",
  },
];

/** Look up a monitor's config by its ID. */
export function getMonitorConfig(monitorId: string): MonitorConfig | undefined {
  return MONITORS.find((m) => m.id === monitorId);
}
