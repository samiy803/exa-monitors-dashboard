"use client";

import { useEffect, useState } from "react";

type Theme = "editorial" | "terminal";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("editorial");

  useEffect(() => {
    const stored = localStorage.getItem("monitors-theme") as Theme | null;
    if (stored === "editorial" || stored === "terminal") {
      setTheme(stored);
    }
  }, []);

  function toggle() {
    const next: Theme = theme === "editorial" ? "terminal" : "editorial";
    setTheme(next);
    localStorage.setItem("monitors-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "editorial" ? "terminal" : "editorial"} theme`}
      className="
        px-3 py-1.5 rounded-md text-sm
        border border-[var(--color-border)]
        text-[var(--color-text-secondary)]
        hover:text-[var(--color-text)]
        hover:bg-[var(--color-surface-hover)]
        transition-colors font-[family-name:var(--font-code)]
      "
    >
      {theme === "editorial" ? "~/terminal" : "editorial"}
    </button>
  );
}
