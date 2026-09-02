import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageFooter from '../../components/PageFooter';
import SectionHeader from '../../components/SectionHeader';
import GradientMesh from '../../components/GradientMesh';
import HeroImage from '../../components/HeroImage';
import ProductsShowcase from '../../components/ProductsShowcase';
import Reveal from '../../components/Reveal';
import { BookOpen, GraduationCap, MapPin, Package } from 'lucide-react';
import { getContent } from '../../lib/content';
import { createPageMetadata, siteName } from '../../lib/seo';

const content = getContent();

const productIcons = [GraduationCap, BookOpen, MapPin];

export const metadata = createPageMetadata({
  title: `Products | ${siteName}`,
  description: content.products.subtitle,
  path: '/products',
  keywords: ['CraftLanee products', 'software products', 'digital products Kuppam'],
});

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10 sm:py-28">
        <GradientMesh />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <SectionHeader eyebrow={content.products.eyebrow} title={content.products.title} description={content.products.subtitle} />
            </Reveal>

            <HeroImage
              src="/images/port2.png"
              alt="Products built by CraftLanee"
              badgeIcon={Package}
              badgeLabel="Built by us"
              badgeValue="Live products"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <ProductsShowcase products={content.products.items} icons={productIcons} />
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <Reveal className="mx-auto max-w-3xl rounded-2xl border border-brand-primary/30 bg-gradient-to-br from-brand-primary/15 to-brand-primary/5 p-10 text-center backdrop-blur-sm">
          <h3 className="font-display text-2xl font-bold md:text-3xl">Have a product idea in mind?</h3>
          <p className="mt-3 text-justify text-theme-secondary">
            Talk to CraftLanee about building, launching, or scaling your next digital product.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-2.5 font-semibold text-white transition hover:bg-brand-accent"
            >
              Contact CraftLanee
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-brand-primary/50 px-6 py-2.5 font-semibold text-brand-primary transition hover:bg-brand-primary/10"
            >
              Explore Services
            </a>
          </div>
        </Reveal>
      </section>

      <PageFooter />
      <Footer />
    </main>
  );
}
