import { connection } from 'next/server';
import SubmissionInbox from '../../../../components/admin/SubmissionInbox';
import { listContacts } from '../../../../lib/submissions';

export const metadata = { title: 'Contact leads | CraftLanee Admin' };

export default async function AdminContactsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await connection();
  const { id } = await searchParams;
  const items = await listContacts();
  return <SubmissionInbox kind="contact" items={items} now={Date.now()} initialId={id} />;
}
