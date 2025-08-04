import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
        aria-label="Toggle theme"
        onClick={() => setDark(d => !d)}
        className="
            ml-auto p-2 rounded-xl transition
            bg-neutral-200 dark:bg-neutral-700
            hover:bg-neutral-300 dark:hover:bg-neutral-600
            flex items-center justify-center
        "
        >
        {dark ? (
            <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
            <Moon className="w-6 h-6 text-neutral-800 dark:text-yellow-300" />
        )}
    </button>
  );
}

export default ThemeToggle;