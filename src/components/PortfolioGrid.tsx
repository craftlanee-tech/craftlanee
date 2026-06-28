'use client';

import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getContent } from '../lib/content';

const content = getContent();
const portfolioItems = content.portfolio.items;

export default function PortfolioGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);

  const updateOverflowState = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    setHasOverflow(track.scrollWidth > track.clientWidth + 2);
  }, []);

  const scrollToItem = useCallback((index: number) => {
    const track = trackRef.current;
    const item = track?.children[index] as HTMLElement | undefined;

    if (!track || !item) {
      return;
    }

    track.scrollTo({
      left: item.offsetLeft,
      behavior: 'smooth',
    });
  }, []);

  const showItem = useCallback(
    (index: number) => {
      const nextIndex = (index + portfolioItems.length) % portfolioItems.length;
      setActiveIndex(nextIndex);
      scrollToItem(nextIndex);
    },
    [scrollToItem],
  );

  const showPrevious = useCallback(() => {
    showItem(activeIndex - 1);
  }, [activeIndex, showItem]);

  const showNext = useCallback(() => {
    showItem(activeIndex + 1);
  }, [activeIndex, showItem]);

  const pauseBriefly = () => {
    setIsInteracting(true);
    window.setTimeout(() => setIsInteracting(false), 1200);
  };

  useEffect(() => {
    updateOverflowState();
    window.addEventListener('resize', updateOverflowState);

    return () => window.removeEventListener('resize', updateOverflowState);
  }, [updateOverflowState]);

  useEffect(() => {
    if (hasOverflow) {
      return;
    }

    setActiveIndex(0);
    trackRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [hasOverflow]);

  useEffect(() => {
    if (!hasOverflow || isInteracting) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % portfolioItems.length;
        scrollToItem(nextIndex);
        return nextIndex;
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, [hasOverflow, isInteracting, scrollToItem]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasOverflow) {
      return;
    }

    pointerStartX.current = event.clientX;
    setIsInteracting(true);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasOverflow || pointerStartX.current === null) {
      return;
    }

    const swipeDistance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (swipeDistance > 48) {
      showPrevious();
    } else if (swipeDistance < -48) {
      showNext();
    } else {
      scrollToItem(activeIndex);
    }

    pauseBriefly();
  };

  const handlePointerLeave = () => {
    if (!hasOverflow) {
      return;
    }

    pointerStartX.current = null;
    pauseBriefly();
  };

  return (
    <section className="bg-theme-background px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Portfolio</p>
            <h2 className="text-3xl font-semibold text-theme-primary sm:text-4xl">{content.portfolio.title}</h2>
            <p className="max-w-2xl leading-7 text-theme-secondary">{content.portfolio.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-theme bg-theme-surface-soft px-4 py-3 text-sm font-medium text-theme-secondary">
            <CheckCircle2 size={18} className="text-brand-primary" />
            <span>{portfolioItems.length} selected projects</span>
          </div>
        </div>

        <div className="relative">
          {hasOverflow ? (
            <button
              type="button"
              aria-label="Show previous portfolio project"
              onClick={() => {
                showPrevious();
                pauseBriefly();
              }}
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
              className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-primary shadow-lg transition hover:border-brand-primary/50 hover:text-brand-primary md:inline-flex"
            >
              <ChevronLeft size={22} />
            </button>
          ) : null}

          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerLeave}
            onPointerLeave={handlePointerLeave}
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            className={`flex gap-6 overflow-hidden scroll-smooth ${hasOverflow ? 'snap-x snap-mandatory touch-pan-y' : ''}`}
          >
            {portfolioItems.map((item, index) => (
              <article
                key={item.title}
                className="group min-w-full snap-start overflow-hidden rounded-lg border border-theme bg-theme-surface transition duration-300 hover:-translate-y-1 hover:border-brand-primary/45 md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-theme-surface-alt">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                        Project {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold leading-tight text-theme-primary">{item.title}</h3>
                    </div>
                    <ArrowUpRight size={20} className="mt-1 shrink-0 text-theme-muted transition group-hover:text-brand-primary" />
                  </div>

                  <p className="min-h-20 text-sm leading-7 text-theme-secondary">{item.description}</p>

                  <div className="border-t border-theme pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-muted">Outcome</p>
                    <p className="mt-2 text-sm font-semibold text-theme-primary">{item.result}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {hasOverflow ? (
            <button
              type="button"
              aria-label="Show next portfolio project"
              onClick={() => {
                showNext();
                pauseBriefly();
              }}
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
              className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-primary shadow-lg transition hover:border-brand-primary/50 hover:text-brand-primary md:inline-flex"
            >
              <ChevronRight size={22} />
            </button>
          ) : null}
        </div>

        {hasOverflow ? (
          <div className="mt-7 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Show previous portfolio project"
              onClick={() => {
                showPrevious();
                pauseBriefly();
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-primary transition hover:border-brand-primary/50 hover:text-brand-primary md:hidden"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {portfolioItems.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  aria-current={activeIndex === index}
                  onClick={() => {
                    showItem(index);
                    pauseBriefly();
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index ? 'w-9 bg-brand-primary' : 'w-2.5 bg-theme-surface-soft hover:bg-brand-primary/60'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Show next portfolio project"
              onClick={() => {
                showNext();
                pauseBriefly();
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-primary transition hover:border-brand-primary/50 hover:text-brand-primary md:hidden"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
