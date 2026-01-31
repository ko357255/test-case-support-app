// app/projects/[projectId]/page.tsx
import { notFound } from 'next/navigation';
import ProjectWorkspace from './ProjectWorkspace';
import { getProject } from '@/lib/api/mock/testcases';
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

/**
 * メタデータの動的生成
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  // Nextjs が自動で fetch を重複排除するので、負荷は増えない
  const projects = await getProject(projectId);

  return {
    title: `${projects?.name ?? 'プロジェクト'} | TestCraft`,
    description: projects?.description,
  };
}

/**
 * プロジェクト（サーバー）
 */
export default async function Page({ params }: Props) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  // プロジェクトが見つからなければ、notfoundへ遷移
  if (!project) {
    notFound();
  }

  return <ProjectWorkspace initialProject={project} />;
}
