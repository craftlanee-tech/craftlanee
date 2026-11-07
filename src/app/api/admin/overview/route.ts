import { NextResponse } from 'next/server';
import { isAdminSession } from '../../../../lib/admin-session';
import { listSubmissions, type Submission, type SubmissionKind } from '../../../../lib/submissions';
import { dayKey, stageLabels, waitingDays } from '../../../../lib/admin-format';

const DAY = 86_400_000;
const WINDOW = 30;
const SPARK_DAYS = 14;

function inWindow(item: Submission, now: number, start: number, end: number) {
  const age = now - new Date(item.createdAt).getTime();
  return age >= start * DAY && age < end * DAY;
}

function countBy(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
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

function greeting(now: number) {
  const hour = Number(new Date(now).toLocaleString('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }));
  if (hour < 5) return 'Working late';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  const submissions = await listSubmissions();
  const contacts = submissions.filter((item) => item.kind === 'contact');
  const internships = submissions.filter((item) => item.kind === 'internship');

  const awaiting = submissions.filter((item) => item.status === 'new');
  const newContacts = awaiting.filter((item) => item.kind === 'contact').length;
  const newInterns = awaiting.filter((item) => item.kind === 'internship').length;
  const oldest = [...awaiting].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const overdue = oldest.filter((item) => waitingDays(item.createdAt, now) >= 3).length;

  const leads30 = contacts.filter((item) => inWindow(item, now, 0, WINDOW)).length;
  const leadsPrev = contacts.filter((item) => inWindow(item, now, WINDOW, WINDOW * 2)).length;
  const apps30 = internships.filter((item) => inWindow(item, now, 0, WINDOW)).length;
  const appsPrev = internships.filter((item) => inWindow(item, now, WINDOW, WINDOW * 2)).length;

  const decided = contacts.filter((item) => item.status !== 'archived');
  const closed = decided.filter((item) => item.status === 'done').length;
  const closeRate = decided.length ? Math.round((closed / decided.length) * 100) : 0;

  const byDay: { key: string; label: string; contact: number; internship: number }[] = [];
  for (let offset = WINDOW - 1; offset >= 0; offset -= 1) {
    const date = new Date(now - offset * DAY);
    const key = dayKey(date);
    byDay.push({
      key,
      label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }),
      contact: 0,
      internship: 0,
    });
  }
  const byDayMap = new Map(byDay.map((d) => [d.key, d]));
  submissions.forEach((item) => {
    const day = byDayMap.get(dayKey(new Date(item.createdAt)));
    if (day && item.kind !== 'booking') day[item.kind] += 1;
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

  const contactStages = (['new', 'progress', 'done'] as const).map((stage) => ({
    stage,
    label: stageLabels.contact[stage],
    count: contacts.filter((item) => item.status === stage).length,
  }));
  const contactTotal = contactStages.reduce((sum, s) => sum + s.count, 0);
  const contactConversion = contactTotal ? Math.round((contactStages[2].count / contactTotal) * 100) : 0;

  const internStages = (['new', 'progress', 'done'] as const).map((stage) => ({
    stage,
    label: stageLabels.internship[stage],
    count: internships.filter((item) => item.status === stage).length,
  }));
  const internTotal = internStages.reduce((sum, s) => sum + s.count, 0);
  const internConversion = internTotal ? Math.round((internStages[2].count / internTotal) * 100) : 0;

  return NextResponse.json({
    timestamp: now,
    stamp: `${stamp} IST`,
    greeting: greeting(now),
    kpi: {
      awaitingCount: awaiting.length,
      overdueCount: overdue,
      leads30,
      leadsDelta: leads30 - leadsPrev,
      apps30,
      appsDelta: apps30 - appsPrev,
      closeRate,
      closedCount: closed,
      decidedCount: decided.length,
      totalCount: submissions.length,
    },
    sparklines: {
      contacts: dailySeries(contacts, now, SPARK_DAYS),
      internships: dailySeries(internships, now, SPARK_DAYS),
    },
    pipeline: {
      contacts: {
        total: contactTotal,
        conversion: contactConversion,
        stages: contactStages,
      },
      internships: {
        total: internTotal,
        conversion: internConversion,
        stages: internStages,
      },
    },
    activityDays: byDay,
    oldestAwaiting: oldest.slice(0, 6),
    servicesInDemand: services,
    internshipDomains: domains,
  });
}
