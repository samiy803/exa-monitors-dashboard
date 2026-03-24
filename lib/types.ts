/** Category identifier for each monitor. */
export type Category = "chess" | "openclaw" | "ml" | "ai";

/** Static config for a monitor, defined at build time. */
export interface MonitorConfig {
  id: string;
  name: string;
  category: Category;
  /** CSS variable name, e.g. "var(--color-chess)" */
  color: string;
}

/** A search result from a monitor run. */
export interface SearchResult {
  title?: string;
  url?: string;
  publishedDate?: string;
  highlights?: string[];
}

/** Output from a completed monitor run. */
export interface RunOutput {
  content?: string;
  results?: SearchResult[];
  grounding?: Array<{
    field: string;
    citations: Array<{ url: string; title?: string }>;
    confidence: string;
  }>;
}

/** A single monitor run, as returned by the API. */
export interface MonitorRun {
  id: string;
  monitorId: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  output: RunOutput | null;
  failReason: string | null;
  startedAt: string | null;
  completedAt: string | null;
  durationMs: number | null;
  createdAt: string;
}

/** A flattened feed item combining run data with monitor metadata. */
export interface FeedItem {
  runId: string;
  monitorId: string;
  monitorName: string;
  category: Category;
  color: string;
  content: string;
  results: SearchResult[];
  completedAt: string;
}
