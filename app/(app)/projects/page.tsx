import { Metadata } from 'next';
import ProjectListPage from './ProjectListPage';
import { adminDb } from '@/lib/firebase-admin';
import { ProjectDoc, ProjectDTO } from '@/types/firestore';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'プロジェクト一覧 | TestCraft',
  description: 'マイプロジェクトの一覧',
};

/**
 * プロジェクト一覧ページ（サーバー）
 */
export default async function Page() {
  // ログインユーザーを取得
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  const uid = session?.user?.uid as string;

  // 自分がオーナーのプロジェクトと参加しているプロジェクトを取得
  const ownedSnap = await adminDb
    .collection('projects')
    .where('ownerId', '==', uid)
    .get();

  const memberSnap = await adminDb
    .collection('projects')
    .where('memberIds', 'array-contains', uid)
    .get();

  const owned: ProjectDTO[] = ownedSnap.docs.map((doc) => {
    const data = doc.data() as ProjectDoc;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toMillis(),
      updatedAt: data.updatedAt.toMillis(),
    };
  });

  const participating: ProjectDTO[] = memberSnap.docs
    .map((doc) => {
      const data = doc.data() as ProjectDoc;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
      };
    })
    // owned に重複している場合は除外
    .filter((p) => !owned.find((o) => o.id === p.id));

  return (
    <ProjectListPage
      ownedProjects={owned}
      participatingProjects={participating}
    />
  );
}
