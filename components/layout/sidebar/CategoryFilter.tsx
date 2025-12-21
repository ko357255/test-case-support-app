'use client';

import { Filter } from 'lucide-react';

type Props = {
  filterCategory: string;
  categories: string[];
};

export default function CategoryFilter({ filterCategory, categories }: Props) {
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
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              filterCategory === category
                ? 'bg-accent text-accent-foreground'
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
