import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { bookableDates, bookingTypeIds, formatBookingDate, timeSlots } from '../../../lib/booking-slots';
import { listBookings, saveSubmission } from '../../../lib/submissions';

type BookingPayload = {
  name: string;
  email: string;
  mobile: string;
  bookingType: string;
  date: string;
  time: string;
  message: string;
};

function isBookingPayload(value: unknown): value is BookingPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const keys: (keyof BookingPayload)[] = ['name', 'email', 'mobile', 'bookingType', 'date', 'time', 'message'];

  return keys.every((key) => typeof record[key] === 'string');
}

function validatePayload(payload: BookingPayload) {
  const errors: string[] = [];

  if (!payload.name.trim()) errors.push('Name is required.');
  if (!payload.mobile.trim()) errors.push('Mobile number is required.');
  if (!payload.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.push('A valid email is required.');
  }
  if (!bookingTypeIds.includes(payload.bookingType)) errors.push('Choose a booking type.');
  if (!bookableDates().includes(payload.date)) errors.push('Choose an available date.');
  if (!timeSlots.includes(payload.time)) errors.push('Choose an available time slot.');

  return errors;
}

async function takenSlots(bookingType: string, date: string) {
  const bookings = await listBookings();
  return bookings
    .filter((item) => item.status !== 'archived' && item.data.bookingType === bookingType && item.data.date === date)
    .map((item) => item.data.time);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getFields(payload: BookingPayload): [string, string][] {
  return [
    ['Booking Type', payload.bookingType],
    ['Date', formatBookingDate(payload.date)],
    ['Time', payload.time],
    ['Name', payload.name],
    ['Email', payload.email],
    ['Mobile', payload.mobile],
  ];
}

function buildBookingText(payload: BookingPayload) {
  return [
    'New CraftLanee slot booking',
    ...getFields(payload).map(([label, value]) => `${label}: ${value}`),
    '',
    'Notes:',
    payload.message.trim() || '-',
  ].join('\n');
}

function buildBookingHtml(payload: BookingPayload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #172033; line-height: 1.6; max-width: 640px;">
      <div style="background: #111827; color: #ffffff; padding: 24px; border-radius: 14px 14px 0 0;">
        <p style="margin: 0 0 6px; color: #f59e0b; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">CraftLanee Slot Booking</p>
        <h2 style="margin: 0; font-size: 24px;">${escapeHtml(payload.bookingType)}: ${escapeHtml(payload.name)}</h2>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 14px 14px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">
          <tbody>
            ${getFields(payload)
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
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; font-weight: 700; text-transform: uppercase;">Notes</p>
          <p style="margin: 0; color: #111827; white-space: pre-line;">${escapeHtml(payload.message.trim() || '-')}</p>
        </div>
        <p style="margin: 22px 0 0; color: #374151; font-size: 14px;">
          Recommended next step: confirm the slot with the visitor and mark it Confirmed in the admin dashboard.
        </p>
      </div>
    </div>
  `;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const bookingType = params.get('type') ?? '';
  const date = params.get('date') ?? '';

  if (!bookingTypeIds.includes(bookingType) || !bookableDates().includes(date)) {
    return NextResponse.json({ taken: [] });
  }

  try {
    return NextResponse.json({ taken: await takenSlots(bookingType, date) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to read booked slots:', error);
    return NextResponse.json({ taken: [] });
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isBookingPayload(body)) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const validationErrors = validatePayload(body);

  if (validationErrors.length > 0) {
    return NextResponse.json({ error: validationErrors.join(' ') }, { status: 422 });
  }

  const payload: BookingPayload = {
    name: body.name.trim(),
    email: body.email.trim(),
    mobile: body.mobile.trim(),
    bookingType: body.bookingType,
    date: body.date,
    time: body.time,
    message: body.message.trim(),
  };

  try {
    if ((await takenSlots(payload.bookingType, payload.date)).includes(payload.time)) {
      return NextResponse.json({ error: 'That slot was just booked. Please pick another time.' }, { status: 409 });
    }
    await saveSubmission('booking', payload);
  } catch (error) {
    console.error('Failed to store booking:', error);
    return NextResponse.json({ error: 'Could not save your booking. Please try again.' }, { status: 500 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;

  // The booking is already in the admin dashboard; the email is only a heads-up.
  if (gmailUser && gmailAppPassword && contactToEmail) {
    try {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: gmailUser, pass: gmailAppPassword } });
      await transporter.sendMail({
        from: `"CraftLanee Website" <${gmailUser}>`,
        to: contactToEmail,
        replyTo: payload.email,
        subject: `New ${payload.bookingType} slot: ${formatBookingDate(payload.date, { day: 'numeric', month: 'short' })}, ${payload.time}`,
        text: buildBookingText(payload),
        html: buildBookingHtml(payload),
      });
    } catch (error) {
      console.error('Failed to send booking email:', error);
    }
  }

  return NextResponse.json({ success: true });
}
