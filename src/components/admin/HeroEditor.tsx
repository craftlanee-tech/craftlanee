'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { AlertTriangle, Check, ExternalLink, ImagePlus, Loader2, Maximize2, Minimize2, Orbit, Trash2, UploadCloud } from 'lucide-react';
import type { HeroButtons, HeroFit, HeroSettings } from '../../lib/site-settings';
import { formatDateTime } from '../../lib/admin-format';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024;

export default function HeroEditor({
  initial,
  useBlob,
  missingStorage,
  diagnostics,
}: {
  initial: HeroSettings;
  useBlob: boolean;
  missingStorage: string[];
  diagnostics: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(initial);
  const [mode, setMode] = useState(initial.mode);
  const [fit, setFit] = useState<HeroFit>(initial.fit);
  const [alt, setAlt] = useState(initial.photo?.alt ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [buttons, setButtons] = useState<HeroButtons>(initial.buttons);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const photoSrc = preview ?? saved.photo?.src ?? null;
  const buttonsDirty = JSON.stringify(buttons) !== JSON.stringify(saved.buttons);
  const dirty = Boolean(file) || mode !== saved.mode || fit !== saved.fit || (saved.photo ? alt !== saved.photo.alt : false) || buttonsDirty;

  function setButton(which: 'primary' | 'secondary', field: 'label' | 'href', value: string) {
    setButtons((current) => ({ ...current, [which]: { ...current[which], [field]: value } }));
  }

  function pick(next: File | undefined) {
    if (!next) return;
    if (!ACCEPT.includes(next.type)) {
      setMessage({ tone: 'error', text: 'Use a JPG, PNG, WebP or AVIF image.' });
      return;
    }
    if (next.size > MAX_BYTES) {
      setMessage({ tone: 'error', text: 'That image is over 5 MB. Please compress it and try again.' });
      return;
    }
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setMode('photo');
    setMessage(null);
  }

  async function submit(extra?: Record<string, string>) {
    setBusy(true);
    setMessage(null);
    const body = new FormData();
    body.set('mode', mode);
    body.set('fit', fit);
    body.set('alt', alt);
    body.set('primaryLabel', buttons.primary.label);
    body.set('primaryHref', buttons.primary.href);
    body.set('secondaryLabel', buttons.secondary.label);
    body.set('secondaryHref', buttons.secondary.href);
    body.set('secondaryVisible', buttons.secondary.visible ? '1' : '0');
    Object.entries(extra ?? {}).forEach(([key, value]) => body.set(key, value));

    try {
      if (file && !extra?.remove) {
        if (useBlob) {
          // Upload straight from the browser to Vercel Blob; the server only stores the resulting URL.
          const blob = await upload(`hero/${file.name.replace(/[^\w.-]+/g, '-')}`, file, {
            access: 'public',
            handleUploadUrl: '/api/admin/hero/upload',
            contentType: file.type,
          });
          body.set('photoUrl', blob.url);
        } else {
          body.set('photo', file);
        }
      }

      const response = await fetch('/api/admin/hero', { method: 'POST', body });
      const text = await response.text();
      let result: { hero?: HeroSettings; error?: string } = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        result = { error: response.status === 413 ? 'That image is too large to upload.' : `Server error (${response.status}). Please try again.` };
      }
      if (!response.ok || !result.hero) throw new Error(result.error ?? `Could not save (${response.status}).`);
      setSaved(result.hero);
      setButtons(result.hero.buttons);
      setMode(result.hero.mode);
      setFit(result.hero.fit);
      setAlt(result.hero.photo?.alt ?? '');
      setFile(null);
      setPreview(null);
      setConfirmRemove(false);
      setMessage({ tone: 'ok', text: extra?.remove ? 'Photo removed. The illustration is back on the homepage.' : 'Published. The homepage is updated.' });
      router.refresh();
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1360px] px-4 pb-16 pt-6 sm:px-8 lg:pt-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-theme-muted">Website</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-theme-primary sm:text-[40px] sm:leading-[1.1]">Homepage hero</h1>
          <p className="mt-2 max-w-xl text-theme-secondary">Choose what visitors see beside your headline: the animated orbit illustration, or a photo of your own.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-sm font-semibold text-theme-secondary transition hover:border-brand-primary hover:text-theme-primary">
          View homepage <ExternalLink size={15} />
        </a>
      </header>

      {missingStorage.length > 0 && (
        <div role="alert" className="mt-6 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-theme-secondary">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold text-theme-primary">Connect storage to publish photos</p>
            <p className="mt-1">
              This site runs on Vercel, which can&apos;t save files. In your Vercel project open <strong>Storage</strong>, connect{' '}
              <strong>{missingStorage.join(' and ')}</strong> to this project, then redeploy.
            </p>
            {diagnostics && <p className="mt-2 font-mono text-xs text-theme-muted">{diagnostics}</p>}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.05fr]">
        {/* Controls */}
        <section className="admin-card rounded-3xl p-5 sm:p-7">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-muted">1 · Pick a visual</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Hero visual">
            <OptionCard
              selected={mode === 'illustration'}
              onSelect={() => setMode('illustration')}
              title="Orbit illustration"
              note="Animated, default"
              live={saved.mode === 'illustration'}
            >
              <MiniOrbit />
            </OptionCard>
            <OptionCard
              selected={mode === 'photo'}
              onSelect={() => (photoSrc ? setMode('photo') : inputRef.current?.click())}
              title="Your photo"
              note={photoSrc ? 'Uploaded image' : 'Upload to enable'}
              live={saved.mode === 'photo'}
            >
              {photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoSrc} alt="" className={`h-full w-full ${fit === 'contain' ? 'object-contain p-2' : 'object-cover'}`} />
              ) : (
                <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-theme-muted">
                  <ImagePlus size={26} />
                  <span className="text-xs">No photo yet</span>
                </span>
              )}
            </OptionCard>
          </div>

          <h2 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-muted">2 · Photo</h2>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              pick(event.dataTransfer.files[0]);
            }}
            className={`mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
              dragging ? 'border-brand-primary bg-brand-primary/[0.06]' : 'border-theme hover:border-brand-primary/60 hover:bg-theme-surface-soft'
            }`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
              <UploadCloud size={20} />
            </span>
            <span className="text-sm font-semibold text-theme-primary">
              {file ? file.name : saved.photo ? 'Replace photo' : 'Drop an image here, or click to browse'}
            </span>
            <span className="text-xs text-theme-muted">JPG, PNG, WebP or AVIF · up to 5 MB · portrait (4:5) looks best</span>
          </button>
          <input ref={inputRef} type="file" accept={ACCEPT.join(',')} className="hidden" onChange={(event) => pick(event.target.files?.[0] ?? undefined)} />

          {photoSrc && (
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-theme-secondary">Describe the photo</span>
                <input
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                  maxLength={200}
                  placeholder="e.g. The CraftLanee team at our Kuppam office"
                  className="w-full rounded-xl border border-theme bg-theme-surface-alt px-3.5 py-2.5 text-sm text-theme-primary outline-none transition placeholder:text-theme-muted focus:border-brand-primary"
                />
                <span className="mt-1 block text-xs text-theme-muted">Read aloud by screen readers and used by Google.</span>
              </label>
              <div>
                <span className="mb-1.5 block text-sm font-medium text-theme-secondary">Framing</span>
                <div className="flex rounded-xl border border-theme bg-theme-surface-alt p-1" role="group" aria-label="Framing">
                  {([
                    ['cover', Maximize2, 'Fill'],
                    ['contain', Minimize2, 'Fit'],
                  ] as const).map(([id, Icon, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={fit === id}
                      onClick={() => setFit(id)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${fit === id ? 'admin-card text-theme-primary' : 'text-theme-muted hover:text-theme-primary'}`}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <h2 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-muted">3 · Buttons</h2>
          <div className="mt-4 space-y-3">
            {(['primary', 'secondary'] as const).map((which) => {
              const hidden = which === 'secondary' && !buttons.secondary.visible;
              return (
                <div key={which} className="rounded-2xl border border-theme bg-theme-surface-alt p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-theme-primary">
                      <span
                        aria-hidden="true"
                        className={`h-3 w-6 rounded-full ${which === 'primary' ? 'bg-brand-primary' : 'border-2 border-brand-primary/60'}`}
                      />
                      {which === 'primary' ? 'Main button' : 'Second button'}
                    </span>
                    {which === 'secondary' && (
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-theme-muted">
                        Show
                        <input
                          type="checkbox"
                          checked={buttons.secondary.visible}
                          onChange={(event) => setButtons((current) => ({ ...current, secondary: { ...current.secondary, visible: event.target.checked } }))}
                          className="h-4 w-4 accent-[var(--color-primary)]"
                        />
                      </label>
                    )}
                  </div>
                  <div className={`grid gap-3 sm:grid-cols-2 ${hidden ? 'pointer-events-none opacity-40' : ''}`}>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-theme-muted">Text</span>
                      <input
                        value={buttons[which].label}
                        onChange={(event) => setButton(which, 'label', event.target.value)}
                        maxLength={40}
                        placeholder={which === 'primary' ? 'Start a project' : 'Explore services'}
                        className="w-full rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 text-sm text-theme-primary outline-none transition placeholder:text-theme-muted focus:border-brand-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-theme-muted">Link</span>
                      <input
                        value={buttons[which].href}
                        onChange={(event) => setButton(which, 'href', event.target.value)}
                        maxLength={300}
                        placeholder="/services or https://wa.me/91…"
                        className="w-full rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 font-mono text-[13px] text-theme-primary outline-none transition placeholder:text-theme-muted focus:border-brand-primary"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-theme-muted">Links can be a page on your site (like /services), a full web address, mailto: or tel:.</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-theme pt-6">
            <button
              type="button"
              disabled={!dirty || busy}
              onClick={() => submit()}
              className="flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Publish to homepage
            </button>
            {dirty && !busy && (
              <button
                type="button"
                onClick={() => {
                  setMode(saved.mode);
                  setButtons(saved.buttons);
                  setFit(saved.fit);
                  setAlt(saved.photo?.alt ?? '');
                  setFile(null);
                  setPreview(null);
                  setMessage(null);
                }}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-theme-muted transition hover:text-theme-primary"
              >
                Discard changes
              </button>
            )}
            {saved.photo && !file && (
              <button
                type="button"
                disabled={busy}
                onClick={() => (confirmRemove ? submit({ remove: '1' }) : setConfirmRemove(true))}
                onBlur={() => setConfirmRemove(false)}
                className={`ml-auto flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  confirmRemove ? 'bg-rose-500 text-white' : 'text-theme-muted hover:text-rose-500'
                }`}
              >
                <Trash2 size={15} />
                {confirmRemove ? 'Click again to delete photo' : 'Delete photo'}
              </button>
            )}
          </div>

          {message && (
            <p role="status" className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${message.tone === 'ok' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
              {message.text}
            </p>
          )}
        </section>

        {/* Live preview */}
        <section className="admin-card overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-theme px-5 py-3.5">
            <span className="flex items-center gap-2">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </span>
              <span className="ml-2 text-xs text-theme-muted">craftlanee.com</span>
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${dirty ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>
              {dirty ? 'Preview · not published' : 'Live'}
            </span>
          </div>

          <div className="relative grid grid-cols-[1.05fr_0.95fr] items-center gap-6 overflow-hidden p-6 sm:p-10" style={{ background: 'var(--hero-gradient)' }}>
            <div aria-hidden="true" className="space-y-3">
              <div className="h-2 w-20 rounded-full bg-brand-primary/40" />
              <div className="h-5 w-[90%] rounded-md bg-theme-primary-ink/80" />
              <div className="h-5 w-[70%] rounded-md bg-theme-primary-ink/80" />
              <div className="h-5 w-[55%] rounded-md bg-brand-primary/80" />
              <div className="space-y-1.5 pt-2">
                <div className="h-1.5 w-full rounded-full bg-theme-primary-ink/15" />
                <div className="h-1.5 w-[85%] rounded-full bg-theme-primary-ink/15" />
                <div className="h-1.5 w-[70%] rounded-full bg-theme-primary-ink/15" />
              </div>
              <div className="flex gap-2 pt-3">
                <span className="max-w-[9rem] truncate rounded-full bg-brand-primary px-3 py-1 text-[10px] font-semibold text-white">{buttons.primary.label || 'Button'}</span>
                {buttons.secondary.visible && (
                  <span className="max-w-[9rem] truncate rounded-full border border-brand-primary/50 px-3 py-1 text-[10px] font-semibold text-theme-secondary">
                    {buttons.secondary.label || 'Button'}
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              {mode === 'photo' && photoSrc ? (
                <div className="rounded-[18px] bg-gradient-to-br from-brand-primary via-brand-accent to-brand-primary p-[2px] shadow-glow">
                  <div className={`aspect-[4/5] overflow-hidden rounded-[16px] ${fit === 'contain' ? 'bg-theme-surface' : ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoSrc} alt={alt} className={`h-full w-full ${fit === 'contain' ? 'object-contain p-3' : 'object-cover'}`} />
                  </div>
                </div>
              ) : (
                <MiniOrbit large />
              )}
            </div>
          </div>

          <p className="border-t border-theme px-5 py-3.5 text-xs text-theme-muted">
            {saved.mode === 'photo' && saved.photo
              ? `Photo live since ${formatDateTime(saved.photo.uploadedAt)}.`
              : saved.photo
                ? 'Illustration is live. Your uploaded photo is kept, so you can switch back any time.'
                : 'The orbit illustration is live.'}
          </p>
        </section>
      </div>
    </main>
  );
}

function OptionCard({
  selected,
  onSelect,
  title,
  note,
  live,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  note: string;
  live: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl border-2 p-2 text-left transition ${
        selected ? 'border-brand-primary bg-brand-primary/[0.04]' : 'border-theme hover:border-brand-primary/40'
      }`}
    >
      <span className="relative flex aspect-[4/3] overflow-hidden rounded-xl bg-theme-surface-soft" style={{ background: 'var(--hero-gradient)' }}>
        {children}
      </span>
      <span className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-3">
        <span>
          <span className="block text-sm font-semibold text-theme-primary">{title}</span>
          <span className="block text-xs text-theme-muted">{note}</span>
        </span>
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${selected ? 'border-brand-primary bg-brand-primary text-white' : 'border-theme'}`}
          aria-hidden="true"
        >
          {selected && <Check size={12} strokeWidth={3} />}
        </span>
      </span>
      {live && (
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-theme-surface/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600 shadow-sm backdrop-blur dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
        </span>
      )}
    </button>
  );
}

function MiniOrbit({ large = false }: { large?: boolean }) {
  const nodes = [0, 60, 120, 180, 240, 300];
  return (
    <span className={`relative mx-auto flex aspect-square items-center justify-center ${large ? 'w-full' : 'h-[88%] self-center'}`} aria-hidden="true">
      <span className="absolute inset-[8%] rounded-full border border-brand-primary/25" />
      <span className="absolute inset-[22%] rounded-full border border-brand-primary/15" />
      {nodes.map((angle) => (
        <span
          key={angle}
          className="absolute left-1/2 top-1/2 flex h-[13%] w-[13%] items-center justify-center rounded-[28%] bg-gradient-to-br from-brand-primary to-brand-accent shadow-glow"
          // Node is 13% of the box; translating by ~320% of itself puts it on the outer ring (~42% radius).
          style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-320%) rotate(-${angle}deg)` }}
        />
      ))}
      <span className="flex h-[30%] w-[22%] items-center justify-center rounded-[18%] border-2 border-brand-primary bg-[#0d1220] shadow-glow-lg">
        <Orbit className="h-1/2 w-1/2 text-brand-accent" />
      </span>
    </span>
  );
}
