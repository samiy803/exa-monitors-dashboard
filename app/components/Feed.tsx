"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FeedItem, Category } from "@/lib/types";
import { FilterBar } from "./FilterBar";
import { RunCard } from "./RunCard";

interface FeedProps {
  items: FeedItem[];
}

export function Feed({ items }: FeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = searchParams.get("filter") as Category | "all" | null;
  const [filter, setFilter] = useState<Category | "all">(filterParam ?? "all");

  function handleFilter(category: Category | "all") {
    setFilter(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("filter");
    } else {
      params.set("filter", category);
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/", { scroll: false });
  }

  const filtered =
    filter === "all" ? items : items.filter((item) => item.category === filter);

  return (
    <div>
      <FilterBar active={filter} onFilter={handleFilter} />

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[color:var(--color-text-muted)] font-[family-name:var(--font-body)]">
            {items.length === 0
              ? "No monitor runs yet. Monitors are scheduled — check back soon."
              : "No results in this category."}
          </p>
        </div>
      ) : (
        <div className="mt-4">
          {filtered.map((item) => (
            <RunCard key={item.runId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
