"use client";

import { useState, useMemo } from "react";
import { marked } from "marked";
import { FeedItem, SearchResult } from "@/lib/types";

marked.setOptions({ breaks: true, gfm: true });

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

/**
 * Replace raw URLs in markdown content with titled links.
 *
 * Uses the search results to map URLs to titles. For URLs without a
 * known title, falls back to the domain name. Skips URLs already
 * inside markdown link syntax `[text](url)`.
 */
function linkifyRawUrls(content: string, results: SearchResult[]): string {
  const titleByUrl = new Map<string, string>();
  for (const r of results) {
    if (r.url && r.title) {
      titleByUrl.set(r.url, r.title);
    }
  }

  return content.replace(
    /(?<!\]\()https?:\/\/[^\s)>\]]+/g,
    (rawUrl) => {
      // Strip trailing punctuation that isn't part of the URL
      const cleaned = rawUrl.replace(/[.,;:!?]+$/, "");
      const title = titleByUrl.get(cleaned);
      if (title) return `[${title}](${cleaned})`;
      try {
        const domain = new URL(cleaned).hostname.replace(/^www\./, "");
        return `[${domain}](${cleaned})`;
      } catch {
        return rawUrl;
      }
    }
  );
}

interface RunCardProps {
  item: FeedItem;
}

export function RunCard({ item }: RunCardProps) {
  const [expanded, setExpanded] = useState(false);
  const sourceCount = item.results.length;

  const contentHtml = useMemo(() => {
    // 1. Replace raw URLs with titled markdown links
    let md = linkifyRawUrls(item.content, item.results);
    // 2. Ensure markdown headers start on their own line
    md = md.replace(/([^\n])(\n?)(#{1,4} )/g, "$1\n\n$3");
    return marked.parse(md) as string;
  }, [item.content, item.results]);

  return (
    <article className="py-5 border-b border-[color:var(--color-border)] last:border-b-0">
      {/* Header: category badge + timestamp */}
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-xs font-semibold uppercase tracking-wider font-[family-name:var(--font-code)]"
          style={{ color: item.color }}
        >
          {item.category}
        </span>
        <span className="text-xs text-[color:var(--color-text-muted)]">
          {timeAgo(item.completedAt)}
        </span>
      </div>

      {/* Content: rendered markdown */}
      <div
        className="prose text-[15px]"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Sources: expandable */}
      {sourceCount > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-[family-name:var(--font-code)] text-[color:var(--color-link)] hover:underline"
          >
            {expanded
              ? "hide sources"
              : `${sourceCount} source${sourceCount === 1 ? "" : "s"}`}
          </button>

          {expanded && (
            <ul className="mt-2 space-y-1">
              {item.results.map((result, i) => (
                <li
                  key={i}
                  className="text-xs text-[color:var(--color-text-secondary)]"
                >
                  {result.url ? (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[color:var(--color-link)] hover:underline"
                    >
                      {result.title || result.url}
                    </a>
                  ) : (
                    <span>{result.title || "Untitled source"}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
