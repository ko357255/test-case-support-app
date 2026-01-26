import Sidebar from '@/components/layout/sidebar/Sidebar';
import Header from '@/components/layout/Header';
import { fetchTestCases } from '@/lib/api/testcases';
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

  // テストケースの一覧を取得
  const testcases = await fetchTestCases();
  // カテゴリの一覧を抽出
  const categories = Array.from(new Set(testcases.map((tc) => tc.category)));

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <Sidebar categories={categories} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ヘッダー */}
        <Header />
        {/* メイン */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
