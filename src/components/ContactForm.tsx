'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import content from '../content';
import Button from './Button';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    try {
      await emailjs.send(
        'service_drduqdf',
        'template_zsjz4hx',
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        'TIYiaQGuGvZsjN3gh'
      );
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-white">{content.contact.form.name}</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none transition focus:border-brand-primary"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-white">{content.contact.form.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none transition focus:border-brand-primary"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="subject" className="text-sm font-medium text-white">{content.contact.form.subject}</label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          required
          className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none transition focus:border-brand-primary"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-white">{content.contact.form.message}</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          required
          className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none transition focus:border-brand-primary"
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
