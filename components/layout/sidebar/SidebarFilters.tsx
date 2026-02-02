import { Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useMemo } from 'react';

type Props = {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  categories: string[];
  categoryFilter: string | null;
  setCategoryFilter: (c: string | null) => void;
  priorityFilter: string | null;
  setPriorityFilter: (p: string | null) => void;
  statusFilter: string | null;
  setStatusFilter: (s: string | null) => void;
};

export default function SidebarFilters({
  searchQuery,
  setSearchQuery,
  isFilterOpen,
  setIsFilterOpen,
  categories,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
}: Props) {
  const hasAnyFilter = useMemo(
    () => !!(categoryFilter || priorityFilter || statusFilter),
    [categoryFilter, priorityFilter, statusFilter],
  );

  return (
    <div className="border-border bg-card/50 border-b p-5">
      <div className="relative mb-4">
        <Search
          className="text-muted-foreground absolute top-3 left-3"
          size={16}
        />
        <input
          type="text"
          placeholder="タイトルで検索..."
          aria-label="テストケースを検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-muted w-full rounded-lg border border-transparent py-2.5 pr-10 pl-10 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="検索クリア"
            onClick={() => setSearchQuery('')}
            className="text-muted-foreground hover:text-foreground absolute top-2.5 right-3 rounded-md p-1"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-xs font-bold tracking-widest uppercase transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={12} />
          <span>フィルター</span>
          {hasAnyFilter && <span className="bg-primary h-2 w-2 rounded-full" />}
        </div>
        {isFilterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isFilterOpen && (
        <div className="animate-in slide-in-from-top-2 fade-in mt-4 space-y-4 duration-200">
          <div className="space-y-2">
            <p className="text-muted-foreground px-1 text-[10px] font-black tracking-widest uppercase">
              カテゴリ
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`rounded-md px-2 py-1 text-sm font-bold transition-all ${
                  !categoryFilter
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                すべて
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-md px-2 py-1 text-sm font-bold transition-all ${
                    categoryFilter === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground px-1 text-[10px] font-black tracking-widest uppercase">
              優先度
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'high', label: '高' },
                { id: 'medium', label: '中' },
                { id: 'low', label: '低' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    setPriorityFilter(priorityFilter === p.id ? null : p.id)
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm font-black transition-all ${
                    priorityFilter === p.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground px-1 text-[10px] font-black tracking-widest uppercase">
              ステータス
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'passed', label: '成功' },
                { id: 'failed', label: '失敗' },
                { id: 'in_progress', label: '実施中' },
                { id: 'not_started', label: '未実施' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    setStatusFilter(statusFilter === s.id ? null : s.id)
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm font-black transition-all ${
                    statusFilter === s.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
