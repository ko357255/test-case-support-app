'use client';

import { useSearchParams } from 'next/navigation';
import SidebarHeader from './SidebarHeader';
import SidebarFilters from './SidebarFilters';
import ThemeSwitch from '../ThemeSwitch';

type Props = {
  /** カテゴリの配列 */
  categories: string[];
};

/**
 * サイドバーコンポーネント（サーバー）
 */
export default function Sidebar({ categories }: Props) {
  const searchParams = useSearchParams();
  // クエリパラメータからフィルタ条件を取得
  const status = searchParams.get('status') || 'all';
  const category = searchParams.get('category') || 'all';

  return (
    // サイドバー全体（縦に並べる）
    <aside className="bg-sidebar text-sidebar-foreground border-border flex w-64 flex-col border-r">
      {/* タイトル */}
      <SidebarHeader />
      <ThemeSwitch />
      {/* フィルタ */}
      <SidebarFilters
        filterStatus={status}
        filterCategory={category}
        categories={categories}
      />
    </aside>
  );
}
