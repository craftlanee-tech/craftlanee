import type { Metadata } from 'next';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { waitingDays } from '../../../lib/admin-format';
import { requireAdmin } from '../../../lib/admin-session';
import { listSubmissions } from '../../../lib/submissions';

export const metadata: Metadata = {
  title: 'Admin | CraftLanee',
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const submissions = await listSubmissions();
  const now = Date.now();
  const fresh = submissions.filter((item) => item.status === 'new');

  const stats = {
    newContacts: fresh.filter((item) => item.kind === 'contact').length,
    newInternships: fresh.filter((item) => item.kind === 'internship').length,
    overdue: fresh.filter((item) => waitingDays(item.createdAt, now) >= 3).length,
    total: submissions.length,
  };

  return (
    <div className="admin-shell min-h-screen">
      <AdminSidebar stats={stats} />
      <div className="min-w-0 lg:pl-[272px]">{children}</div>
    </div>
  );
}
