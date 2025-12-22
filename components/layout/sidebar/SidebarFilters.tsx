'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CategoryFilter from './CategoryFilter';
import StatusFilter from './StatusFilter';

type Props = {
  /** 選択中のステータスフィルタ */
  filterStatus: string;
  /** 選択中のカテゴリフィルタ */
  filterCategory: string;
  /** カテゴリの配列 */
  categories: string[];
};

export default function SidebarFilters({
  filterStatus,
  filterCategory,
  categories,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // フィルタ変更時の処理
  const handleFilterChange = (type: 'status' | 'category', value: string) => {
    // クエリパラメータを取得
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (value === 'all') {
      current.delete(type); // 'all'の場合はクエリパラメータを削除
    } else {
      current.set(type, value); // それ以外はセット
    }

    const query = current.toString();
    router.push(`${pathname}?${query}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <StatusFilter
        filterStatus={filterStatus}
        onStatusChange={(status) => handleFilterChange('status', status)}
      />
      <CategoryFilter
        filterCategory={filterCategory}
        categories={categories}
        onCategoryChange={(category) =>
          handleFilterChange('category', category)
        }
      />
    </div>
  );
}
