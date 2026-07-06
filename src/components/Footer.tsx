import Link from 'next/link';
import { getContent } from '../lib/content';
import ThemeToggle from './ThemeToggle';

const content = getContent();
const emailDetail = content.contact.details.find((detail) => detail.label === 'Email');
const phoneDetail = content.contact.details.find((detail) => detail.label === 'Phone');
const locationDetail = content.contact.details.find((detail) => detail.label === 'Location');

export default function Footer() {
  return (
    <footer className="bg-theme-surface-alt px-6 py-16 text-theme-secondary">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]">
        <div className="space-y-4">
          <p className="text-xl font-semibold text-theme-primary">{content.footer.company}</p>
          <p className="max-w-sm leading-7 text-theme-secondary">{content.footer.description}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Explore</h3>
          <div className="space-y-2">
            {content.footer.links.map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm transition hover:text-theme-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Legal</h3>
          <div className="space-y-2">
            {content.footer.legal.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="block text-sm transition hover:text-theme-primary">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Connect</p>
          {emailDetail?.values[0] && <p className="text-sm leading-7 text-theme-secondary">{emailDetail.values[0]}</p>}
          {phoneDetail?.values[0] && <p className="text-sm leading-7 text-theme-secondary">{phoneDetail.values[0]}</p>}
          {locationDetail?.values[0] && <p className="text-sm leading-7 text-theme-secondary">{locationDetail.values[0]}</p>}
        </div>

        <div className="lg:col-span-1">
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-12 border-t border-theme pt-8 text-center text-sm text-theme-muted">
        {content.footer.copyright}
      </div>
    </footer>
  );
}
