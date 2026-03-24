import { Suspense } from "react";
import { fetchAllFeedItems } from "@/lib/exa";
import { MONITORS } from "@/lib/monitors";
import { Feed } from "./components/Feed";
import { ThemeToggle } from "./components/ThemeToggle";

export const revalidate = 120;

async function FeedLoader() {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    return (
      <p className="text-center py-20 text-[color:var(--color-text-muted)]">
        EXA_API_KEY not configured.
      </p>
    );
  }

  const items = await fetchAllFeedItems(apiKey, MONITORS);
  return <Feed items={items} />;
}

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1
          className="
            text-2xl font-bold tracking-tight
            font-[family-name:var(--font-display)]
          "
        >
          Monitors
        </h1>
        <ThemeToggle />
      </header>

      {/* Feed */}
      <Suspense
        fallback={
          <div className="py-20 text-center text-[color:var(--color-text-muted)]">
            Loading...
          </div>
        }
      >
        <FeedLoader />
      </Suspense>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[color:var(--color-border)] text-center">
        <p className="text-xs text-[color:var(--color-text-muted)] font-[family-name:var(--font-code)]">
          Powered by{" "}
          <a
            href="https://exa.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--color-link)] hover:underline"
          >
            Exa Monitors
          </a>
        </p>
      </footer>
    </main>
  );
}
