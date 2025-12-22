'use client';

import { Filter } from 'lucide-react';

type Props = {
  /** 選択中のカテゴリフィルタ */
  filterCategory: string;
  /** カテゴリの配列 */
  categories: string[];
  /** カテゴリ変更時のコールバック */
  onCategoryChange: (category: string) => void;
};

export default function CategoryFilter({
  filterCategory,
  categories,
  onCategoryChange,
}: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Filter className="text-muted-foreground h-4 w-4" />
        <span className="text-sm font-medium">カテゴリ</span>
      </div>

      <div className="space-y-1">
        {['all', ...categories].map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              filterCategory === category
                ? 'dark:bg-accent dark:text-accent-foreground dark:ring-border bg-blue-50 text-blue-700'
                : 'hover:bg-muted'
            }`}
          >
            {category === 'all' ? 'すべて' : category}
          </button>
        ))}
      </div>
    </div>
  );
}
