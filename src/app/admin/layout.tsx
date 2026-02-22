import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminLayoutClient } from './admin-layout-client';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login?callbackUrl=/admin');
  if ((session.user as { role?: string }).role !== 'ADMIN') redirect('/');

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
