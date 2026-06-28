'use client';

import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mic, MicOff } from 'lucide-react';
import { getContent } from '../lib/content';
import Button from './Button';

const content = getContent();
const serviceOptions = content.services.groups.map((group) => group.category);

type ContactFormState = {
  name: string;
  businessName: string;
  mobile: string;
  email: string;
  serviceNeeded: string[];
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResultItem = {
  0?: SpeechRecognitionAlternative;
};

type SpeechRecognitionResults = {
  length: number;
  [index: number]: SpeechRecognitionResultItem;
};

type SpeechRecognitionResultEvent = Event & {
  resultIndex: number;
  results: SpeechRecognitionResults;
};

type SpeechRecognitionInstance = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const initialForm: ContactFormState = {
  name: '',
  businessName: '',
  mobile: '',
  email: '',
  serviceNeeded: [],
  message: '',
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildLeadSubject(form: ContactFormState) {
  return `New Craftlanee Lead: ${form.businessName}`;
}

function formatServices(services: string[]) {
  return services.join(', ');
}

function getServiceSummary(services: string[]) {
  if (services.length === 0) {
    return 'Select services';
  }

  if (services.length === 1) {
    return services[0];
  }

  return `${services.length} services selected`;
}

function appendSpeechText(baseText: string, speechText: string) {
  const cleanSpeechText = speechText.trim();

  if (!cleanSpeechText) {
    return baseText;
  }

  return `${baseText}${baseText.trim() ? ' ' : ''}${cleanSpeechText}`;
}

function buildLeadEmail(form: ContactFormState) {
  const services = formatServices(form.serviceNeeded);

  return [
    'New lead',
    `Name: ${form.name}`,
    `Business Name: ${form.businessName}`,
    `Mobile: ${form.mobile}`,
    `Email: ${form.email}`,
    `Services Needed: ${services}`,
    '',
    'Business Details:',
    form.message,
    '',
    'Recommended next step: contact the lead and confirm their business goal, timeline, and preferred service package.',
  ].join('\n');
}

function buildLeadEmailHtml(form: ContactFormState) {
  const subject = buildLeadSubject(form);
  const services = formatServices(form.serviceNeeded);
  const fields = [
    ['Name', form.name],
    ['Business Name', form.businessName],
    ['Mobile', form.mobile],
    ['Email', form.email],
    ['Services Needed', services],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #172033; line-height: 1.6; max-width: 640px;">
      <div style="background: #111827; color: #ffffff; padding: 24px; border-radius: 14px 14px 0 0;">
        <p style="margin: 0 0 6px; color: #f59e0b; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">Craftlanee Lead Inquiry</p>
        <h2 style="margin: 0; font-size: 24px;">${escapeHtml(subject)}</h2>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 14px 14px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">
          <tbody>
            ${fields
              .map(
                ([label, value]) => `
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 13px; width: 150px;">${label}</td>
                    <td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${escapeHtml(value)}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
        <div style="background: #f9fafb; border: 1px solid #eef2f7; border-radius: 12px; padding: 18px;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; font-weight: 700; text-transform: uppercase;">Business Details</p>
          <p style="margin: 0; color: #111827; white-space: pre-line;">${escapeHtml(form.message)}</p>
        </div>
        <p style="margin: 22px 0 0; color: #374151; font-size: 14px;">
          Recommended next step: contact the lead and confirm their business goal, timeline, and preferred service package.
        </p>
      </div>
    </div>
  `;
}

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [servicesOpen, setServicesOpen] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const businessNameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const serviceNeededRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const speechBaseTextRef = useRef('');
  const recognitionActiveRef = useRef(false);

  useEffect(() => {
    const speechWindow = window as Window &
      typeof globalThis & {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      };
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.onstart = () => {
      recognitionActiveRef.current = true;
      setIsListening(true);
    };
    recognition.onend = () => {
      recognitionActiveRef.current = false;
      setIsListening(false);
    };
    recognition.onerror = () => {
      recognitionActiveRef.current = false;
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index])
        .map((result) => result[0]?.transcript)
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!transcript) {
        return;
      }

      setForm((currentForm) => ({
        ...currentForm,
        message: appendSpeechText(speechBaseTextRef.current, transcript),
      }));
      setErrors((currentErrors) => ({ ...currentErrors, message: undefined }));
      setStatus('idle');
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const field = name as keyof ContactFormState;

    setForm({ ...form, [name]: value });
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setStatus('idle');
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      serviceNeeded: checked
        ? [...currentForm.serviceNeeded, value]
        : currentForm.serviceNeeded.filter((service) => service !== value),
    }));
    setErrors((currentErrors) => ({ ...currentErrors, serviceNeeded: undefined }));
    setStatus('idle');
  };

  const toggleSpeechInput = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    if (isListening || recognitionActiveRef.current) {
      recognitionActiveRef.current = false;
      setIsListening(false);
      recognition.abort();
      return;
    }

    messageRef.current?.focus();
    speechBaseTextRef.current = form.message;
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      recognitionActiveRef.current = false;
      setIsListening(false);
    }
  };

  const focusField = (field: keyof ContactFormState) => {
    const refs = {
      name: nameRef,
      businessName: businessNameRef,
      mobile: mobileRef,
      email: emailRef,
      serviceNeeded: serviceNeededRef,
      message: messageRef,
    };
    const fieldRef = refs[field];

    if (field === 'serviceNeeded') {
      setServicesOpen(true);
    }

    fieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => fieldRef.current?.focus(), 250);
  };

  const validateForm = () => {
    const nextErrors: ContactFormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!form.businessName.trim()) {
      nextErrors.businessName = 'Business name is required.';
    }

    if (!form.mobile.trim()) {
      nextErrors.mobile = 'Mobile number is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (form.serviceNeeded.length === 0) {
      nextErrors.serviceNeeded = 'Select at least one service.';
    }

    if (!form.message.trim()) {
      nextErrors.message = 'Business details are required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    const firstInvalidField = Object.keys(nextErrors)[0] as keyof ContactFormState | undefined;

    if (firstInvalidField) {
      setErrors(nextErrors);
      focusField(firstInvalidField);
      return;
    }

    setStatus('sending');
    const emailSubject = buildLeadSubject(form);
    const selectedServices = formatServices(form.serviceNeeded);
    const emailMessage = buildLeadEmail(form);
    const htmlMessage = buildLeadEmailHtml(form);

    try {
      await emailjs.send(
        'service_drduqdf',
        'template_zsjz4hx',
        {
          from_name: form.name,
          from_email: form.email,
          user_name: form.name,
          user_email: form.email,
          reply_to: form.email,
          business_name: form.businessName,
          businessName: form.businessName,
          mobile: form.mobile,
          service_needed: selectedServices,
          services_needed: selectedServices,
          service_Needed: selectedServices,
          business_message: form.message,
          subject: emailSubject,
          email_subject: emailSubject,
          message: emailMessage,
          body: emailMessage,
          Body: emailMessage,
          email_body: emailMessage,
          html_message: htmlMessage,
          name: form.name,
          email: form.email,
          Name: form.name,
          Email: form.email,
          Mobile: form.mobile,
          Business_Name: form.businessName,
          Service_Needed: selectedServices,
          Services_Needed: selectedServices,
          Message: emailMessage,
        },
        'TIYiaQGuGvZsjN3gh'
      );
      setStatus('success');
      setForm(initialForm);
      setErrors({});
      setServicesOpen(false);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-theme bg-theme-surface-soft p-8 shadow-glow backdrop-blur-xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-theme-primary">{content.contact.form.name}</label>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full rounded-3xl border bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary ${errors.name ? 'border-rose-400' : 'border-theme'}`}
          />
          {errors.name ? <p id="name-error" className="text-sm text-rose-300">{errors.name}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="businessName" className="text-sm font-medium text-theme-primary">{content.contact.form.businessName}</label>
          <input
            ref={businessNameRef}
            id="businessName"
            name="businessName"
            type="text"
            value={form.businessName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby={errors.businessName ? 'businessName-error' : undefined}
            className={`w-full rounded-3xl border bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary ${errors.businessName ? 'border-rose-400' : 'border-theme'}`}
            placeholder="Your company or brand"
          />
          {errors.businessName ? <p id="businessName-error" className="text-sm text-rose-300">{errors.businessName}</p> : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="mobile" className="text-sm font-medium text-theme-primary">{content.contact.form.mobile}</label>
          <input
            ref={mobileRef}
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.mobile}
            onChange={handleChange}
            aria-invalid={Boolean(errors.mobile)}
            aria-describedby={errors.mobile ? 'mobile-error' : undefined}
            className={`w-full rounded-3xl border bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary ${errors.mobile ? 'border-rose-400' : 'border-theme'}`}
            placeholder="+91 98765 43210"
          />
          {errors.mobile ? <p id="mobile-error" className="text-sm text-rose-300">{errors.mobile}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-theme-primary">{content.contact.form.email}</label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full rounded-3xl border bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary ${errors.email ? 'border-rose-400' : 'border-theme'}`}
            placeholder="you@example.com"
          />
          {errors.email ? <p id="email-error" className="text-sm text-rose-300">{errors.email}</p> : null}
        </div>
      </div>

      <div className="relative space-y-1">
        <label id="serviceNeeded-label" className="text-sm font-medium text-theme-primary">{content.contact.form.serviceNeeded}</label>
        <button
          ref={serviceNeededRef}
          type="button"
          aria-labelledby="serviceNeeded-label"
          aria-expanded={servicesOpen}
          aria-invalid={Boolean(errors.serviceNeeded)}
          aria-describedby={errors.serviceNeeded ? 'serviceNeeded-error' : undefined}
          onClick={() => setServicesOpen((open) => !open)}
          className={`flex w-full items-center justify-between gap-4 rounded-3xl border bg-theme-surface-alt px-4 py-3 text-left text-theme-primary outline-none transition focus:border-brand-primary ${errors.serviceNeeded ? 'border-rose-400' : 'border-theme'}`}
        >
          <span className={form.serviceNeeded.length > 0 ? 'text-theme-primary' : 'text-theme-muted'}>{getServiceSummary(form.serviceNeeded)}</span>
          <span className="text-sm text-brand-primary">{servicesOpen ? 'Close' : 'Open'}</span>
        </button>
        {servicesOpen ? (
          <div className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-3xl border border-theme bg-theme-surface-alt p-3 shadow-glow">
            <div className="grid gap-2">
              {serviceOptions.map((service) => (
                <label
                  key={service}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-sm text-theme-secondary transition hover:bg-theme-surface-soft hover:text-theme-primary"
                >
                  <input
                    type="checkbox"
                    name="serviceNeeded"
                    value={service}
                    checked={form.serviceNeeded.includes(service)}
                    onChange={handleServiceChange}
                    className="h-4 w-4 accent-brand-primary"
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}
        {form.serviceNeeded.length > 0 ? <p className="text-sm text-theme-muted">{formatServices(form.serviceNeeded)}</p> : null}
        {errors.serviceNeeded ? <p id="serviceNeeded-error" className="text-sm text-rose-300">{errors.serviceNeeded}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-theme-primary">{content.contact.form.message}</label>
        <div className="relative">
          <textarea
            ref={messageRef}
            id="message"
            name="message"
            rows={6}
            value={form.message}
            onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`w-full resize-none rounded-3xl border bg-theme-surface-alt px-4 py-3 pb-16 pr-16 text-theme-primary outline-none transition focus:border-brand-primary ${errors.message ? 'border-rose-400' : 'border-theme'}`}
            placeholder="Tell us what your business does, your current challenge, and what result you want."
          />
          <button
            type="button"
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            aria-pressed={isListening}
            disabled={!speechSupported}
            onClick={toggleSpeechInput}
            className={`absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
              isListening
                ? 'border-brand-primary bg-brand-primary text-black'
                : 'border-theme bg-theme-surface text-theme-primary hover:border-brand-primary/60 hover:text-brand-primary'
            } disabled:cursor-not-allowed disabled:opacity-45`}
            title={speechSupported ? 'Speak business details' : 'Voice input is not supported in this browser'}
          >
            {isListening ? <MicOff size={19} /> : <Mic size={19} />}
          </button>
        </div>
        {isListening ? <p className="text-sm text-brand-primary">Listening...</p> : null}
        {!speechSupported ? <p className="text-sm text-theme-muted">Voice input is supported in Chrome and some mobile browsers.</p> : null}
        {errors.message ? <p id="message-error" className="text-sm text-rose-300">{errors.message}</p> : null}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button type="submit" variant="primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </Button>
        {status === 'success' && <p className="text-sm text-emerald-300">Message sent successfully.</p>}
        {status === 'error' && <p className="text-sm text-rose-300">Something went wrong. Try again.</p>}
      </div>
    </form>
  );
}
