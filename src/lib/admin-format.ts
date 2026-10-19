import type { SubmissionKind, SubmissionStatus } from './submissions';

export const stageLabels: Record<SubmissionKind, Record<SubmissionStatus, string>> = {
  contact: { new: 'New', progress: 'In talks', done: 'Closed', archived: 'Archived' },
  internship: { new: 'New', progress: 'Shortlisted', done: 'Onboarded', archived: 'Archived' },
};

export const pipeline: SubmissionStatus[] = ['new', 'progress', 'done'];

const DAY = 86_400_000;

export function relativeTime(iso: string, now: number) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / DAY);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function waitingDays(iso: string, now: number) {
  return Math.floor((now - new Date(iso).getTime()) / DAY);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
}

export function dayKey(date: Date) {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';
}

export function phoneDigits(mobile: string) {
  const digits = mobile.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}
