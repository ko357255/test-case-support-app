'use client';

import { useState } from 'react';
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
  const [currentStatus, setCurrentStatus] = useState(filterStatus);
  const [currentCategory, setCurrentCategory] = useState(filterCategory);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <StatusFilter
        filterStatus={currentStatus}
        onStatusChange={setCurrentStatus}
      />
      <CategoryFilter
        filterCategory={currentCategory}
        categories={categories}
        onCategoryChange={setCurrentCategory}
      />
    </div>
  );
}
