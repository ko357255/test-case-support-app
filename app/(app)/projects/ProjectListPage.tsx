'use client';

import { useState } from 'react';
import { Layers, User } from 'lucide-react';
import UserSettingsModal from '@/components/features/user/UserSettingsModal';
import ProjectCard from '@/components/features/project/ProjectCard';
import { ProjectDTO } from '@/types/firestore';

interface Props {
  ownedProjects?: ProjectDTO[];
  participatingProjects?: ProjectDTO[];
}

/**
 * プロジェクト一覧ページ（クライアント）
 */
export default function ProjectListPage({
  ownedProjects = [],
  participatingProjects = [],
}: Props) {
  const [owned] = useState<ProjectDTO[]>(ownedProjects);
  const [participating] = useState<ProjectDTO[]>(participatingProjects);
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

          {/* マイプロジェクト */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold">マイプロジェクト</h2>
            {owned.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {owned.map((proj) => (
                  <ProjectCard key={proj.id} project={proj} />
                ))}
              </div>
            ) : (
              <div className="border-border mb-4 flex h-28 items-center justify-center rounded-2xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  マイプロジェクトが見つかりません。
                </p>
              </div>
            )}
          </section>

          {/* 参加プロジェクト */}
          <section>
            <h2 className="mb-4 text-lg font-bold">参加中のプロジェクト</h2>
            {participating.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {participating.map((proj) => (
                  <ProjectCard key={proj.id} project={proj} />
                ))}
              </div>
            ) : (
              <div className="border-border flex h-28 items-center justify-center rounded-2xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  参加中のプロジェクトが見つかりません。
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <UserSettingsModal
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
      />
    </>
  );
}
