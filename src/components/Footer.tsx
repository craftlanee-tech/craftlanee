import Link from 'next/link';
import { getContent } from '../lib/content';
import ThemeToggle from './ThemeToggle';

const content = getContent();

export default function Footer() {
  return (
    <footer className="bg-theme-surface-alt px-6 py-16 text-theme-secondary">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]">
        <div className="space-y-4">
          <p className="text-xl font-semibold text-theme-primary">Craftlanee</p>
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
          <p className="text-sm leading-7 text-theme-secondary">hello@craftlanee.com</p>
          <p className="text-sm leading-7 text-theme-secondary">+91 99000 00000</p>
          <p className="text-sm leading-7 text-theme-secondary">Hyderabad, India</p>
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
