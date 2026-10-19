'use client';

export type ActivityDay = { key: string; label: string; contact: number; internship: number };

const series = [
  { id: 'contact', label: 'Contact leads', color: 'var(--viz-contact)' },
  { id: 'internship', label: 'Internship applications', color: 'var(--viz-internship)' },
] as const;

export default function ActivityChart({ days }: { days: ActivityDay[] }) {
  const peak = Math.max(1, ...days.map((day) => day.contact + day.internship));
  const top = peak <= 4 ? peak : Math.ceil(peak / 2) * 2;
  const ticks = top === 1 ? [0, 1] : [0, Math.round(top / 2), top];
  const totals = { contact: days.reduce((sum, day) => sum + day.contact, 0), internship: days.reduce((sum, day) => sum + day.internship, 0) };

  return (
    <figure className="m-0">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-theme-secondary">
        {series.map((item) => (
          <span key={item.id} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: item.color }} aria-hidden="true" />
            {item.label}
            <span className="font-semibold tabular-nums text-theme-primary">{totals[item.id]}</span>
          </span>
        ))}
      </div>

      <div className="relative mt-6 flex gap-3" aria-hidden="true">
        <div className="relative h-48 w-6 shrink-0 text-right text-[11px] tabular-nums text-theme-muted">
          {ticks.map((tick) => (
            <span key={tick} className="absolute right-0 translate-y-1/2 leading-none" style={{ bottom: `${(tick / top) * 100}%` }}>
              {tick}
            </span>
          ))}
        </div>

        <div className="relative h-48 flex-1">
          {ticks.map((tick) => (
            <span
              key={tick}
              className={`absolute inset-x-0 border-t ${tick === 0 ? 'border-theme' : 'border-dashed border-theme opacity-60'}`}
              style={{ bottom: `${(tick / top) * 100}%` }}
            />
          ))}

          {totals.contact + totals.internship === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
              <p className="rounded-full border border-theme bg-theme-surface px-4 py-2 text-sm text-theme-muted shadow-sm">
                No submissions in the last 30 days yet
              </p>
            </div>
          )}
          <div className="absolute inset-0 flex items-end gap-[3px]">
            {days.map((day, index) => {
              const total = day.contact + day.internship;
              const align = index < 4 ? 'left-0' : index > days.length - 5 ? 'right-0' : 'left-1/2 -translate-x-1/2';
              return (
                <div key={day.key} tabIndex={0} className="group relative flex h-full flex-1 flex-col justify-end outline-none">
                  <span className="absolute inset-0 rounded-md transition group-hover:bg-theme-surface-soft group-focus-visible:bg-theme-surface-soft" />
                  {day.internship > 0 && (
                    <span
                      className="relative mb-[2px] rounded-t-[4px]"
                      style={{ height: `calc(${(day.internship / top) * 100}% - 2px)`, background: 'var(--viz-internship)' }}
                    />
                  )}
                  {day.contact > 0 && (
                    <span
                      className={`relative ${day.internship > 0 ? '' : 'rounded-t-[4px]'}`}
                      style={{ height: `${(day.contact / top) * 100}%`, background: 'var(--viz-contact)' }}
                    />
                  )}

                  <span
                    className={`pointer-events-none absolute bottom-full z-10 mb-2 hidden w-max min-w-[150px] rounded-xl border border-theme bg-theme-surface p-3 text-xs shadow-xl group-hover:block group-focus-visible:block ${align}`}
                  >
                    <span className="block font-semibold text-theme-primary">{day.label}</span>
                    {series.map((item) => (
                      <span key={item.id} className="mt-1.5 flex items-center gap-2 text-theme-secondary">
                        <span className="h-2 w-2 rounded-sm" style={{ background: item.color }} />
                        <span className="flex-1">{item.id === 'contact' ? 'Leads' : 'Applications'}</span>
                        <span className="font-semibold tabular-nums text-theme-primary">{day[item.id]}</span>
                      </span>
                    ))}
                    <span className="mt-2 flex justify-between border-t border-theme pt-1.5 text-theme-muted">
                      Total <span className="font-semibold tabular-nums text-theme-primary">{total}</span>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-between pl-9 text-[11px] text-theme-muted" aria-hidden="true">
        <span>{days[0]?.label}</span>
        <span>{days[Math.floor(days.length / 2)]?.label}</span>
        <span>Today</span>
      </div>

      <div className="sr-only">
      <table>
        <caption>Submissions per day, last {days.length} days</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Contact leads</th>
            <th scope="col">Internship applications</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.key}>
              <th scope="row">{day.label}</th>
              <td>{day.contact}</td>
              <td>{day.internship}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  );
}
