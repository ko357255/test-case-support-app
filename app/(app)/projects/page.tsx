import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Layers, ChevronRight } from 'lucide-react';

// --- Types & API ---
import { getMyProjects } from '@/lib/api/testcases';

// ページのメタデータ（タイトル）を設定
export const metadata: Metadata = {
  title: 'プロジェクト一覧 | TestCraft',
  description: '管理中のテストプロジェクト一覧を表示します。',
};

/**
 * プロジェクト一覧（サーバー）
 */
export default async function ProjectPortalPage() {
  // サーバーサイドでデータを取得
  const projects = await getMyProjects('user-admin-01');

  return (
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
          <button className="bg-primary text-primary-foreground rounded-xl px-8 py-3 text-base font-bold shadow-md transition-all hover:opacity-90">
            + 新規プロジェクト
          </button>
        </header>

        {/* プロジェクト一覧 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((proj) => (
            <Link
              key={proj.id}
              href={`/projects/${proj.id}`}
              className="group border-border bg-card hover:border-primary flex flex-col items-start rounded-2xl border p-8 text-left transition-all hover:shadow-lg"
            >
              <h3 className="group-hover:text-primary text-xl font-bold transition-colors">
                {proj.name}
              </h3>

              <div className="border-border text-muted-foreground mt-8 flex w-full items-center justify-between border-t pt-6 text-sm font-bold tracking-widest uppercase">
                <div className="flex flex-col gap-1">
                  <span>{proj.testCases?.length || 0} ケース</span>
                  <span className="text-[10px] font-medium tracking-normal normal-case opacity-70">
                    Owner: {proj.ownerId}
                  </span>
                </div>
                <ChevronRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* データが空の場合の表示 */}
        {projects.length === 0 && (
          <div className="border-border flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
            <p className="text-muted-foreground text-sm font-medium">
              プロジェクトが見つかりませんでした。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
