'use client';

import CategoryFilter from './CategoryFilter';
import StatusFilter from './StatusFilter';

type Props = {
  filterStatus: string;
  filterCategory: string;
  categories: string[];
};

export default function SidebarFilters({
  filterStatus,
  filterCategory,
  categories,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <StatusFilter filterStatus={filterStatus} />
      <CategoryFilter filterCategory={filterCategory} categories={categories} />
    </div>
  );
}
