'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  ArrowRight,
  Check,
  Columns3,
  Download,
  Inbox,
  Mail,
  MessageCircle,
  Phone,
  Rows3,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { patchSubmission, removeSubmission } from '../../app/admin/actions';
import { formatDateTime, initials, phoneDigits, pipeline, relativeTime, stageLabels, waitingDays } from '../../lib/admin-format';
import type { Submission, SubmissionKind, SubmissionPatch, SubmissionStatus } from '../../lib/submissions';

type Filter = 'active' | SubmissionStatus | 'starred';

const VIEW_KEY = 'craftlanee-admin-view';

type Props = {
  kind: SubmissionKind;
  items: Submission[];
  now: number;
  initialId?: string;
};

const kindCopy = {
  contact: { title: 'Contact leads', eyebrow: 'Business enquiries', empty: 'No enquiries yet. They’ll land here the moment someone submits the contact form.' },
  internship: { title: 'Internship applications', eyebrow: 'Student registrations', empty: 'No applications yet. New registrations from the internship page will appear here.' },
};

function subtitle(item: Submission) {
  return item.kind === 'contact' ? item.data.businessName : `${item.data.domain} · ${item.data.college}`;
}

function searchableText(item: Submission) {
  return Object.values(item.data).flat().join(' ').concat(' ', item.notes).toLowerCase();
}

function isTyping(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(element && (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)));
}

export default function SubmissionInbox({ kind, items: initialItems, now, initialId }: Props) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<Filter>('active');
  const [query, setQuery] = useState('');
  const [facet, setFacet] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(initialId ?? null);
  const [mobileOpen, setMobileOpen] = useState(Boolean(initialId));
  const [toast, setToast] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'board'>('list');
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      if (localStorage.getItem(VIEW_KEY) === 'board' && !initialId) setView('board');
    } catch {}
  }, [initialId]);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => setItems(initialItems), [initialItems]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const facetOptions = useMemo(() => {
    const values = items.flatMap((item) => (item.kind === 'contact' ? item.data.serviceNeeded : [item.data.domain]));
    return Array.from(new Set(values)).sort();
  }, [items]);

  const counts = useMemo(
    () => ({
      active: items.filter((item) => item.status !== 'archived').length,
      new: items.filter((item) => item.status === 'new').length,
      progress: items.filter((item) => item.status === 'progress').length,
      done: items.filter((item) => item.status === 'done').length,
      starred: items.filter((item) => item.starred).length,
      archived: items.filter((item) => item.status === 'archived').length,
    }),
    [items],
  );

  const searched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (facet) {
        const values = item.kind === 'contact' ? item.data.serviceNeeded : [item.data.domain];
        if (!values.includes(facet)) return false;
      }
      return !needle || searchableText(item).includes(needle);
    });
  }, [items, query, facet]);

  const visible = useMemo(
    () =>
      searched.filter((item) => {
        if (filter === 'active') return item.status !== 'archived';
        if (filter === 'starred') return item.starred;
        return item.status === filter;
      }),
    [searched, filter],
  );

  function changeView(next: 'list' | 'board') {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {}
  }

  function openInList(id: string) {
    setFilter('active');
    changeView('list');
    select(id);
  }

  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;

  function applyPatch(id: string, patch: SubmissionPatch, message?: string) {
    const previous = items;
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    if (message) setToast(message);
    startTransition(async () => {
      try {
        const ok = await patchSubmission(id, patch);
        if (!ok) throw new Error('Not found');
      } catch {
        setItems(previous);
        setToast('Couldn’t save that change. Please retry.');
      }
    });
  }

  function remove(id: string) {
    const previous = items;
    setItems((current) => current.filter((item) => item.id !== id));
    setMobileOpen(false);
    setToast('Deleted permanently');
    startTransition(async () => {
      try {
        await removeSubmission(id);
      } catch {
        setItems(previous);
        setToast('Couldn’t delete. Please retry.');
      }
    });
  }

  function select(id: string) {
    setSelectedId(id);
    setMobileOpen(true);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === '/' && !isTyping(event.target)) {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (event.key === 'Escape') {
        if (isTyping(event.target)) (event.target as HTMLElement).blur();
        setMobileOpen(false);
        return;
      }
      if (isTyping(event.target)) return;
      if (event.key.toLowerCase() === 'b') {
        changeView(view === 'list' ? 'board' : 'list');
        return;
      }
      if (view !== 'list' || !selected) return;

      const index = visible.findIndex((item) => item.id === selected.id);
      const key = event.key.toLowerCase();

      if (key === 'j' || event.key === 'ArrowDown') {
        event.preventDefault();
        const next = visible[Math.min(index + 1, visible.length - 1)];
        if (next) setSelectedId(next.id);
      } else if (key === 'k' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = visible[Math.max(index - 1, 0)];
        if (prev) setSelectedId(prev.id);
      } else if (key === 's') {
        applyPatch(selected.id, { starred: !selected.starred });
      } else if (key === 'e') {
        const archived = selected.status === 'archived';
        applyPatch(selected.id, { status: archived ? 'new' : 'archived' }, archived ? 'Restored to inbox' : 'Archived');
      } else if (['1', '2', '3'].includes(key)) {
        const stage = pipeline[Number(key) - 1];
        applyPatch(selected.id, { status: stage }, `Moved to ${stageLabels[kind][stage]}`);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!selected) return;
    listRef.current?.querySelector(`[data-id="${selected.id}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const filters: { id: Filter; label: string }[] = [
    { id: 'active', label: 'All' },
    { id: 'new', label: stageLabels[kind].new },
    { id: 'progress', label: stageLabels[kind].progress },
    { id: 'done', label: stageLabels[kind].done },
    { id: 'starred', label: 'Starred' },
    { id: 'archived', label: 'Archived' },
  ];

  const copy = kindCopy[kind];

  return (
    <div className="flex flex-col lg:h-screen">
      <header className="border-b border-theme bg-theme-surface px-4 pb-4 pt-5 sm:px-8 lg:pt-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-theme-muted">{copy.eyebrow}</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-theme-primary sm:text-3xl">
              {copy.title}
              <span className="ml-3 align-middle text-base font-medium tabular-nums text-theme-muted">{items.length}</span>
            </h1>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="flex rounded-xl border border-theme bg-theme-surface-alt p-1" role="group" aria-label="Layout">
              {([
                ['list', Rows3, 'List'],
                ['board', Columns3, 'Board'],
              ] as const).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeView(id)}
                  aria-pressed={view === id}
                  title={`${label} view (B)`}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                    view === id ? 'admin-card text-theme-primary' : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </div>
            <label className="relative flex-1 sm:w-72 sm:flex-none">
              <span className="sr-only">Search</span>
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" aria-hidden="true" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, notes…"
                className="w-full rounded-xl border border-theme bg-theme-surface py-2.5 pl-10 pr-10 text-sm text-theme-primary outline-none transition placeholder:text-theme-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-theme px-1.5 font-mono text-[10px] text-theme-muted sm:block">/</kbd>
            </label>
            <a
              href={`/api/admin/export?type=${kind}`}
              className="flex items-center gap-2 rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 text-sm font-medium text-theme-secondary transition hover:border-brand-primary hover:text-theme-primary"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </a>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {view === 'list' ? (
          <div className="admin-scroll-none -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Filter by stage">
            {filters.map(({ id, label }) => {
              const active = filter === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active ? 'bg-theme-primary-ink text-theme-inverse' : 'text-theme-muted hover:bg-theme-surface-soft hover:text-theme-primary'
                  }`}
                >
                  {label}
                  <span className={`tabular-nums text-xs ${active ? 'opacity-70' : 'opacity-60'}`}>{counts[id]}</span>
                </button>
              );
            })}
          </div>
          ) : (
            <p className="text-sm text-theme-muted">Drag cards between columns to move them through the pipeline. Archived items are hidden.</p>
          )}
          {facetOptions.length > 0 && (
            <select
              value={facet}
              onChange={(event) => setFacet(event.target.value)}
              aria-label={kind === 'contact' ? 'Filter by service' : 'Filter by domain'}
              className="ml-auto rounded-full border border-theme bg-theme-surface px-3.5 py-1.5 text-sm text-theme-secondary outline-none focus:border-brand-primary"
            >
              <option value="">{kind === 'contact' ? 'All services' : 'All domains'}</option>
              {facetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {view === 'board' ? (
        <Board
          kind={kind}
          items={searched.filter((item) => item.status !== 'archived')}
          now={now}
          onMove={(id, status) => applyPatch(id, { status }, `Moved to ${stageLabels[kind][status]}`)}
          onOpen={openInList}
        />
      ) : (
      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(320px,400px)_1fr]">
        <ul ref={listRef} className="border-theme lg:min-h-0 lg:overflow-y-auto lg:border-r" aria-label={copy.title}>
          {visible.length === 0 ? (
            <li className="flex h-full flex-col items-center justify-center gap-3 px-8 py-20 text-center">
              <span className="rounded-2xl bg-theme-surface-soft p-4 text-theme-muted">
                <Inbox size={28} />
              </span>
              <p className="max-w-xs text-sm text-theme-muted">{items.length === 0 ? copy.empty : 'Nothing matches these filters.'}</p>
            </li>
          ) : (
            visible.map((item) => {
              const active = selected?.id === item.id;
              const unread = item.status === 'new';
              return (
                <li key={item.id} data-id={item.id}>
                  <button
                    type="button"
                    onClick={() => select(item.id)}
                    aria-current={active ? 'true' : undefined}
                    className={`relative flex w-full gap-3 border-b border-theme px-4 py-4 text-left transition sm:px-6 ${
                      active ? 'bg-brand-primary/[0.07]' : 'hover:bg-theme-surface-soft'
                    }`}
                  >
                    {active && <span className="absolute inset-y-0 left-0 w-[3px] bg-brand-primary" aria-hidden="true" />}
                    <Avatar name={item.data.name} kind={item.kind} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        {unread && <span className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-brand-primary" aria-label="New" />}
                        <span className={`truncate text-[15px] ${unread ? 'font-bold text-theme-primary' : 'font-medium text-theme-secondary'}`}>{item.data.name}</span>
                        <time className="ml-auto shrink-0 text-xs tabular-nums text-theme-muted" dateTime={item.createdAt}>
                          {relativeTime(item.createdAt, now)}
                        </time>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-theme-secondary">{subtitle(item)}</span>
                      <span className="mt-1 line-clamp-1 text-sm text-theme-muted">{item.data.message || '—'}</span>
                      <span className="mt-2 flex items-center gap-2">
                        <StageBadge kind={item.kind} status={item.status} />
                        {item.starred && <Star size={14} className="fill-amber-400 text-amber-400" aria-label="Starred" />}
                        {item.notes && <span className="text-xs text-theme-muted">· has notes</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <section
          className={`min-h-0 overflow-y-auto bg-theme-background ${
            mobileOpen && selected ? 'fixed inset-0 z-50 block' : 'hidden'
          } lg:static lg:z-auto lg:block`}
          aria-label="Submission detail"
        >
          {selected ? (
            <Detail
              key={selected.id}
              item={selected}
              now={now}
              onBack={() => setMobileOpen(false)}
              onPatch={(patch, message) => applyPatch(selected.id, patch, message)}
              onDelete={() => remove(selected.id)}
            />
          ) : (
            <div className="hidden h-full items-center justify-center text-sm text-theme-muted lg:flex">Select an item to read it.</div>
          )}
        </section>
      </div>

      )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-theme-primary-ink px-5 py-2.5 text-sm font-medium text-theme-inverse shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function Avatar({ name, kind }: { name: string; kind: SubmissionKind }) {
  const color = kind === 'contact' ? 'var(--viz-contact)' : 'var(--viz-internship)';
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
      style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
    >
      {initials(name)}
    </span>
  );
}

function StageBadge({ kind, status }: { kind: SubmissionKind; status: SubmissionStatus }) {
  const step = pipeline.indexOf(status);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-theme px-2 py-0.5 text-[11px] font-semibold text-theme-secondary">
      {status === 'archived' ? (
        <Archive size={11} aria-hidden="true" />
      ) : (
        <span className="flex gap-0.5" aria-hidden="true">
          {pipeline.map((stage, index) => (
            <span key={stage} className={`h-1.5 w-1.5 rounded-full ${index <= step ? 'bg-brand-primary' : 'bg-theme-surface-soft ring-1 ring-inset ring-[var(--color-border)]'}`} />
          ))}
        </span>
      )}
      {stageLabels[kind][status]}
    </span>
  );
}

type DetailProps = {
  item: Submission;
  now: number;
  onBack: () => void;
  onPatch: (patch: SubmissionPatch, message?: string) => void;
  onDelete: () => void;
};

function Detail({ item, now, onBack, onPatch, onDelete }: DetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const archived = item.status === 'archived';
  const waiting = waitingDays(item.createdAt, now);
  const phone = phoneDigits(item.data.mobile);

  const fields: [string, string][] =
    item.kind === 'contact'
      ? [
          ['Business', item.data.businessName],
          ['Email', item.data.email],
          ['Mobile', item.data.mobile],
        ]
      : [
          ['College', item.data.college],
          ['Course', item.data.course],
          ['Year', item.data.yearOfStudy],
          ['Email', item.data.email],
          ['Mobile', `+91 ${item.data.mobile}`],
          ['Mode', item.data.mode],
          ['Duration', item.data.duration],
        ];

  const tags = item.kind === 'contact' ? item.data.serviceNeeded : [item.data.domain];

  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-8 lg:pt-8">
      <button type="button" onClick={onBack} className="mb-4 flex items-center gap-2 text-sm font-medium text-theme-muted lg:hidden">
        <ArrowLeft size={16} /> Back to list
      </button>

      <div className="flex flex-wrap items-start gap-4">
        <span className="scale-125 origin-top-left">
          <Avatar name={item.data.name} kind={item.kind} />
        </span>
        <div className="min-w-0 flex-1 pl-2">
          <h2 className="font-display text-2xl font-bold text-theme-primary sm:text-3xl">{item.data.name}</h2>
          <p className="mt-1 text-sm text-theme-muted">
            Submitted {formatDateTime(item.createdAt)}
            {item.status === 'new' && waiting >= 1 && (
              <span className={`ml-2 font-semibold ${waiting >= 3 ? 'text-rose-500' : 'text-amber-500'}`}>· waiting {waiting}d</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onPatch({ starred: !item.starred })}
          aria-pressed={item.starred}
          aria-label={item.starred ? 'Unstar' : 'Star'}
          className="rounded-xl border border-theme p-2.5 text-theme-muted transition hover:text-amber-400"
        >
          <Star size={18} className={item.starred ? 'fill-amber-400 text-amber-400' : ''} />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {item.data.email && (
          <QuickAction href={`mailto:${item.data.email}?subject=${encodeURIComponent(item.kind === 'contact' ? `Re: your enquiry with CraftLanee` : `Your CraftLanee internship application`)}`} icon={Mail} label="Email" primary />
        )}
        <QuickAction href={`tel:+${phone}`} icon={Phone} label="Call" />
        <QuickAction href={`https://wa.me/${phone}`} icon={MessageCircle} label="WhatsApp" external />
      </div>

      <StageTrack item={item} onPatch={onPatch} />

      <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-theme bg-[var(--color-border)] sm:grid-cols-2">
        {fields.map(([label, value], index) => (
          <div key={label} className={`bg-theme-surface px-5 py-4 ${index === fields.length - 1 && fields.length % 2 === 1 ? 'sm:col-span-2' : ''}`}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-theme-muted">{label}</dt>
            <dd className="mt-1 break-words text-[15px] font-medium text-theme-primary">{value || '—'}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-theme-link">
            {tag}
          </span>
        ))}
      </div>

      <section className="mt-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-theme-muted">
          {item.kind === 'contact' ? 'Business details' : 'About the student'}
        </h3>
        <blockquote className="mt-3 whitespace-pre-line border-l-2 border-brand-primary pl-5 text-[15px] leading-relaxed text-theme-secondary">
          {item.data.message || 'No message provided.'}
        </blockquote>
      </section>

      <NotesField initial={item.notes} onSave={(notes) => onPatch({ notes })} />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-6">
        <button
          type="button"
          onClick={() => onPatch({ status: archived ? 'new' : 'archived' }, archived ? 'Restored to inbox' : 'Archived')}
          className="flex items-center gap-2 rounded-xl border border-theme px-4 py-2.5 text-sm font-medium text-theme-secondary transition hover:text-theme-primary"
        >
          {archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
          {archived ? 'Restore' : 'Archive'}
        </button>
        <button
          type="button"
          onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            confirmDelete ? 'bg-rose-500 text-white' : 'text-theme-muted hover:text-rose-500'
          }`}
        >
          <Trash2 size={16} />
          {confirmDelete ? 'Click again to delete forever' : 'Delete'}
        </button>
      </div>
    </article>
  );
}

function QuickAction({ href, icon: Icon, label, primary, external }: { href: string; icon: typeof Mail; label: string; primary?: boolean; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        primary ? 'bg-brand-primary text-white shadow-glow hover:brightness-110' : 'border border-theme bg-theme-surface text-theme-secondary hover:border-brand-primary hover:text-theme-primary'
      }`}
    >
      <Icon size={16} />
      {label}
    </a>
  );
}

function StageTrack({ item, onPatch }: { item: Submission; onPatch: DetailProps['onPatch'] }) {
  const current = pipeline.indexOf(item.status);
  return (
    <div className="mt-8">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-theme-muted">Pipeline</p>
      <ol className="grid grid-cols-3 gap-2">
        {pipeline.map((stage, index) => {
          const reached = index <= current;
          const isCurrent = index === current;
          return (
            <li key={stage}>
              <button
                type="button"
                onClick={() => onPatch({ status: stage }, `Moved to ${stageLabels[item.kind][stage]}`)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`group w-full rounded-xl border px-3 py-3 text-left transition ${
                  isCurrent ? 'border-brand-primary bg-brand-primary/10' : 'border-theme bg-theme-surface hover:border-brand-primary/60'
                }`}
              >
                <span className={`mb-2 block h-1 rounded-full ${reached ? 'bg-brand-primary' : 'bg-theme-surface-soft'}`} aria-hidden="true" />
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-semibold ${reached ? 'text-theme-primary' : 'text-theme-muted'}`}>{stageLabels[item.kind][stage]}</span>
                  {reached && !isCurrent ? (
                    <Check size={14} className="text-brand-primary" aria-hidden="true" />
                  ) : (
                    <kbd className="hidden font-mono text-[10px] text-theme-muted sm:inline">{index + 1}</kbd>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function NotesField({ initial, onSave }: { initial: string; onSave: (notes: string) => void }) {
  const [value, setValue] = useState(initial);
  const [state, setState] = useState<'idle' | 'dirty' | 'saved'>('idle');
  const saveRef = useRef(onSave);
  const pendingRef = useRef<string | null>(null);

  useEffect(() => {
    saveRef.current = onSave;
  });

  useEffect(() => {
    if (state !== 'dirty') return;
    const timer = setTimeout(() => {
      saveRef.current(value);
      pendingRef.current = null;
      setState('saved');
    }, 900);
    return () => clearTimeout(timer);
  }, [value, state]);

  // Flush an unsaved edit when the admin jumps to another item before the debounce fires.
  useEffect(
    () => () => {
      if (pendingRef.current !== null) saveRef.current(pendingRef.current);
    },
    [],
  );

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-theme-muted">Private notes</h3>
        <span className="text-xs text-theme-muted" aria-live="polite">
          {state === 'dirty' ? 'Saving…' : state === 'saved' ? 'Saved' : ''}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          pendingRef.current = event.target.value;
          setState('dirty');
        }}
        rows={4}
        placeholder="Call summary, follow-up date, quoted price… only admins see this."
        className="mt-3 w-full resize-y rounded-2xl border border-dashed border-theme bg-theme-surface-soft px-4 py-3 text-sm leading-relaxed text-theme-primary outline-none transition placeholder:text-theme-muted focus:border-solid focus:border-brand-primary"
      />
    </section>
  );
}

function Board({
  kind,
  items,
  now,
  onMove,
  onOpen,
}: {
  kind: SubmissionKind;
  items: Submission[];
  now: number;
  onMove: (id: string, status: SubmissionStatus) => void;
  onOpen: (id: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<SubmissionStatus | null>(null);

  return (
    <div className="admin-scroll-none flex min-h-0 flex-1 gap-4 overflow-x-auto p-4 sm:p-6">
      {pipeline.map((stage, stageIndex) => {
        const cards = items.filter((item) => item.status === stage);
        const next = pipeline[stageIndex + 1];
        const isOver = overStage === stage && dragId !== null;
        return (
          <section
            key={stage}
            aria-label={stageLabels[kind][stage]}
            onDragOver={(event) => {
              event.preventDefault();
              setOverStage(stage);
            }}
            onDragLeave={() => setOverStage((current) => (current === stage ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData('text/plain');
              const card = items.find((item) => item.id === id);
              if (card && card.status !== stage) onMove(id, stage);
              setDragId(null);
              setOverStage(null);
            }}
            className={`flex w-[300px] shrink-0 flex-col rounded-2xl border p-3 transition lg:w-auto lg:flex-1 ${
              isOver ? 'border-brand-primary bg-brand-primary/[0.06]' : 'border-theme bg-theme-surface-soft'
            }`}
          >
            <header className="mb-3 flex items-center justify-between px-1">
              <span className="flex items-center gap-2 text-sm font-semibold text-theme-primary">
                <span className="flex gap-0.5" aria-hidden="true">
                  {pipeline.map((dot, index) => (
                    <span key={dot} className={`h-1.5 w-1.5 rounded-full ${index <= stageIndex ? 'bg-brand-primary' : 'bg-theme-surface ring-1 ring-inset ring-[var(--color-border)]'}`} />
                  ))}
                </span>
                {stageLabels[kind][stage]}
              </span>
              <span className="rounded-full bg-theme-surface px-2 py-0.5 text-xs font-semibold tabular-nums text-theme-muted">{cards.length}</span>
            </header>

            <ul className="flex min-h-[120px] flex-1 flex-col gap-2.5 overflow-y-auto lg:min-h-0">
              {cards.length === 0 && (
                <li className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-theme px-4 py-8 text-center text-xs text-theme-muted">
                  Drop a card here
                </li>
              )}
              {cards.map((item) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', item.id);
                    event.dataTransfer.effectAllowed = 'move';
                    setDragId(item.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverStage(null);
                  }}
                  className={`admin-card group cursor-grab rounded-xl p-3.5 transition hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing ${dragId === item.id ? 'opacity-40' : ''}`}
                >
                  <button type="button" onClick={() => onOpen(item.id)} className="flex w-full items-start gap-3 text-left">
                    <Avatar name={item.data.name} kind={item.kind} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-theme-primary">{item.data.name}</span>
                        {item.starred && <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" aria-label="Starred" />}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-theme-muted">{subtitle(item)}</span>
                    </span>
                  </button>
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-theme-secondary">{item.data.message || 'No message provided.'}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <time className="text-[11px] tabular-nums text-theme-muted" dateTime={item.createdAt}>
                      {relativeTime(item.createdAt, now)}
                    </time>
                    {next && (
                      <button
                        type="button"
                        onClick={() => onMove(item.id, next)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-theme-link transition hover:bg-brand-primary/10 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
                      >
                        {stageLabels[kind][next]} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
