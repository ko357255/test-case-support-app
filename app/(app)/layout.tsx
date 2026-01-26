import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * アプリ内の外枠
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 未ログインはログインページにリダイレクト
  if (!session) {
    redirect('/login');
  }

  return <>{children}</>;
}
