'use client';

import { useState } from 'react';
import { Settings, Users, X } from 'lucide-react';
import { NestedProject } from '@/types/testcase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: NestedProject;
}

/**
 * プロジェクト設定モーダルコンポーネント
 */
export default function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
}: Props) {
  const [activeTab, setActiveTab] = useState<'project' | 'members'>('project');

  // モーダルが閉じているときは何もレンダリングしない
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in bg-card text-card-foreground border-border flex h-[550px] w-full max-w-3xl overflow-hidden rounded-2xl border shadow-2xl duration-200">
        {/* サイドメニュー */}
        <aside className="border-border bg-muted/30 w-52 border-r p-4">
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

        {/* メインコンテンツエリア */}
        <div className="flex flex-1 flex-col">
          <header className="border-border flex items-center justify-between border-b p-6">
            <h3 className="text-lg font-bold">
              {activeTab === 'project' ? 'プロジェクト設定' : 'メンバー管理'}
            </h3>
            <button
              onClick={onClose}
              className="hover:bg-accent rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'project' ? (
              /* プロジェクト情報設定 */
              <div className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    プロジェクト名
                  </label>
                  <input
                    type="text"
                    className="border-input bg-background mt-1 w-full rounded-lg border p-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                    defaultValue={project.name}
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    説明
                  </label>
                  <textarea
                    className="border-input bg-background mt-1 w-full rounded-lg border p-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                    rows={4}
                    defaultValue={project.description}
                  />
                </div>
              </div>
            ) : (
              /* メンバーリスト表示 */
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
}
