import Sidebar from '@/components/layout/sidebar/Sidebar';
import Header from '@/components/layout/Header';
import { getProject, getTestCases } from '@/lib/api/testcases';

/**
 * プロジェクト内の外枠
 */
export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProject('proj-001');
  // テストケースの一覧を取得
  const testcases = projects?.testCases ?? [];
  // カテゴリの一覧を抽出
  const categories = Array.from(new Set(testcases.map((tc) => tc.category)));

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <Sidebar categories={categories} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ヘッダー */}
        <Header projectName={projects?.name ?? 'プロジェクト名がありません'} />
        {/* メイン */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
