import { connection } from 'next/server';
import SubmissionInbox from '../../../../components/admin/SubmissionInbox';
import { listInternships } from '../../../../lib/submissions';

export const metadata = { title: 'Internships | CraftLanee Admin' };

export default async function AdminInternshipsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await connection();
  const { id } = await searchParams;
  const items = await listInternships();
  return <SubmissionInbox kind="internship" items={items} now={Date.now()} initialId={id} />;
}
