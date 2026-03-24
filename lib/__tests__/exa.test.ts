import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMonitorRuns, fetchAllFeedItems } from "@/lib/exa";

const mockRun = {
  id: "run_1",
  monitorId: "mon_1",
  status: "completed",
  output: {
    content: "Chess update summary",
    results: [{ title: "Article", url: "https://example.com" }],
  },
  failReason: null,
  startedAt: "2026-03-24T09:00:01Z",
  completedAt: "2026-03-24T09:00:30Z",
  durationMs: 29000,
  createdAt: "2026-03-24T09:00:00Z",
};

const mockFetchResponse = (data: unknown) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);

describe("fetchMonitorRuns", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("fetches runs for a monitor", async () => {
    vi.mocked(fetch).mockReturnValue(
      mockFetchResponse({ data: [mockRun], hasMore: false, nextCursor: null })
    );

    const runs = await fetchMonitorRuns("mon_1", "test-key");
    expect(runs).toHaveLength(1);
    expect(runs[0].id).toBe("run_1");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.exa.ai/search-monitors/mon_1/runs?limit=10",
      expect.objectContaining({
        headers: expect.objectContaining({ "x-api-key": "test-key" }),
      })
    );
  });
});

describe("fetchAllFeedItems", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns empty array when no monitors have IDs", async () => {
    const items = await fetchAllFeedItems("test-key", []);
    expect(items).toEqual([]);
  });
});
