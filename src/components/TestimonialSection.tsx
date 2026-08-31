'use client';

import { Quote, Star } from 'lucide-react';
import Reveal, { RevealGroup, RevealItem } from './Reveal';
import { getContent } from '../lib/content';
import { playSoftClick } from '../lib/sound';

const content = getContent();

export default function TestimonialSection() {
  return (
    <section className="relative overflow-hidden bg-theme-surface-alt px-6 py-20 sm:px-10">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-accent/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Client stories</p>
          <h2 className="font-display text-3xl font-bold text-theme-primary sm:text-4xl">
            Clients choose us for execution that connects marketing and technology.
          </h2>
        </Reveal>

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {content.testimonials.map((testimonial, index) => (
            <RevealItem key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
              <article
                onMouseEnter={playSoftClick}
                className="shine-border group relative h-full overflow-hidden rounded-2xl border border-theme bg-theme-surface p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-glow"
              >
                <Quote className="pointer-events-none absolute -right-3 -top-3 h-28 w-28 text-brand-primary/[0.06] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6" />

                <div className="relative">
                  <div className="mb-4 flex gap-0.5 text-brand-primary">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={14}
                        className="fill-current transition-transform duration-300"
                        style={{ transitionDelay: `${starIndex * 40}ms` }}
                      />
                    ))}
                  </div>

                  <p className="font-display text-lg text-justify leading-8 text-theme-primary">&ldquo;{testimonial.quote}&rdquo;</p>

                  <div className="mt-8 flex items-center gap-3 border-t border-theme pt-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-sm font-semibold text-white shadow-glow ring-2 ring-theme-surface transition-transform duration-300 group-hover:scale-110">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-theme-primary">{testimonial.author}</p>
                      <p className="text-sm text-theme-muted">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
