'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { NestedProject, NestedTestCase } from '@/types/testcase';

interface ProjectSidebarProps {
  project: NestedProject;
  selectedTestCaseId?: string;
  onSelectTestCase: (testCase: NestedTestCase) => void;
  onOpenSettings: () => void;
}

/**
 * プロジェクト専用サイドバーコンポーネント
 */
export default function ProjectSidebar({
  project,
  selectedTestCaseId,
  onSelectTestCase,
  onOpenSettings,
}: ProjectSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // カテゴリ一覧を抽出
  const categories = useMemo(() => {
    return Array.from(new Set(project.testCases.map((tc) => tc.category)));
  }, [project]);

  // フィルタリングロジック
  const filteredTestCases = useMemo(() => {
    return project.testCases.filter((tc) => {
      const matchesSearch = tc.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || tc.status === statusFilter;
      const matchesCategory = !categoryFilter || tc.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [project, searchQuery, statusFilter, categoryFilter]);

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
      <div className="border-border bg-card/50 space-y-4 border-b p-5">
        <div className="relative">
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
                ? 'border-primary bg-card'
                : 'hover:bg-accent/50 border-transparent'
            }`}
          >
            <div className="mb-2 flex w-full items-center justify-between gap-2">
              <span className="text-primary/70 truncate text-[10px] font-black tracking-tighter uppercase">
                {tc.category}
              </span>
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
            <span className="text-left text-sm leading-snug font-bold">
              {tc.title}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
