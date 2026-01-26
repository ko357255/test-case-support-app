import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

/**
 * 認証内の外枠
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // ログイン済みならプロジェクト一覧へ飛ばす
  if (session) {
    redirect('/projects');
  }

  return <div className="auth-container">{children}</div>;
}
