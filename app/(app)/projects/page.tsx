import Link from 'next/link';
import { getMyProjects } from '@/lib/api/testcases';
import { NestedProject } from '@/types/testcase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プロジェクト一覧',
};

/**
 * プロジェクト一覧（サーバー）
 */
export default async function ProjectsPage() {
  const projects = await getMyProjects('user-admin-01');

  return (
    <div className="bg-background h-full overflow-y-auto p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">プロジェクト</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              管理中のプロジェクト一覧
            </p>
          </div>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors">
            新規作成
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: NestedProject) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group border-border bg-card text-card-foreground hover:border-primary/50 relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-card-foreground group-hover:text-primary mb-2 text-lg font-bold transition-colors">
                  {project.name}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
                  {project.description || 'プロジェクトの説明はありません。'}
                </p>
                <div className="border-border text-muted-foreground mt-auto flex items-center border-t pt-4 text-xs font-medium">
                  <svg
                    className="text-muted-foreground/70 mr-1.5 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {project.testCases?.length ?? 0} テストケース
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
