// Shared by the Book a Slot page and /api/booking, so keep it free of server-only imports.

export const bookingTypes = [
  {
    id: 'Digital Marketing',
    title: 'Digital Marketing',
    description: 'Book a strategy slot to plan SEO, social media, ads, and lead generation for your business.',
  },
  {
    id: 'Appointment',
    title: 'Appointment Call',
    description: 'Book a one-to-one call with our team to discuss websites, software, apps, training, or workspace needs.',
  },
] as const;

export const bookingTypeIds: string[] = bookingTypes.map((type) => type.id);

// Office hours are Mon - Sat, 9 AM - 7 PM; slots are one hour long.
export const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

export const BOOKING_WINDOW_DAYS = 14;

const TIME_ZONE = 'Asia/Kolkata';

function isoDate(date: Date) {
  return date.toLocaleDateString('en-CA', { timeZone: TIME_ZONE });
}

// Bookable days start tomorrow (IST) and skip Sundays.
export function bookableDates(now = new Date()) {
  const dates: string[] = [];
  for (let offset = 1; dates.length < BOOKING_WINDOW_DAYS; offset += 1) {
    const value = isoDate(new Date(now.getTime() + offset * 86_400_000));
    if (new Date(`${value}T00:00:00Z`).getUTCDay() !== 0) dates.push(value);
  }
  return dates;
}

export function formatBookingDate(value: string, options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-IN', { ...options, timeZone: 'UTC' });
}
