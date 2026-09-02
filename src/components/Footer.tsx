import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { getContent } from '../lib/content';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const content = getContent();
const emailDetail = content.contact.details.find((detail) => detail.label === 'Email');
const phoneDetail = content.contact.details.find((detail) => detail.label === 'Phone');
const locationDetail = content.contact.details.find((detail) => detail.label === 'Location');

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden px-6 py-16 text-[#c7c9ce] sm:px-10 sm:py-20"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-primary) 16%, #06070a)',
      }}
    >
      <div className="pointer-events-none absolute -top-40 left-1/4 h-72 w-72 rounded-full bg-brand-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-72 w-72 rounded-full bg-theme-accent/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
          <div className="space-y-5">
            <Logo variant="white" className="h-10 w-36" />
            <p className="max-w-sm text-justify text-sm leading-7 text-[#9a9da3]">{content.footer.description}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary transition hover:gap-2.5 hover:text-brand-accent"
            >
              Start a project
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">Explore</h3>
            <div className="space-y-2.5">
              {content.footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block w-fit text-sm text-[#c7c9ce] transition hover:translate-x-1 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">Legal</h3>
            <div className="space-y-2.5">
              {content.footer.legal.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-fit text-sm text-[#c7c9ce] transition hover:translate-x-1 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">Connect</p>
            {emailDetail?.values[0] && (
              <a
                href={`mailto:${emailDetail.values[0]}`}
                className="flex items-center gap-2.5 text-sm leading-7 text-[#c7c9ce] transition hover:text-white"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-primary">
                  <Mail size={14} />
                </span>
                {emailDetail.values[0]}
              </a>
            )}
            {phoneDetail?.values[0] && (
              <a
                href={`tel:${phoneDetail.values[0].replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2.5 text-sm leading-7 text-[#c7c9ce] transition hover:text-white"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-primary">
                  <Phone size={14} />
                </span>
                {phoneDetail.values[0]}
              </a>
            )}
            {locationDetail?.values[0] && (
              <p className="flex items-start gap-2.5 text-sm leading-7 text-[#c7c9ce]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-primary">
                  <MapPin size={14} />
                </span>
                {locationDetail.values[0]}
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-[#7c7f86]">{content.footer.copyright}</p>
          <ThemeToggle onDark />
        </div>
      </div>
    </footer>
  );
}
