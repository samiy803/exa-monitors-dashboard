import { MonitorRun, FeedItem, MonitorConfig } from "./types";
import { getMonitorConfig } from "./monitors";

const BASE_URL = "https://api.exa.ai/search-monitors";

async function exaFetch<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    throw new Error(`Exa API ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

/** Fetch the latest runs for a single monitor. */
export async function fetchMonitorRuns(
  monitorId: string,
  apiKey: string,
  limit = 10
): Promise<MonitorRun[]> {
  const data = await exaFetch<{ data: MonitorRun[] }>(
    `/${monitorId}/runs?limit=${limit}`,
    apiKey
  );
  return data.data;
}

/**
 * Fetch runs for all configured monitors, flatten into a sorted feed.
 *
 * Skips monitors with empty IDs (not yet created).
 * Returns items sorted by completedAt descending (newest first).
 */
export async function fetchAllFeedItems(
  apiKey: string,
  monitors: MonitorConfig[]
): Promise<FeedItem[]> {
  const activeMonitors = monitors.filter((m) => m.id);

  if (activeMonitors.length === 0) return [];

  const allRuns = await Promise.all(
    activeMonitors.map((m) => fetchMonitorRuns(m.id, apiKey))
  );

  const items: FeedItem[] = [];

  for (const runs of allRuns) {
    for (const run of runs) {
      if (run.status !== "completed" || !run.output?.content) continue;

      const config = getMonitorConfig(run.monitorId);
      if (!config) continue;

      items.push({
        runId: run.id,
        monitorId: run.monitorId,
        monitorName: config.name,
        category: config.category,
        color: config.color,
        content: run.output.content,
        results: run.output.results ?? [],
        completedAt: run.completedAt ?? run.createdAt,
      });
    }
  }

  items.sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return items;
}
