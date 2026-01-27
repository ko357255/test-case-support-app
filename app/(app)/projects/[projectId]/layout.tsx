import { Metadata } from 'next';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import Header from '@/components/layout/Header';
import { getProject } from '@/lib/api/testcases';

/**
 * メタデータの動的生成
 */
export async function generateMetadata(): Promise<Metadata> {
  // Next.js が自動で fetch を重複排除するので、負荷は増えない
  const projects = await getProject('proj-001');

  return {
    title: projects?.name ?? 'プロジェクト',
  };
}

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
      {/* サイドバー：取得したカテゴリを渡す */}
      <Sidebar categories={categories} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ヘッダー：取得したプロジェクト名を渡す */}
        <Header projectName={projects?.name ?? 'プロジェクト名がありません'} />

        {/* メイン */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
