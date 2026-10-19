'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ExternalLink, GraduationCap, ImageIcon, Keyboard, LayoutGrid, LogOut, MessagesSquare } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { logout } from '../../app/admin/actions';

type Props = {
  stats: { newContacts: number; newInternships: number; overdue: number; total: number };
};

const shortcuts: [string, string][] = [
  ['J  K', 'Next / previous'],
  ['1 2 3', 'Move stage'],
  ['S', 'Star'],
  ['E', 'Archive'],
  ['/', 'Search'],
  ['B', 'List / board'],
];

export default function AdminSidebar({ stats }: Props) {
  const pathname = usePathname();
  const awaiting = stats.newContacts + stats.newInternships;

  const links = [
    { href: '/admin', label: 'Overview', short: 'Overview', icon: LayoutGrid, count: 0 },
    { href: '/admin/contacts', label: 'Contact leads', short: 'Leads', icon: MessagesSquare, count: stats.newContacts },
    { href: '/admin/internships', label: 'Internships', short: 'Interns', icon: GraduationCap, count: stats.newInternships },
    { href: '/admin/site', label: 'Homepage hero', short: 'Hero', icon: ImageIcon, count: 0 },
  ];

  const nav = (
    <nav aria-label="Admin" className="admin-scroll-none -mx-1 flex gap-1 overflow-x-auto px-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {links.map(({ href, label, short, icon: Icon, count }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {active && <span className="absolute inset-y-2.5 -left-4 hidden w-[3px] rounded-r-full bg-brand-primary lg:block" aria-hidden="true" />}
            <Icon size={18} className={active ? 'text-white' : 'text-white/45 group-hover:text-white/80'} />
            <span className="flex-1 whitespace-nowrap">
              <span className="lg:hidden">{short}</span>
              <span className="hidden lg:inline">{label}</span>
            </span>
            {count > 0 && (
              <span className="min-w-[22px] rounded-full bg-brand-primary px-1.5 py-0.5 text-center text-[11px] font-bold tabular-nums text-white" aria-label={`${count} new`}>
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <aside className="sticky top-0 z-40 overflow-hidden bg-[var(--admin-ink)] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-[272px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-32 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(var(--color-primary-rgb) / 0.45), transparent 65%)' }}
      />

      {/* Mobile / tablet bar */}
      <div className="relative px-4 pb-2 pt-3 lg:hidden">
        <div className="mb-2 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/images/craftlanee-logo-white.png" alt="CraftLanee" width={120} height={30} className="h-6 w-auto" />
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle onDark />
            <form action={logout}>
              <button type="submit" aria-label="Sign out" className="rounded-xl border border-white/10 p-2.5 text-white/60 transition hover:text-white">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
        {nav}
      </div>

      {/* Desktop rail */}
      <div className="relative hidden h-full flex-col px-4 py-6 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-3">
          <Image src="/images/craftlanee-logo-white.png" alt="CraftLanee" width={130} height={32} className="h-7 w-auto" />
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">Admin</span>
        </Link>

        <p className="mb-2 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">Workspace</p>
        {nav}

        <Link
          href={stats.overdue ? '/admin' : awaiting ? '/admin/contacts' : '/admin'}
          className="group mt-8 block rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
        >
          <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
            <span className="relative flex h-2 w-2">
              {awaiting > 0 && <span className={`absolute inset-0 animate-ping rounded-full ${stats.overdue ? 'bg-rose-400' : 'bg-amber-300'} opacity-60`} />}
              <span className={`relative h-2 w-2 rounded-full ${stats.overdue ? 'bg-rose-400' : awaiting ? 'bg-amber-300' : 'bg-emerald-400'}`} />
            </span>
            Status
          </span>
          <span className="mt-3 block font-display text-3xl font-bold tabular-nums">{awaiting}</span>
          <span className="mt-0.5 flex items-center justify-between text-sm text-white/55">
            {awaiting === 0 ? 'All caught up' : stats.overdue ? `${stats.overdue} waiting 3+ days` : 'awaiting a reply'}
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <details className="group mt-4 rounded-2xl px-3 text-sm text-white/55 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 py-2 transition hover:text-white">
            <Keyboard size={16} /> Keyboard shortcuts
            <ChevronRight size={14} className="ml-auto transition-transform group-open:rotate-90" />
          </summary>
          <ul className="space-y-1.5 pb-2 pt-1 text-xs">
            {shortcuts.map(([keys, label]) => (
              <li key={keys} className="flex items-center justify-between">
                <span>{label}</span>
                <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/80">{keys}</kbd>
              </li>
            ))}
          </ul>
        </details>

        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/55 transition hover:text-white">
          <ExternalLink size={16} /> View website
        </a>

        <div className="mt-auto flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-[#eb6834] text-xs font-bold">AD</span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold">Administrator</span>
            <span className="block text-xs text-white/45">{stats.total} total records</span>
          </span>
          <form action={logout}>
            <button type="submit" aria-label="Sign out" title="Sign out" className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white">
              <LogOut size={16} />
            </button>
          </form>
        </div>
        <div className="mt-3 flex items-center justify-between px-1 text-xs text-white/40">
          <span>Appearance</span>
          <ThemeToggle onDark />
        </div>
      </div>
    </aside>
  );
}
