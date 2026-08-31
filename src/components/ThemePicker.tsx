'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Palette } from 'lucide-react';

const ACCENT_KEY = 'craftlanee-accent';

const ACCENTS = [
  { id: 'blue', label: 'Blue', swatch: '#3461fd' },
  { id: 'orange', label: 'Orange', swatch: '#ff7a00' },
  { id: 'violet', label: 'Violet', swatch: '#7c4dff' },
  { id: 'emerald', label: 'Emerald', swatch: '#10b981' },
  { id: 'rose', label: 'Rose', swatch: '#f43f5e' },
] as const;

type AccentId = (typeof ACCENTS)[number]['id'];

function applyAccent(id: AccentId) {
  document.documentElement.dataset.accent = id;
}

export default function ThemePicker({ onDark = false }: { onDark?: boolean }) {
  const [accent, setAccent] = useState<AccentId>('blue');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ACCENT_KEY) as AccentId | null;
    const initial = ACCENTS.some((option) => option.id === stored) ? (stored as AccentId) : 'blue';
    setAccent(initial);
    applyAccent(initial);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectAccent = (id: AccentId) => {
    setAccent(id);
    localStorage.setItem(ACCENT_KEY, id);
    applyAccent(id);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Choose accent color"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:border-brand-primary ${
          onDark ? 'border-white/15 bg-white/5 text-white' : 'border-theme bg-theme-surface-soft text-theme-primary'
        }`}
      >
        <Palette size={16} />
      </button>

      {open ? (
        <div
          className={`absolute right-0 z-30 mt-2 flex items-center gap-2 rounded-2xl border p-2.5 shadow-glow ${
            onDark ? 'border-white/10 bg-[#0d0e11]' : 'border-theme bg-theme-surface'
          }`}
        >
          {ACCENTS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-label={`Use ${option.label} theme`}
              onClick={() => selectAccent(option.id)}
              className="relative flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-inset ring-black/10 transition hover:scale-110"
              style={{ backgroundColor: option.swatch }}
            >
              {accent === option.id ? <Check size={14} className="text-white drop-shadow" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
