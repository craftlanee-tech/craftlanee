'use client';

import { useState } from 'react';
import Button from './Button';

const internshipDomains = [
  'Digital Marketing',
  'Web Development',
  'App Development',
  'UI/UX Design',
  'Graphic Design',
  'Video Editing',
  'Artificial Intelligence',
  'Business Development',
];

const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Graduated'];
const modeOptions = ['On-site (Kuppam)', 'Remote', 'Hybrid'];
const durationOptions = ['1 Month', '2 Months', '3 Months', '6 Months'];

type InternshipFormState = {
  name: string;
  email: string;
  mobile: string;
  college: string;
  course: string;
  yearOfStudy: string;
  domain: string;
  mode: string;
  duration: string;
  message: string;
};

type InternshipFormErrors = Partial<Record<keyof InternshipFormState, string>>;

const initialForm: InternshipFormState = {
  name: '',
  email: '',
  mobile: '',
  college: '',
  course: '',
  yearOfStudy: '',
  domain: '',
  mode: '',
  duration: '',
  message: '',
};

const requiredMessages: Partial<Record<keyof InternshipFormState, string>> = {
  name: 'Name is required.',
  mobile: 'Mobile number is required.',
  college: 'College / institution is required.',
  course: 'Course / degree is required.',
  yearOfStudy: 'Select your year of study.',
  domain: 'Select an internship domain.',
  mode: 'Select a preferred mode.',
  duration: 'Select a preferred duration.',
};

const fieldOrder: (keyof InternshipFormState)[] = ['name', 'email', 'mobile', 'college', 'course', 'yearOfStudy', 'domain', 'mode', 'duration', 'message'];

function inputClassName(hasError: boolean) {
  return `w-full rounded-3xl border bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary ${hasError ? 'border-rose-400' : 'border-theme'}`;
}

export default function InternshipForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<InternshipFormState>(initialForm);
  const [errors, setErrors] = useState<InternshipFormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = event.target;
    const field = name as keyof InternshipFormState;
    const value = field === 'mobile' ? event.target.value.replace(/\D/g, '').slice(0, 10) : event.target.value;

    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setStatus('idle');
  };

  const validateForm = () => {
    const nextErrors: InternshipFormErrors = {};

    for (const field of fieldOrder) {
      const message = requiredMessages[field];

      if (message && !form[field].trim()) {
        nextErrors[field] = message;
      }

      if (field === 'mobile' && form.mobile && !/^\d{10}$/.test(form.mobile)) {
        nextErrors.mobile = 'Enter a valid 10-digit mobile number.';
      }

      if (field === 'email') {
        if (!form.email.trim()) {
          nextErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
          nextErrors.email = 'Enter a valid email address.';
        }
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);

    if (firstInvalidField) {
      setErrors(nextErrors);
      const element = document.getElementById(`internship-${firstInvalidField}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => element?.focus(), 250);
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to submit registration.');
      }

      setStatus('success');
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const renderError = (field: keyof InternshipFormState) =>
    errors[field] ? <p id={`internship-${field}-error`} className="text-sm text-rose-300">{errors[field]}</p> : null;

  const fieldProps = (field: keyof InternshipFormState) => ({
    id: `internship-${field}`,
    name: field,
    value: form[field],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `internship-${field}-error` : undefined,
    className: inputClassName(Boolean(errors[field])),
  });

  const renderSelect = (field: keyof InternshipFormState, label: string, options: string[], placeholder: string) => (
    <div className="space-y-1">
      <label htmlFor={`internship-${field}`} className="text-sm font-medium text-theme-primary">{label}</label>
      <select {...fieldProps(field)}>
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {renderError(field)}
    </div>
  );

  return (
    <form id="register" noValidate onSubmit={handleSubmit} className="shine-border scroll-mt-28 space-y-6 rounded-[32px] border border-theme bg-theme-surface-soft p-8 shadow-glow backdrop-blur-xl">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-theme-primary">Register for an internship</h2>
        <p className="text-sm leading-6 text-theme-secondary">Fill in your details and our team will reach out with batch dates and next steps.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="internship-name" className="text-sm font-medium text-theme-primary">Full Name</label>
          <input {...fieldProps('name')} type="text" autoComplete="name" placeholder="Your full name" />
          {renderError('name')}
        </div>

        <div className="space-y-1">
          <label htmlFor="internship-email" className="text-sm font-medium text-theme-primary">Email</label>
          <input {...fieldProps('email')} type="email" autoComplete="email" placeholder="you@example.com" />
          {renderError('email')}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="internship-mobile" className="text-sm font-medium text-theme-primary">Mobile Number</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">+91</span>
            <input
              {...fieldProps('mobile')}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              pattern="\d{10}"
              placeholder="9876543210"
              className={`${inputClassName(Boolean(errors.mobile))} pl-14`}
            />
          </div>
          {renderError('mobile')}
        </div>

        <div className="space-y-1">
          <label htmlFor="internship-college" className="text-sm font-medium text-theme-primary">College / Institution</label>
          <input {...fieldProps('college')} type="text" placeholder="Your college name" />
          {renderError('college')}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="internship-course" className="text-sm font-medium text-theme-primary">Course / Degree</label>
          <input {...fieldProps('course')} type="text" placeholder="e.g. B.Tech CSE, BCA, MBA" />
          {renderError('course')}
        </div>

        {renderSelect('yearOfStudy', 'Year of Study', yearOptions, 'Select year')}
      </div>

      {renderSelect('domain', 'Internship Domain', internshipDomains, 'Select a domain')}

      <div className="grid gap-6 md:grid-cols-2">
        {renderSelect('mode', 'Preferred Mode', modeOptions, 'Select mode')}
        {renderSelect('duration', 'Preferred Duration', durationOptions, 'Select duration')}
      </div>

      <div className="space-y-1">
        <label htmlFor="internship-message" className="text-sm font-medium text-theme-primary">
          Tell us about yourself <span className="text-theme-muted">(optional)</span>
        </label>
        <textarea
          {...fieldProps('message')}
          rows={5}
          className={`${inputClassName(false)} resize-none`}
          placeholder="Your skills, projects, portfolio links, or what you hope to learn."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button type="submit" variant="primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Submitting...' : 'Submit Registration'}
        </Button>
        {status === 'success' && <p className="text-sm text-emerald-300">Registration submitted! We&apos;ll contact you soon.</p>}
        {status === 'error' && <p className="text-sm text-rose-300">Something went wrong. Try again.</p>}
      </div>
    </form>
  );
}
