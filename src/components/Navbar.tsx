'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import content from '../content';
import Button from './Button';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image src="/images/Craftlanee_logo.png" alt="Craftlanee logo" fill sizes="(max-width: 640px) 40px, 48px" className="object-contain" />
          </div>
          <span className="text-lg font-semibold md:text-xl">
            <span className="text-white">Craft</span>
            <span className="text-brand-primary">lanee</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {content.nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${isActive ? 'text-white underline decoration-brand-primary underline-offset-4 decoration-2' : 'text-slate-300 hover:text-white'}`}
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-black/95 md:hidden">
          <div className="flex flex-col gap-3 px-6 py-6">
            {content.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'text-white bg-white/5' : 'text-slate-200 hover:bg-white/5'}`}
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
