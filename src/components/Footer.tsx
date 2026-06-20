import Link from 'next/link';
import content from '../../content.json';

export default function Footer() {
  return (
    <footer className="bg-black/95 px-6 py-16 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]">
        <div className="space-y-4">
          <p className="text-xl font-semibold text-white">Craftlanee</p>
          <p className="max-w-sm leading-7 text-slate-400">{content.footer.description}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Explore</h3>
          <div className="space-y-2">
            {content.footer.links.map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Legal</h3>
          <div className="space-y-2">
            {content.footer.legal.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="block text-sm transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Connect</p>
          <p className="text-sm leading-7 text-slate-400">hello@craftlanee.com</p>
          <p className="text-sm leading-7 text-slate-400">+91 99000 00000</p>
          <p className="text-sm leading-7 text-slate-400">Hyderabad, India</p>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
        {content.footer.copyright}
      </div>
    </footer>
  );
}
