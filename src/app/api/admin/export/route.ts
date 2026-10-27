import { NextResponse } from 'next/server';
import { isAdminSession } from '../../../../lib/admin-session';
import { listContacts, listInternships } from '../../../../lib/submissions';

function csvCell(value: unknown) {
  let text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  // Neutralise spreadsheet formula injection from user-submitted text.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  return [headers.map(csvCell).join(','), ...rows.map((row) => headers.map((key) => csvCell(row[key])).join(','))].join('\r\n');
}

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const type = new URL(request.url).searchParams.get('type');
  let rows: Record<string, unknown>[];

  if (type === 'contact') {
    rows = (await listContacts()).map(({ id, createdAt, status, starred, notes, data }) => ({
      id, submittedAt: createdAt, status, starred, ...data, serviceTypes: data.serviceTypes ?? [], notes,
    }));
  } else if (type === 'internship') {
    rows = (await listInternships()).map(({ id, createdAt, status, starred, notes, data }) => ({
      id, submittedAt: createdAt, status, starred, ...data, notes,
    }));
  } else {
    return NextResponse.json({ error: 'Unknown export type.' }, { status: 400 });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(`﻿${toCsv(rows)}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="craftlanee-${type}s-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
