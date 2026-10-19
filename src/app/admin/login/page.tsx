import type { Metadata } from 'next';
import Image from 'next/image';
import LoginForm from '../../../components/admin/LoginForm';
import { isAdminConfigured } from '../../../lib/admin-auth';

export const metadata: Metadata = {
  title: 'Admin sign in | CraftLanee',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-screen bg-theme-background lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-[#07091a] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid absolute inset-0 opacity-[0.35] [--color-border:rgba(255,255,255,0.06)]" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(var(--color-primary-rgb) / 0.55), transparent 65%)' }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-10 h-[360px] w-[360px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(235,104,52,0.35), transparent 65%)' }}
        />

        <div className="relative flex items-center gap-3">
          <Image src="/images/craftlanee-logo-white.png" alt="CraftLanee" width={160} height={40} className="h-8 w-auto" />
        </div>

        <div className="relative max-w-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Control room</p>
          <h1 className="font-display text-5xl font-bold leading-[1.05]">
            Every enquiry is a <span className="text-[#ffb454]">conversation</span> waiting to start.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/60">
            Review new business leads and internship applications, move them through the pipeline, and never let one go cold.
          </p>
        </div>

        <div className="relative flex gap-8 text-sm text-white/50">
          <span>Leads</span>
          <span aria-hidden="true">→</span>
          <span>In talks</span>
          <span aria-hidden="true">→</span>
          <span className="text-white">Closed</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Image src="/images/craftlanee-mark.png" alt="" width={48} height={48} className="h-12 w-12 rounded-xl" />
          </div>
          <h2 className="font-display text-3xl font-bold text-theme-primary">Welcome back</h2>
          <p className="mt-2 text-sm text-theme-muted">Sign in to the CraftLanee admin dashboard.</p>
          <LoginForm next={next ?? '/admin'} configured={isAdminConfigured()} />
        </div>
      </section>
    </main>
  );
}
