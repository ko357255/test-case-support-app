import { Metadata } from 'next';
import ProjectListPage from './ProjectListPage';
import { adminDb } from '@/lib/firebase-admin';
import { ProjectDoc, ProjectDTO } from '@/types/firestore';

export const metadata: Metadata = {
  title: 'プロジェクト一覧 | TestCraft',
  description: 'マイプロジェクトの一覧',
};

/**
 * プロジェクト一覧ページ（サーバー）
 */
export default async function Page() {
  // サーバーサイドでデータを取得
  // const projects = await getMyProjects('user-admin-01');
  console.log('プロジェクト一覧取得開始');
  const projectSnap = await adminDb.collection('projects').get();
  const projects: ProjectDTO[] = projectSnap.docs.map((doc) => {
    const data = doc.data() as ProjectDoc;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toMillis(),
      updatedAt: data.updatedAt.toMillis(),
    };
  });
  console.log('プロジェクト一覧取得終了');

  return <ProjectListPage initialProjects={projects} />;
}
