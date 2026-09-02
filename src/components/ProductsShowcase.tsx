import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';

type Product = {
  title: string;
  tag: string;
  description: string;
  highlight: string;
  highlights: string[];
  image: string;
  link: string;
};

function ProductRow({ product, icon: Icon, reversed }: { product: Product; icon: LucideIcon; reversed: boolean }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
      <Reveal direction={reversed ? 'right' : 'left'} className={reversed ? 'md:order-2' : ''}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
          <CheckCircle2 size={13} />
          {product.highlight}
        </span>

        <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-primary">
          <Icon size={22} />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">{product.tag}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-theme-primary sm:text-3xl">{product.title}</h3>
        <p className="mt-4 leading-7 text-theme-secondary">{product.description}</p>

        <ul className="mt-6 space-y-2.5">
          {product.highlights.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-theme-secondary">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-primary" />
              {point}
            </li>
          ))}
        </ul>

        <a
          href={product.link}
          target="_blank"
          rel="noreferrer"
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-accent"
        >
          Visit product
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </Reveal>

      <Reveal direction={reversed ? 'left' : 'right'} delay={0.1} className={reversed ? 'md:order-1' : ''}>
        <div className="shine-border group relative overflow-hidden rounded-[28px] border border-theme shadow-glow-lg">
          <Image
            src={product.image}
            alt={product.title}
            width={760}
            height={570}
            className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </Reveal>
    </div>
  );
}

export default function ProductsShowcase({ products, icons }: { products: Product[]; icons: LucideIcon[] }) {
  return (
    <div className="space-y-24">
      {products.map((product, index) => (
        <ProductRow key={product.title} product={product} icon={icons[index] ?? icons[0]} reversed={index % 2 === 1} />
      ))}
    </div>
  );
}
