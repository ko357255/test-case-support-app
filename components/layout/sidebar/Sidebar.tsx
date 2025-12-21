import { fetchTestCases } from '@/lib/api/testcases';
import SidebarHeader from './SidebarHeader';
import SidebarFilters from './SidebarFilters';
import { ThemeSwitch } from '../ThemeSwitch';

type Props = {
  /** 選択中のステータスフィルタ */
  filterStatus: string;
  /** 選択中のカテゴリフィルタ */
  filterCategory: string;
};

/**
 * サイドバーコンポーネント（サーバー）
 */
export default async function Sidebar({ filterStatus, filterCategory }: Props) {
  // テストケースの一覧を取得
  const testcases = await fetchTestCases();
  // カテゴリの一覧を抽出
  const categories = Array.from(new Set(testcases.map((tc) => tc.category)));

  return (
    // サイドバー全体（縦に並べる）
    <aside className="bg-sidebar text-sidebar-foreground border-border flex w-64 flex-col border-r">
      {/* タイトル */}
      <SidebarHeader />
      <ThemeSwitch />
      {/* フィルタ */}
      <SidebarFilters
        filterStatus={filterStatus}
        filterCategory={filterCategory}
        categories={categories}
      />
    </aside>
  );
}
