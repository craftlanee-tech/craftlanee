'use client';

import { getContent } from '../lib/content';

const content = getContent();

export default function TestimonialSection() {
  return (
    <section className="bg-theme-surface-alt px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Client stories</p>
          <h2 className="text-3xl font-semibold text-theme-primary sm:text-4xl">
            Clients choose us for execution that connects marketing and technology.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {content.testimonials.map((testimonial, index) => (
            <article key={index} className="rounded-2xl border border-theme bg-theme-surface-soft p-8 shadow backdrop-blur-xl">
              <p className="text-lg leading-8 text-theme-secondary">"{testimonial.quote}"</p>
              <div className="mt-8 space-y-1">
                <p className="font-semibold text-theme-primary">{testimonial.author}</p>
                <p className="text-sm text-theme-muted">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
