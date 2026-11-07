import { connection } from 'next/server';
import SubmissionInbox from '../../../../components/admin/SubmissionInbox';
import { listBookings } from '../../../../lib/submissions';

export const metadata = { title: 'Slot bookings | CraftLanee Admin' };

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await connection();
  const { id } = await searchParams;
  const items = await listBookings();
  return <SubmissionInbox kind="booking" items={items} now={Date.now()} initialId={id} />;
}
