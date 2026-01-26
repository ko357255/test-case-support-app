import { redirect } from 'next/navigation';

/**
 * プロジェクト（サーバー）
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  // /projects/[projectId]/testcases へリダイレクト
  const { projectId } = await params;
  redirect(`/projects/${projectId}/testcases`);
}
