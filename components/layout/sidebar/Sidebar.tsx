import SidebarHeader from './SidebarHeader';
import SidebarFilters from './SidebarFilters';
import ThemeSwitch from '../ThemeSwitch';

type Props = {
  /** 選択中のステータスフィルタ */
  filterStatus: string;
  /** 選択中のカテゴリフィルタ */
  filterCategory: string;
  /** カテゴリの配列 */
  categories: string[];
};

/**
 * サイドバーコンポーネント（サーバー）
 */
export default function Sidebar({
  filterStatus,
  filterCategory,
  categories,
}: Props) {
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
