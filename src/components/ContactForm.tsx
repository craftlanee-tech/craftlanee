'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
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

function buildLeadEmail(form: ContactFormState) {
  const subject = buildLeadSubject(form);
  const services = formatServices(form.serviceNeeded);

  return [
    subject,
    '',
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      serviceNeeded: checked
        ? [...currentForm.serviceNeeded, value]
        : currentForm.serviceNeeded.filter((service) => service !== value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          reply_to: form.email,
          business_name: form.businessName,
          mobile: form.mobile,
          service_needed: selectedServices,
          services_needed: selectedServices,
          business_message: form.message,
          subject: emailSubject,
          message: emailMessage,
          email_body: emailMessage,
          html_message: htmlMessage,
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
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-theme bg-theme-surface-soft p-8 shadow-glow backdrop-blur-xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-theme-primary">{content.contact.form.name}</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-theme bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="businessName" className="text-sm font-medium text-theme-primary">{content.contact.form.businessName}</label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            value={form.businessName}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-theme bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary"
            placeholder="Your company or brand"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="mobile" className="text-sm font-medium text-theme-primary">{content.contact.form.mobile}</label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-theme bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-theme-primary">{content.contact.form.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-theme bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-theme-primary">{content.contact.form.serviceNeeded}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {serviceOptions.map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-3 rounded-3xl border border-theme bg-theme-surface-alt px-4 py-3 text-sm text-theme-secondary transition hover:border-brand-primary/70 hover:text-theme-primary"
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
        <input
          type="text"
          value={form.serviceNeeded.length > 0 ? 'selected' : ''}
          onChange={() => undefined}
          required
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-theme-primary">{content.contact.form.message}</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          required
          className="w-full rounded-3xl border border-theme bg-theme-surface-alt px-4 py-3 text-theme-primary outline-none transition focus:border-brand-primary"
          placeholder="Tell us what your business does, your current challenge, and what result you want."
        />
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
