'use client';

import { useActionState, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { login, type LoginState } from '../../app/admin/actions';

export default function LoginForm({ next, configured }: { next: string; configured: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  const [reveal, setReveal] = useState(false);

  return (
    <form action={formAction} className="mt-10 space-y-5">
      <input type="hidden" name="next" value={next} />

      {!configured && (
        <p className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-theme-secondary">
          Set <code className="font-semibold">ADMIN_PASSWORD</code> in <code>.env.local</code> and restart the server to enable sign in.
        </p>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-theme-secondary">Password</span>
        <span className="relative block">
          <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" aria-hidden="true" />
          <input
            name="password"
            type={reveal ? 'text' : 'password'}
            autoComplete="current-password"
            required
            autoFocus
            aria-invalid={Boolean(state.error)}
            className="w-full rounded-2xl border border-theme bg-theme-surface-alt py-3.5 pl-11 pr-12 text-theme-primary outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/15"
          />
          <button
            type="button"
            onClick={() => setReveal((value) => !value)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-theme-muted transition hover:text-theme-primary"
          >
            {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </span>
      </label>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-rose-500">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !configured}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3.5 font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Checking…' : 'Enter dashboard'}
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
