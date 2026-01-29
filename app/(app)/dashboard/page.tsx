'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Settings,
  Search,
  ChevronRight,
  Layers,
  X,
  Users,
} from 'lucide-react';

// --- Types ---
import { NestedProject, NestedTestCase } from '@/types/testcase';
import { mockData } from '@/data/mock-data';
import TestCaseDetail from '@/components/features/testcases/detail/TestCaseDetail';

const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  project: NestedProject;
}> = ({ isOpen, onClose, project }) => {
  const [activeTab, setActiveTab] = useState<'project' | 'members'>('project');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in bg-card text-card-foreground border-border flex h-[550px] w-full max-w-3xl overflow-hidden rounded-2xl border shadow-2xl duration-200">
        <aside className="border-border bg-muted/30 w-50 border-r p-4">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('project')}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'project'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Settings size={16} className="shrink-0" />
              <span>プロジェクト設定</span>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'members'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Users size={16} className="shrink-0" />
              <span>メンバー</span>
            </button>
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-border flex items-center justify-between border-b p-6">
            <h3 className="text-lg font-bold">
              {activeTab === 'project' ? 'プロジェクト設定' : 'メンバー管理'}
            </h3>
            <button
              onClick={onClose}
              className="hover:bg-accent rounded-full p-1"
            >
              <X size={20} />
            </button>
          </header>
          {/* ...中身のコンテンツ部分は変更なし... */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'project' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    プロジェクト名
                  </label>
                  <input
                    type="text"
                    className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border p-2 text-sm focus:ring-2 focus:outline-none"
                    defaultValue={project.name}
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    説明
                  </label>
                  <textarea
                    className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border p-2 text-sm focus:ring-2 focus:outline-none"
                    rows={4}
                    defaultValue={project.description}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {project.memberIds.map((id) => (
                  <div
                    key={id}
                    className="border-border bg-accent/20 flex items-center justify-between rounded-xl border p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                        {id[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{id}</span>
                    </div>
                    {id === project.ownerId && (
                      <span className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-[10px] font-bold uppercase">
                        オーナー
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [viewMode, setViewMode] = useState<'portal' | 'workspace'>('portal');
  const [currentProject, setCurrentProject] = useState<NestedProject | null>(
    null,
  );
  const [selectedTestCase, setSelectedTestCase] =
    useState<NestedTestCase | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null); // カテゴリ用

  // カテゴリ一覧を抽出
  const categories = useMemo(() => {
    if (!currentProject) return [];
    return Array.from(
      new Set(currentProject.testCases.map((tc) => tc.category)),
    );
  }, [currentProject]);

  const filteredTestCases = useMemo(() => {
    if (!currentProject) return [];
    return currentProject.testCases.filter((tc) => {
      const matchesSearch = tc.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || tc.status === statusFilter;
      const matchesCategory = !categoryFilter || tc.category === categoryFilter; // カテゴリフィルタ適用
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [currentProject, searchQuery, statusFilter, categoryFilter]);

  if (viewMode === 'portal') {
    return (
      <div className="bg-background text-foreground min-h-screen p-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers size={28} />
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                TestCraft
              </h1>
            </div>
            <button className="bg-primary text-primary-foreground rounded-xl px-8 py-3 text-base font-bold shadow-md hover:opacity-90">
              + 新規プロジェクト
            </button>
          </header>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {mockData.map((proj) => (
              <button
                key={proj.id}
                onClick={() => {
                  setCurrentProject(proj);
                  setViewMode('workspace');
                }}
                className="group border-border bg-card hover:border-primary flex flex-col items-start rounded-2xl border p-8 transition-all hover:shadow-lg"
              >
                <h3 className="text-xl font-bold">{proj.name}</h3>
                <div className="border-border text-muted-foreground mt-8 flex w-full items-center justify-between border-t pt-6 text-sm font-bold tracking-widest uppercase">
                  <span>{proj.testCases.length} ケース</span>
                  <ChevronRight
                    size={20}
                    className="group-hover:text-primary transition-colors"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden font-sans">
      <aside className="border-border bg-sidebar text-sidebar-foreground flex w-80 flex-col border-r">
        <div className="border-border bg-card border-b p-5">
          <button
            onClick={() => {
              setViewMode('portal');
              setSelectedTestCase(null);
            }}
            className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
          >
            <ArrowLeft size={14} /> プロジェクト一覧へ
          </button>
          <div className="flex items-center justify-between">
            <h2 className="truncate text-base font-black tracking-tight">
              {currentProject?.name}
            </h2>
            <Settings
              size={18}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setIsSettingsOpen(true)}
            />
          </div>
        </div>

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
              className="bg-muted focus:border-primary focus:ring-ring w-full rounded-lg border border-transparent py-2.5 pl-10 text-sm outline-none focus:ring-2"
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

        <nav className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-4">
          <div className="text-muted-foreground mb-2 flex items-center justify-between px-3 text-xs font-black uppercase">
            <span>{filteredTestCases.length} 件のケース</span>
          </div>
          {filteredTestCases.map((tc) => (
            <button
              key={tc.id}
              onClick={() => {
                setSelectedTestCase(tc);
              }}
              className={`flex w-full flex-col items-start rounded-xl border-2 px-4 py-4 transition-all ${
                selectedTestCase?.id === tc.id
                  ? 'border-primary bg-card'
                  : 'hover:bg-accent/50 border-transparent'
              }`}
            >
              <div className="mb-2 flex w-full items-center justify-between gap-2">
                <span className="text-primary/70 truncate text-[10px] font-black tracking-tighter uppercase">
                  {tc.category}
                </span>
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${tc.status === 'passed' ? 'bg-passed' : tc.status === 'failed' ? 'bg-failed' : 'bg-muted-foreground'}`}
                />
              </div>
              <span className="text-left text-sm leading-snug font-bold">
                {tc.title}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <TestCaseDetail testCase={selectedTestCase} />
      </main>

      {currentProject && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          project={currentProject}
        />
      )}
    </div>
  );
}
