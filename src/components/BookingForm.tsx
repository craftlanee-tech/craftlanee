'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, Megaphone, PhoneCall } from 'lucide-react';
import Button from './Button';
import { bookableDates, bookingTypes, formatBookingDate, timeSlots } from '../lib/booking-slots';

type BookingFormState = {
  name: string;
  email: string;
  mobile: string;
  bookingType: string;
  date: string;
  time: string;
  message: string;
};

type BookingFormErrors = Partial<Record<keyof BookingFormState, string>>;

const typeIcons: Record<string, typeof Megaphone> = {
  'Digital Marketing': Megaphone,
  Appointment: PhoneCall,
};

const initialForm: BookingFormState = {
  name: '',
  email: '',
  mobile: '',
  bookingType: '',
  date: '',
  time: '',
  message: '',
};

const inputClass = (invalid: boolean) =>
  `w-full rounded-3xl border bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary ${invalid ? 'border-rose-400' : 'border-theme'}`;

const chipClass = (active: boolean, disabled = false) =>
  `rounded-2xl border px-3 py-2.5 text-sm font-medium transition ${
    disabled
      ? 'cursor-not-allowed border-theme text-theme-muted line-through opacity-50'
      : active
        ? 'border-brand-primary bg-brand-primary text-white'
        : 'border-theme bg-theme-surface-alt text-theme-secondary hover:border-brand-primary/60 hover:text-theme-primary'
  }`;

export default function BookingForm() {
  const [form, setForm] = useState<BookingFormState>(initialForm);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [dates, setDates] = useState<string[]>([]);
  const [taken, setTaken] = useState<string[]>([]);
  const [booked, setBooked] = useState<BookingFormState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Dates depend on "today", so work them out in the browser rather than at build time.
  useEffect(() => setDates(bookableDates()), []);

  useEffect(() => {
    if (!form.bookingType || !form.date) {
      setTaken([]);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/booking?type=${encodeURIComponent(form.bookingType)}&date=${form.date}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { taken?: string[] }) => setTaken(data.taken ?? []))
      .catch(() => undefined);
    return () => controller.abort();
  }, [form.bookingType, form.date, booked]);

  const update = (field: keyof BookingFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      // A new type or date can make the chosen time unavailable.
      ...(field === 'bookingType' || field === 'date' ? { time: '' } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus('idle');
  };

  const validateForm = () => {
    const nextErrors: BookingFormErrors = {};

    if (!form.bookingType) nextErrors.bookingType = 'Choose what you want to book.';
    if (!form.date) nextErrors.date = 'Pick a date.';
    if (!form.time) nextErrors.time = 'Pick a time slot.';
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.mobile.trim()) nextErrors.mobile = 'Mobile number is required.';
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      formRef.current?.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStatus('sending');
    setServerError('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        if (response.status === 409) {
          setTaken((current) => [...current, form.time]);
          setForm((current) => ({ ...current, time: '' }));
        }
        setServerError(data.error ?? 'Something went wrong. Try again.');
        setStatus('error');
        return;
      }

      setBooked(form);
      setForm(initialForm);
      setErrors({});
      setStatus('success');
    } catch (error) {
      console.error(error);
      setServerError('Something went wrong. Try again.');
      setStatus('error');
    }
  };

  if (status === 'success' && booked) {
    return (
      <div className="shine-border space-y-5 rounded-[32px] border border-theme bg-theme-surface-soft p-8 text-center shadow-glow backdrop-blur-xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-primary">
          <CalendarCheck size={26} />
        </span>
        <h2 className="font-display text-2xl font-bold text-theme-primary">Your slot is booked</h2>
        <p className="text-theme-secondary">
          <span className="font-semibold text-theme-primary">{booked.bookingType}</span> on{' '}
          <span className="font-semibold text-theme-primary">{formatBookingDate(booked.date)}</span> at{' '}
          <span className="font-semibold text-theme-primary">{booked.time}</span>.
        </p>
        <p className="text-sm text-theme-muted">Our team will contact you on {booked.mobile} to confirm.</p>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            setBooked(null);
            setStatus('idle');
          }}
        >
          Book another slot
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="shine-border space-y-8 rounded-[32px] border border-theme bg-theme-surface-soft p-6 shadow-glow backdrop-blur-xl sm:p-8">
      <fieldset className="space-y-3" data-error={Boolean(errors.bookingType)}>
        <legend className="mb-3 text-sm font-medium text-theme-primary">1. What would you like to book?</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {bookingTypes.map((type) => {
            const Icon = typeIcons[type.id] ?? CalendarCheck;
            const active = form.bookingType === type.id;

            return (
              <button
                key={type.id}
                type="button"
                aria-pressed={active}
                onClick={() => update('bookingType', type.id)}
                className={`flex h-full flex-col gap-3 rounded-3xl border p-5 text-left transition ${
                  active ? 'border-brand-primary bg-brand-primary/10 shadow-glow' : 'border-theme bg-theme-surface-alt hover:border-brand-primary/60'
                }`}
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-brand-primary text-white' : 'bg-brand-primary/15 text-brand-primary'}`}>
                  <Icon size={20} />
                </span>
                <span className="font-display text-lg font-bold text-theme-primary">{type.title}</span>
                <span className="text-sm leading-6 text-theme-secondary">{type.description}</span>
              </button>
            );
          })}
        </div>
        {errors.bookingType ? <p className="text-sm text-rose-300">{errors.bookingType}</p> : null}
      </fieldset>

      <fieldset className="space-y-3" data-error={Boolean(errors.date)}>
        <legend className="mb-3 text-sm font-medium text-theme-primary">2. Pick a date</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {dates.map((date) => (
            <button key={date} type="button" aria-pressed={form.date === date} onClick={() => update('date', date)} className={chipClass(form.date === date)}>
              <span className="block text-xs opacity-80">{formatBookingDate(date, { weekday: 'short' })}</span>
              <span className="block">{formatBookingDate(date, { day: 'numeric', month: 'short' })}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-theme-muted">Monday to Saturday. We are closed on Sundays.</p>
        {errors.date ? <p className="text-sm text-rose-300">{errors.date}</p> : null}
      </fieldset>

      <fieldset className="space-y-3" data-error={Boolean(errors.time)}>
        <legend className="mb-3 text-sm font-medium text-theme-primary">3. Pick a time slot</legend>
        {form.bookingType && form.date ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {timeSlots.map((time) => {
              const unavailable = taken.includes(time);

              return (
                <button
                  key={time}
                  type="button"
                  disabled={unavailable}
                  aria-pressed={form.time === time}
                  onClick={() => update('time', time)}
                  className={chipClass(form.time === time, unavailable)}
                  title={unavailable ? 'Already booked' : undefined}
                >
                  {time}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-theme px-4 py-3 text-sm text-theme-muted">Choose a booking type and date to see open slots.</p>
        )}
        {errors.time ? <p className="text-sm text-rose-300">{errors.time}</p> : null}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-3 text-sm font-medium text-theme-primary">4. Your details</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1" data-error={Boolean(errors.name)}>
            <label htmlFor="booking-name" className="text-sm text-theme-secondary">Name</label>
            <input id="booking-name" type="text" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} className={inputClass(Boolean(errors.name))} />
            {errors.name ? <p className="text-sm text-rose-300">{errors.name}</p> : null}
          </div>
          <div className="space-y-1" data-error={Boolean(errors.mobile)}>
            <label htmlFor="booking-mobile" className="text-sm text-theme-secondary">Mobile</label>
            <input id="booking-mobile" type="tel" inputMode="tel" autoComplete="tel" value={form.mobile} onChange={(event) => update('mobile', event.target.value)} aria-invalid={Boolean(errors.mobile)} className={inputClass(Boolean(errors.mobile))} placeholder="+91 98765 43210" />
            {errors.mobile ? <p className="text-sm text-rose-300">{errors.mobile}</p> : null}
          </div>
        </div>
        <div className="space-y-1" data-error={Boolean(errors.email)}>
          <label htmlFor="booking-email" className="text-sm text-theme-secondary">Email</label>
          <input id="booking-email" type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} className={inputClass(Boolean(errors.email))} placeholder="you@example.com" />
          {errors.email ? <p className="text-sm text-rose-300">{errors.email}</p> : null}
        </div>
        <div className="space-y-1">
          <label htmlFor="booking-message" className="text-sm text-theme-secondary">Anything we should know? (optional)</label>
          <textarea id="booking-message" rows={4} value={form.message} onChange={(event) => update('message', event.target.value)} className={`resize-none ${inputClass(false)}`} placeholder="Your business, goals, or questions for the call." />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button type="submit" variant="primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Booking...' : 'Book Slot'}
        </Button>
        {form.bookingType && form.date && form.time ? (
          <p className="text-sm text-theme-muted">
            {form.bookingType} · {formatBookingDate(form.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {form.time}
          </p>
        ) : null}
        {status === 'error' ? <p className="w-full text-sm text-rose-300">{serverError}</p> : null}
      </div>
    </form>
  );
}
