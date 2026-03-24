"use client";

import { Category } from "@/lib/types";

interface FilterBarProps {
  active: Category | "all";
  onFilter: (category: Category | "all") => void;
}

const FILTERS: { label: string; value: Category | "all"; colorVar: string }[] = [
  { label: "All", value: "all", colorVar: "var(--color-accent)" },
  { label: "Chess", value: "chess", colorVar: "var(--color-chess)" },
  { label: "OpenClaw", value: "openclaw", colorVar: "var(--color-openclaw)" },
  { label: "ML", value: "ml", colorVar: "var(--color-ml)" },
  { label: "AI", value: "ai", colorVar: "var(--color-ai)" },
];

export function FilterBar({ active, onFilter }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
      {FILTERS.map(({ label, value, colorVar }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            onClick={() => onFilter(value)}
            style={
              isActive
                ? { backgroundColor: colorVar, color: "var(--color-bg)", borderColor: colorVar }
                : undefined
            }
            className={`
              shrink-0 px-4 py-1.5 rounded-full text-sm
              font-[family-name:var(--font-code)]
              transition-colors border
              ${
                isActive
                  ? ""
                  : "bg-transparent text-[color:var(--color-text-secondary)] border-[color:var(--color-border)] hover:text-[color:var(--color-text)] hover:border-[color:var(--color-text-muted)]"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
