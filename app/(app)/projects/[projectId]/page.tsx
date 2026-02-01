// app/projects/[projectId]/page.tsx
import { notFound } from 'next/navigation';
import ProjectWorkspace from './ProjectWorkspace';
import { Metadata } from 'next';
import { adminDb } from '@/lib/firebase-admin';
import { ProjectDoc } from '@/types/firestore';
import { cache } from 'react';

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

const getProjectCached = cache(async (projectId: string) => {
  return adminDb.collection('projects').doc(projectId).get();
});

/**
 * メタデータの動的生成
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  // Nextjs が自動で fetch を重複排除するので、負荷は増えない
  console.log('メタデータ取得開始');
  const projectDoc = await getProjectCached(projectId);
  console.log('メタデータ取得終了');
  const projects = projectDoc.data() as ProjectDoc | undefined;

  return {
    title: `${projects?.name ?? 'Not Found'} | TestCraft`,
    description: projects?.description,
  };
}

/**
 * プロジェクト（サーバー）
 */
export default async function Page({ params }: Props) {
  const { projectId } = await params;

  console.log('データ取得開始');
  const projectDoc = await getProjectCached(projectId);

  console.log('終了');

  // プロジェクトが見つからなければ、notfoundへ遷移
  if (!projectDoc.exists) {
    notFound();
  }
  const data = projectDoc.data() as ProjectDoc;
  const project = {
    id: projectDoc.id,
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };

  return <ProjectWorkspace project={project} />;
}
