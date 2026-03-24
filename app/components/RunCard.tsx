"use client";

import { useState } from "react";
import { FeedItem } from "@/lib/types";

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

interface RunCardProps {
  item: FeedItem;
}

export function RunCard({ item }: RunCardProps) {
  const [expanded, setExpanded] = useState(false);
  const sourceCount = item.results.length;

  return (
    <article
      className="py-5 border-b border-[color:var(--color-border)] last:border-b-0"
    >
      {/* Header: category badge + timestamp */}
      <div className="flex items-center gap-3 mb-2">
        <span
          className="
            text-xs font-semibold uppercase tracking-wider
            font-[family-name:var(--font-code)]
          "
          style={{ color: item.color }}
        >
          {item.category}
        </span>
        <span className="text-xs text-[color:var(--color-text-muted)]">
          {timeAgo(item.completedAt)}
        </span>
      </div>

      {/* Content: the text summary */}
      <div
        className="
          text-[color:var(--color-text)]
          font-[family-name:var(--font-body)]
          leading-relaxed text-[15px]
          whitespace-pre-line
        "
      >
        {item.content}
      </div>

      {/* Sources: expandable */}
      {sourceCount > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="
              text-xs font-[family-name:var(--font-code)]
              text-[color:var(--color-link)]
              hover:underline
            "
          >
            {expanded ? "hide sources" : `${sourceCount} source${sourceCount === 1 ? "" : "s"}`}
          </button>

          {expanded && (
            <ul className="mt-2 space-y-1">
              {item.results.map((result, i) => (
                <li key={i} className="text-xs text-[color:var(--color-text-secondary)]">
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
