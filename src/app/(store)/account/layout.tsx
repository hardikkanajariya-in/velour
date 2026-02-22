import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AccountLayoutClient } from './account-layout-client';

export const dynamic = 'force-dynamic';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login?callbackUrl=/account');

  return <AccountLayoutClient>{children}</AccountLayoutClient>;
}
