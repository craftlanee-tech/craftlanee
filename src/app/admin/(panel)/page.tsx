import Link from 'next/link';
import { connection } from 'next/server';
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, GraduationCap, Hourglass, ImageIcon, MessagesSquare, Trophy } from 'lucide-react';
import ActivityChart, { type ActivityDay } from '../../../components/admin/ActivityChart';
import { dayKey, initials, relativeTime, stageLabels, waitingDays } from '../../../lib/admin-format';
import { listSubmissions, type Submission, type SubmissionKind } from '../../../lib/submissions';

export const metadata = { title: 'Overview | CraftLanee Admin' };

const DAY = 86_400_000;
const WINDOW = 30;
const SPARK_DAYS = 14;

// The pipeline card is always ink-dark, so it uses the dark-surface steps of each series hue.
const inkSeries: Record<SubmissionKind, string> = { contact: '#5b8cff', internship: '#d95926' };

function greeting(now: number) {
  const hour = Number(new Date(now).toLocaleString('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }));
  if (hour < 5) return 'Working late';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function inWindow(item: Submission, now: number, start: number, end: number) {
  const age = now - new Date(item.createdAt).getTime();
  return age >= start * DAY && age < end * DAY;
}

function countBy(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function dailySeries(items: Submission[], now: number, days: number) {
  const keys = Array.from({ length: days }, (_, index) => dayKey(new Date(now - (days - 1 - index) * DAY)));
  const counts = new Map(keys.map((key) => [key, 0]));
  items.forEach((item) => {
    const key = dayKey(new Date(item.createdAt));
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return keys.map((key) => counts.get(key) ?? 0);
}

export default async function AdminOverviewPage() {
  await connection();
  const now = Date.now();
  const submissions = await listSubmissions();
  const contacts = submissions.filter((item) => item.kind === 'contact');
  const internships = submissions.filter((item) => item.kind === 'internship');

  const awaiting = submissions.filter((item) => item.status === 'new');
  const newContacts = awaiting.filter((item) => item.kind === 'contact').length;
  const newInterns = awaiting.length - newContacts;
  const oldest = [...awaiting].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const overdue = oldest.filter((item) => waitingDays(item.createdAt, now) >= 3).length;

  const leads30 = contacts.filter((item) => inWindow(item, now, 0, WINDOW)).length;
  const leadsPrev = contacts.filter((item) => inWindow(item, now, WINDOW, WINDOW * 2)).length;
  const apps30 = internships.filter((item) => inWindow(item, now, 0, WINDOW)).length;
  const appsPrev = internships.filter((item) => inWindow(item, now, WINDOW, WINDOW * 2)).length;

  const decided = contacts.filter((item) => item.status !== 'archived');
  const closed = decided.filter((item) => item.status === 'done').length;
  const closeRate = decided.length ? Math.round((closed / decided.length) * 100) : 0;

  const byDay = new Map<string, ActivityDay>();
  for (let offset = WINDOW - 1; offset >= 0; offset -= 1) {
    const date = new Date(now - offset * DAY);
    const key = dayKey(date);
    byDay.set(key, {
      key,
      label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }),
      contact: 0,
      internship: 0,
    });
  }
  submissions.forEach((item) => {
    const day = byDay.get(dayKey(new Date(item.createdAt)));
    if (day) day[item.kind] += 1;
  });

  const services = countBy(contacts.flatMap((item) => (item.kind === 'contact' ? item.data.serviceNeeded : []))).slice(0, 6);
  const domains = countBy(internships.map((item) => (item.kind === 'internship' ? item.data.domain : ''))).slice(0, 6);

  const stamp = new Date(now).toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <main className="mx-auto max-w-[1360px] px-4 pb-16 pt-6 sm:px-8 lg:pt-10">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-theme-muted">{stamp} IST</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-theme-primary sm:text-[40px] sm:leading-[1.1]">{greeting(now)}.</h1>
          <p className="mt-3 text-base leading-relaxed text-theme-secondary sm:text-lg">
            {awaiting.length === 0 ? (
              <>Inbox zero. Every enquiry has been picked up.</>
            ) : (
              <>
                <Link href="/admin/contacts" className="font-semibold text-theme-primary underline decoration-[var(--viz-contact)] decoration-2 underline-offset-[5px]">
                  {plural(newContacts, 'new lead')}
                </Link>{' '}
                and{' '}
                <Link href="/admin/internships" className="font-semibold text-theme-primary underline decoration-[var(--viz-internship)] decoration-2 underline-offset-[5px]">
                  {plural(newInterns, 'new application')}
                </Link>{' '}
                are waiting.
                {oldest[0] && (
                  <>
                    {' '}Oldest: <span className="font-semibold text-theme-primary">{oldest[0].data.name}</span>, {relativeTime(oldest[0].createdAt, now)}.
                  </>
                )}
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/site" className="flex items-center gap-2 rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-sm font-semibold text-theme-secondary transition hover:border-brand-primary hover:text-theme-primary">
            <ImageIcon size={16} /> Homepage hero
          </Link>
          <Link href="/admin/contacts" className="flex items-center gap-2 rounded-xl bg-theme-primary-ink px-4 py-2.5 text-sm font-semibold text-theme-inverse transition hover:opacity-90">
            Open inbox <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Signature pipeline card */}
      <section aria-label="Pipeline" className="relative mt-8 overflow-hidden rounded-[28px] bg-[var(--admin-ink)] p-6 text-white sm:p-8">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgb(var(--color-primary-rgb) / 0.5), transparent 65%)' }} />
        <div aria-hidden="true" className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(217,89,38,0.28), transparent 65%)' }} />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Pipeline</p>
            <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">Where every enquiry stands</h2>
          </div>
          <p className="text-sm text-white/50">{plural(submissions.length, 'record')} all-time</p>
        </div>

        <div className="relative mt-7 grid gap-5 lg:grid-cols-2">
          <PipelineRow kind="contact" title="Contact leads" icon={MessagesSquare} items={contacts} href="/admin/contacts" />
          <PipelineRow kind="internship" title="Internships" icon={GraduationCap} items={internships} href="/admin/internships" />
        </div>
      </section>

      {/* KPIs */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-label="Key numbers">
        <StatTile icon={Hourglass} label="Awaiting reply" value={awaiting.length} note={overdue ? `${overdue} older than 3 days` : awaiting.length ? 'All within 3 days' : 'Nothing pending'} tone={overdue ? 'warn' : 'ok'} />
        <StatTile icon={MessagesSquare} label="Leads · 30 days" value={leads30} delta={leads30 - leadsPrev} spark={dailySeries(contacts, now, SPARK_DAYS)} color="var(--viz-contact)" />
        <StatTile icon={GraduationCap} label="Applications · 30 days" value={apps30} delta={apps30 - appsPrev} spark={dailySeries(internships, now, SPARK_DAYS)} color="var(--viz-internship)" />
        <StatTile icon={Trophy} label="Lead close rate" value={`${closeRate}%`} note={`${closed} of ${decided.length} leads closed`} ring={closeRate} />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Activity" subtitle="Submissions per day, last 30 days">
          <ActivityChart days={Array.from(byDay.values())} />
        </Panel>

        <Panel title="Waiting longest" subtitle="Oldest unanswered first">
          {oldest.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="You’re all caught up" body="New enquiries will line up here, oldest first, so nobody waits too long." />
          ) : (
            <ul className="-mx-2">
              {oldest.slice(0, 6).map((item) => {
                const days = waitingDays(item.createdAt, now);
                const color = item.kind === 'contact' ? 'var(--viz-contact)' : 'var(--viz-internship)';
                return (
                  <li key={item.id}>
                    <Link
                      href={`/admin/${item.kind === 'contact' ? 'contacts' : 'internships'}?id=${item.id}`}
                      className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-theme-surface-soft"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
                        aria-hidden="true"
                      >
                        {initials(item.data.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-theme-primary">{item.data.name}</span>
                        <span className="block truncate text-xs text-theme-muted">
                          {item.kind === 'contact' ? `Lead · ${item.data.businessName}` : `Intern · ${item.data.domain}`}
                        </span>
                      </span>
                      <span
                        className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold tabular-nums ${
                          days >= 3 ? 'bg-rose-500/10 text-rose-500' : days >= 1 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-theme-surface-soft text-theme-muted'
                        }`}
                      >
                        <Clock size={11} aria-hidden="true" />
                        {days >= 1 ? `${days}d` : relativeTime(item.createdAt, now)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Services in demand" subtitle="What contact leads ask for" action={{ href: '/admin/contacts', label: 'Open leads' }}>
          <BarList
            rows={services}
            color="var(--viz-contact)"
            empty={{ title: 'No leads yet', body: 'Requested services will be ranked here once the contact form gets its first enquiry.', href: '/contact', cta: 'View contact page' }}
          />
        </Panel>
        <Panel title="Internship domains" subtitle="Where students want to grow" action={{ href: '/admin/internships', label: 'Open applications' }}>
          <BarList
            rows={domains}
            color="var(--viz-internship)"
            empty={{ title: 'No applications yet', body: 'Popular domains will be ranked here as students register on the internship page.', href: '/internship', cta: 'View internship page' }}
          />
        </Panel>
      </div>
    </main>
  );
}

function PipelineRow({ kind, title, icon: Icon, items, href }: { kind: SubmissionKind; title: string; icon: typeof Clock; items: Submission[]; href: string }) {
  const stages = (['new', 'progress', 'done'] as const).map((stage) => ({ stage, count: items.filter((item) => item.status === stage).length }));
  const total = stages.reduce((sum, stage) => sum + stage.count, 0);
  const conversion = total ? Math.round((stages[2].count / total) * 100) : 0;
  const color = inkSeries[kind];
  // Sequential ramp of one hue: later stages read darker/stronger.
  const ramp = [0.35, 0.65, 1];

  return (
    <Link href={href} className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${color} 22%, transparent)`, color }}>
            <Icon size={16} />
          </span>
          {title}
        </span>
        <span className="flex items-center gap-1 text-xs text-white/50 transition group-hover:text-white">
          {conversion}% converted <ArrowUpRight size={14} />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3">
        {stages.map(({ stage, count }, index) => (
          <div key={stage} className={`relative ${index > 0 ? 'border-l border-white/10 pl-4' : ''}`}>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">{stageLabels[kind][stage]}</p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums">{count}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex h-1.5 gap-[2px] overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
        {total > 0 &&
          stages.map(({ stage, count }, index) =>
            count > 0 ? <span key={stage} className="h-full first:rounded-l-full last:rounded-r-full" style={{ flex: count, background: color, opacity: ramp[index] }} /> : null,
          )}
      </div>
    </Link>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const width = 120;
  const height = 36;
  const max = Math.max(1, ...values);
  const points = values.map((value, index) => [(index / (values.length - 1)) * width, height - 3 - (value / max) * (height - 6)] as const);
  const line = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-[120px] overflow-visible" role="img" aria-label={`Last ${values.length} days: ${values.join(', ')}`}>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill={color} opacity={0.1} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={lastX} cy={lastY} r={3} fill={color} stroke="var(--color-surface)" strokeWidth={2} />
    </svg>
  );
}

function Ring({ value }: { value: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90" aria-hidden="true">
      <circle cx="20" cy="20" r={radius} fill="none" stroke="var(--color-surface-soft)" strokeWidth="4" />
      <circle cx="20" cy="20" r={radius} fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(value / 100) * circumference} ${circumference}`} />
    </svg>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  delta,
  note,
  tone,
  spark,
  color,
  ring,
}: {
  icon: typeof Clock;
  label: string;
  value: number | string;
  delta?: number;
  note?: string;
  tone?: 'ok' | 'warn';
  spark?: number[];
  color?: string;
  ring?: number;
}) {
  return (
    <div className="admin-card flex flex-col rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between text-theme-muted">
        <span className="text-xs font-medium sm:text-sm">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-theme-surface-soft">
          <Icon size={15} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-display text-3xl font-bold tabular-nums tracking-tight text-theme-primary sm:text-[40px] sm:leading-none">{value}</p>
        {spark && color && (
          <span className="hidden sm:block">
            <Sparkline values={spark} color={color} />
          </span>
        )}
        {ring !== undefined && <Ring value={ring} />}
      </div>
      {delta !== undefined ? (
        <p className="mt-2 text-xs text-theme-muted">
          <span className={`font-semibold ${delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : delta < 0 ? 'text-rose-500' : ''}`}>
            {delta > 0 ? '▲' : delta < 0 ? '▼' : '—'} {Math.abs(delta)}
          </span>{' '}
          vs previous 30 days
        </p>
      ) : (
        <p className={`mt-2 text-xs ${tone === 'warn' ? 'font-semibold text-rose-500' : 'text-theme-muted'}`}>{note}</p>
      )}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="admin-card flex flex-col rounded-3xl p-5 sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-theme-primary">{title}</h2>
          <p className="text-sm text-theme-muted">{subtitle}</p>
        </div>
        {action && (
          <Link href={action.href} className="group flex shrink-0 items-center gap-1 text-sm font-medium text-theme-link">
            {action.label}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}

function EmptyState({ icon: Icon, title, body, href, cta }: { icon: typeof Clock; title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-surface-soft text-theme-muted">
        <Icon size={22} />
      </span>
      <p className="mt-4 font-semibold text-theme-primary">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-theme-muted">{body}</p>
      {href && cta && (
        <a href={href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-theme-link">
          {cta} <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  );
}

function BarList({
  rows,
  color,
  empty,
}: {
  rows: { label: string; count: number }[];
  color: string;
  empty: { title: string; body: string; href: string; cta: string };
}) {
  if (rows.length === 0) {
    // Ghost bars hint at what this panel will look like once data arrives.
    return (
      <div className="relative flex flex-1 flex-col">
        <ul className="space-y-4 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true">
          {[88, 64, 46, 30].map((width) => (
            <li key={width}>
              <div className="mb-2 h-2.5 w-24 rounded-full bg-theme-surface-soft" />
              <div className="h-2 rounded-full border border-dashed border-theme" style={{ width: `${width}%` }} />
            </li>
          ))}
        </ul>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-semibold text-theme-primary">{empty.title}</p>
          <p className="mt-1 max-w-xs text-sm text-theme-muted">{empty.body}</p>
          <a href={empty.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-theme-link">
            {empty.cta} <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  const max = rows[0].count;
  return (
    <ul className="space-y-3.5">
      {rows.map((row) => (
        <li key={row.label} className="group">
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-theme-secondary group-hover:text-theme-primary">{row.label}</span>
            <span className="font-semibold tabular-nums text-theme-primary">{row.count}</span>
          </div>
          <div className="h-2 rounded-full bg-theme-surface-soft">
            <div className="h-full rounded-full transition-[filter] group-hover:brightness-110" style={{ width: `${(row.count / max) * 100}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
