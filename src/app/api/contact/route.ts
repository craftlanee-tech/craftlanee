import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactPayload = {
  name: string;
  businessName: string;
  mobile: string;
  email: string;
  serviceNeeded: string[];
  message: string;
};

function isContactPayload(value: unknown): value is ContactPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.name === 'string' &&
    typeof record.businessName === 'string' &&
    typeof record.mobile === 'string' &&
    typeof record.email === 'string' &&
    typeof record.message === 'string' &&
    Array.isArray(record.serviceNeeded) &&
    record.serviceNeeded.every((service) => typeof service === 'string')
  );
}

function validatePayload(payload: ContactPayload) {
  const errors: string[] = [];

  if (!payload.name.trim()) errors.push('Name is required.');
  if (!payload.businessName.trim()) errors.push('Business name is required.');
  if (!payload.mobile.trim()) errors.push('Mobile number is required.');
  if (!payload.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.push('A valid email is required.');
  }
  if (payload.serviceNeeded.length === 0) errors.push('At least one service is required.');
  if (!payload.message.trim()) errors.push('Business details are required.');

  return errors;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildLeadText(payload: ContactPayload) {
  return [
    'New CraftLanee website inquiry',
    `Name: ${payload.name}`,
    `Business Name: ${payload.businessName}`,
    `Mobile: ${payload.mobile}`,
    `Email: ${payload.email}`,
    `Services Needed: ${payload.serviceNeeded.join(', ')}`,
    '',
    'Business Details:',
    payload.message,
  ].join('\n');
}

function buildLeadHtml(payload: ContactPayload) {
  const fields: [string, string][] = [
    ['Name', payload.name],
    ['Business Name', payload.businessName],
    ['Mobile', payload.mobile],
    ['Email', payload.email],
    ['Services Needed', payload.serviceNeeded.join(', ')],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #172033; line-height: 1.6; max-width: 640px;">
      <div style="background: #111827; color: #ffffff; padding: 24px; border-radius: 14px 14px 0 0;">
        <p style="margin: 0 0 6px; color: #f59e0b; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">CraftLanee Inquiry</p>
        <h2 style="margin: 0; font-size: 24px;">New Inquiry: ${escapeHtml(payload.businessName)}</h2>
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
          <p style="margin: 0; color: #111827; white-space: pre-line;">${escapeHtml(payload.message)}</p>
        </div>
        <p style="margin: 22px 0 0; color: #374151; font-size: 14px;">
          Recommended next step: contact the lead and confirm their business goal, timeline, and preferred service package.
        </p>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isContactPayload(body)) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const validationErrors = validatePayload(body);

  if (validationErrors.length > 0) {
    return NextResponse.json({ error: validationErrors.join(' ') }, { status: 422 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;

  if (!gmailUser || !gmailAppPassword || !contactToEmail) {
    console.error('Missing GMAIL_USER, GMAIL_APP_PASSWORD, or CONTACT_TO_EMAIL environment variables.');
    return NextResponse.json({ error: 'Email is not configured on the server.' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `"CraftLanee Website" <${gmailUser}>`,
      to: contactToEmail,
      replyTo: body.email,
      subject: `New CraftLanee Inquiry: ${body.businessName}`,
      text: buildLeadText(body),
      html: buildLeadHtml(body),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 502 });
  }
}
