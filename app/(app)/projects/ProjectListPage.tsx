'use client';

import { useState } from 'react';
import { Layers, User } from 'lucide-react';
import { NestedProject } from '@/types/testcase';
import UserSettingsModal from '@/components/features/user/UserSettingsModal';
import ProjectCard from '@/components/features/project/ProjectCard';

interface Props {
  initialProjects: NestedProject[];
}

/**
 * プロジェクト一覧ページ（クライアント）
 */
export default function ProjectListPage({ initialProjects }: Props) {
  const [projects] = useState<NestedProject[]>(initialProjects);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);

  return (
    <>
      <div className="bg-background text-foreground min-h-screen p-12">
        <div className="mx-auto max-w-5xl">
          {/* ヘッダー */}
          <header className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers size={28} />
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                TestCraft
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-primary text-primary-foreground rounded-lg px-6 py-3 text-sm font-bold shadow-md transition-all hover:opacity-90">
                + 新規プロジェクト
              </button>
              <button
                onClick={() => setIsUserSettingsOpen(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent flex h-12 w-12 items-center justify-center rounded-full transition-colors"
              >
                <User size={22} />
              </button>
            </div>
          </header>

          {/* プロジェクト一覧 */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {projects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          ) : (
            <div className="border-border flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
              <p className="text-muted-foreground text-sm font-medium">
                プロジェクトが見つかりませんでした。
              </p>
            </div>
          )}
        </div>
      </div>

      <UserSettingsModal
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
      />
    </>
  );
}
