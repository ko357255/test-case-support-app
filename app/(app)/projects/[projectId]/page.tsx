// app/projects/[projectId]/page.tsx
import { notFound } from 'next/navigation';
import ProjectWorkspace from './ProjectWorkspace';
import { getProject } from '@/lib/api/testcases';

/**
 * プロジェクト（サーバー）
 */
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  // プロジェクトが見つからなければ、notfoundへ遷移
  if (!project) {
    notFound();
  }

  return <ProjectWorkspace initialProject={project} />;
}
