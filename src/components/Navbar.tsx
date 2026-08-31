'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { getContent } from '../lib/content';
import Button from './Button';
import Logo from './Logo';
import ThemePicker from './ThemePicker';

const content = getContent();

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-theme bg-theme-surface/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]'
          : 'border-transparent bg-theme-surface/30 backdrop-blur-md'
      }`}
    >
      <motion.div className="h-[2px] origin-left bg-brand-primary" style={{ scaleX: progress }} />

      <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
        <Link href="/" className="flex items-center text-theme-primary" aria-label="CraftLanee home">
          <Logo className="h-11 w-40 text-theme-primary md:h-12 md:w-44" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {content.nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-sm font-medium transition ${
                  isActive ? 'text-theme-primary' : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                {item.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-brand-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </Link>
            );
          })}
          <ThemePicker />
          <Button href="/contact" variant="primary">Book a Call</Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemePicker />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-theme bg-theme-surface-soft text-theme-primary"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-theme bg-theme-background md:hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-6">
              {content.nav.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? 'bg-theme-surface-soft text-theme-primary' : 'text-theme-secondary hover:bg-theme-surface-soft'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <Button href="/contact" variant="primary" onClick={() => setOpen(false)}>
                Book a Call
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
