import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type InternshipPayload = {
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

const requiredFields: [keyof InternshipPayload, string][] = [
  ['name', 'Name is required.'],
  ['mobile', 'Mobile number is required.'],
  ['college', 'College / institution is required.'],
  ['course', 'Course / degree is required.'],
  ['yearOfStudy', 'Year of study is required.'],
  ['domain', 'Internship domain is required.'],
  ['mode', 'Preferred mode is required.'],
  ['duration', 'Preferred duration is required.'],
];

function isInternshipPayload(value: unknown): value is InternshipPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const keys: (keyof InternshipPayload)[] = ['name', 'email', 'mobile', 'college', 'course', 'yearOfStudy', 'domain', 'mode', 'duration', 'message'];

  return keys.every((key) => typeof record[key] === 'string');
}

function validatePayload(payload: InternshipPayload) {
  const errors = requiredFields.filter(([field]) => !payload[field].trim()).map(([, message]) => message);

  if (payload.mobile.trim() && !/^\d{10}$/.test(payload.mobile.trim())) {
    errors.push('Mobile number must be exactly 10 digits.');
  }

  if (!payload.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.push('A valid email is required.');
  }

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

function getFields(payload: InternshipPayload): [string, string][] {
  return [
    ['Name', payload.name],
    ['Email', payload.email],
    ['Mobile', `+91 ${payload.mobile}`],
    ['College / Institution', payload.college],
    ['Course / Degree', payload.course],
    ['Year of Study', payload.yearOfStudy],
    ['Internship Domain', payload.domain],
    ['Preferred Mode', payload.mode],
    ['Preferred Duration', payload.duration],
  ];
}

function buildRegistrationText(payload: InternshipPayload) {
  return [
    'New CraftLanee internship registration',
    ...getFields(payload).map(([label, value]) => `${label}: ${value}`),
    '',
    'About the Student:',
    payload.message.trim() || '-',
  ].join('\n');
}

function buildRegistrationHtml(payload: InternshipPayload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #172033; line-height: 1.6; max-width: 640px;">
      <div style="background: #111827; color: #ffffff; padding: 24px; border-radius: 14px 14px 0 0;">
        <p style="margin: 0 0 6px; color: #f59e0b; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">CraftLanee Internship</p>
        <h2 style="margin: 0; font-size: 24px;">New Registration: ${escapeHtml(payload.name)}</h2>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 14px 14px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">
          <tbody>
            ${getFields(payload)
              .map(
                ([label, value]) => `
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 13px; width: 170px;">${label}</td>
                    <td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${escapeHtml(value)}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
        <div style="background: #f9fafb; border: 1px solid #eef2f7; border-radius: 12px; padding: 18px;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; font-weight: 700; text-transform: uppercase;">About the Student</p>
          <p style="margin: 0; color: #111827; white-space: pre-line;">${escapeHtml(payload.message.trim() || '-')}</p>
        </div>
        <p style="margin: 22px 0 0; color: #374151; font-size: 14px;">
          Recommended next step: contact the student to confirm the domain, batch start date, and onboarding details.
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

  if (!isInternshipPayload(body)) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const validationErrors = validatePayload(body);

  if (validationErrors.length > 0) {
    return NextResponse.json({ error: validationErrors.join(' ') }, { status: 422 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const toEmail = process.env.INTERNSHIP_TO_EMAIL || process.env.CONTACT_TO_EMAIL;

  if (!gmailUser || !gmailAppPassword || !toEmail) {
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
      to: toEmail,
      replyTo: body.email,
      subject: `New Internship Registration: ${body.name} (${body.domain})`,
      text: buildRegistrationText(body),
      html: buildRegistrationHtml(body),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send internship registration email:', error);
    return NextResponse.json({ error: 'Failed to submit registration. Please try again.' }, { status: 502 });
  }
}
