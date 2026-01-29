'use client';

import { useState, useMemo } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Filter,
  Minus,
  Search,
  User,
  Settings as SettingsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { NestedProject, NestedTestCase } from '@/types/testcase';

interface ProjectSidebarProps {
  project: NestedProject;
  selectedTestCaseId?: string;
  onSelectTestCase: (testCase: NestedTestCase) => void;
  onOpenSettings: () => void;
  onOpenUserSettings: () => void;
}

/**
 * プロジェクト専用サイドバーコンポーネント
 */
export default function ProjectSidebar({
  project,
  selectedTestCaseId,
  onSelectTestCase,
  onOpenSettings,
  onOpenUserSettings,
}: ProjectSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // カテゴリ一覧を抽出
  const categories = useMemo(() => {
    return Array.from(new Set(project.testCases.map((tc) => tc.category)));
  }, [project]);

  // フィルタリング処理
  const filteredTestCases = useMemo(() => {
    return project.testCases.filter((tc) => {
      const matchesSearch = tc.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || tc.status === statusFilter;
      const matchesCategory = !categoryFilter || tc.category === categoryFilter;
      const matchesPriority = !priorityFilter || tc.priority === priorityFilter;
      return (
        matchesSearch && matchesStatus && matchesCategory && matchesPriority
      );
    });
  }, [project, searchQuery, statusFilter, categoryFilter, priorityFilter]);

  return (
    <aside className="border-border bg-sidebar text-sidebar-foreground flex h-full w-80 flex-col border-r">
      {/* プロジェクトヘッダー */}
      <div className="border-border bg-card border-b p-5">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
        >
          <ArrowLeft size={14} /> プロジェクト一覧へ
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="truncate text-base font-black tracking-tight">
            {project.name}
          </h2>
          <SettingsIcon
            size={18}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            onClick={onOpenSettings}
          />
        </div>
      </div>

      {/* 検索・フィルタセクション */}
      <div className="border-border bg-card/50 border-b p-5">
        <div className="relative mb-4">
          <Search
            className="text-muted-foreground absolute top-3 left-3"
            size={16}
          />
          <input
            type="text"
            placeholder="タイトルで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-muted w-full rounded-lg border border-transparent py-2.5 pl-10 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
        </div>

        {/* フィルター */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-xs font-bold tracking-widest uppercase transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter size={12} />
            <span>フィルター</span>
            {(categoryFilter || priorityFilter || statusFilter) && (
              <span className="bg-primary h-2 w-2 rounded-full" />
            )}
          </div>
          {isFilterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isFilterOpen && (
          <div className="animate-in slide-in-from-top-2 fade-in mt-4 space-y-4 duration-200">
            {/* カテゴリフィルタ */}
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

            {/* 優先度フィルタ */}
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

            {/* ステータスフィルタ */}
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

      {/* テストケースリスト */}
      <nav className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-4">
        <div className="text-muted-foreground mb-2 flex items-center justify-between px-3 text-xs font-black uppercase">
          <span>{filteredTestCases.length} 件のケース</span>
        </div>
        {filteredTestCases.map((tc) => (
          <button
            key={tc.id}
            onClick={() => onSelectTestCase(tc)}
            className={`flex w-full flex-col items-start rounded-xl border-2 px-4 py-4 transition-all ${
              selectedTestCaseId === tc.id
                ? 'bg-primary/10 border-transparent'
                : 'hover:bg-accent/50 border-transparent'
            }`}
          >
            <div className="mb-2 flex w-full items-start justify-between gap-2">
              <span className="text-primary/70 truncate text-[10px] font-black tracking-tighter uppercase">
                {tc.category}
              </span>
              <div className="flex items-center gap-1.5">
                {tc.priority === 'high' && (
                  <ArrowUp className="text-destructive h-3.5 w-3.5 shrink-0" />
                )}
                {tc.priority === 'medium' && (
                  <Minus className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
                )}
                {tc.priority === 'low' && (
                  <ArrowDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                )}
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    tc.status === 'passed'
                      ? 'bg-passed'
                      : tc.status === 'failed'
                        ? 'bg-failed'
                        : 'bg-muted-foreground'
                  }`}
                />
              </div>
            </div>
            <span className="text-left text-sm leading-snug font-bold">
              {tc.title}
            </span>
          </button>
        ))}
      </nav>

      {/* フッター: ユーザー情報 */}
      <div className="border-border mt-auto border-t px-3 py-1">
        <button
          onClick={onOpenUserSettings}
          className="hover:bg-accent flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors"
        >
          <div className="bg-muted text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full">
            <User size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold">デモユーザー</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
