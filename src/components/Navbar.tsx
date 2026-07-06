'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { getContent } from '../lib/content';
import Button from './Button';

const content = getContent();

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-theme bg-theme-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center text-theme-primary" aria-label="CraftLanee home">
          <div className="relative h-10 w-36 md:h-12 md:w-44">
            <Image src="/images/logo.png" alt="CraftLanee logo" fill priority sizes="(max-width: 768px) 144px, 176px" className="object-contain mix-blend-overlay" />
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {content.nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${isActive ? 'text-theme-primary underline decoration-brand-primary underline-offset-4 decoration-2' : 'text-theme-secondary hover:text-theme-primary'}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Button href="/contact" variant="primary">Book a Call</Button>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-theme bg-theme-surface-soft text-theme-primary md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-theme bg-theme-background md:hidden">
          <div className="flex flex-col gap-3 px-6 py-6">
            {content.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'text-theme-primary bg-theme-surface-soft' : 'text-theme-secondary hover:bg-theme-surface-soft'}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button href="/contact" variant="primary" onClick={() => setOpen(false)}>
              Book a Call
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
