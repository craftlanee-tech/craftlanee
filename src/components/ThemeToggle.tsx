'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const THEME_KEY = 'craftlanee-theme';

type ThemeMode = 'light' | 'dark';

function getPreferredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;

  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return 'light';
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

export default function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    applyTheme(preferredTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={`relative inline-flex h-10 w-16 items-center rounded-full border p-1 shadow-sm transition hover:border-brand-primary ${
        onDark ? 'border-white/15 bg-white/5' : 'border-theme bg-theme-surface-soft'
      }`}
    >
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white transition-transform ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
      </span>
    </button>
  );
}
