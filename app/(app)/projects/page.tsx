import { Metadata } from 'next';
import { getMyProjects } from '@/lib/api/mock/testcases';
import ProjectListPage from './ProjectListPage';

export const metadata: Metadata = {
  title: 'プロジェクト一覧 | TestCraft',
  description: 'マイプロジェクトの一覧',
};

/**
 * プロジェクト一覧ページ（サーバー）
 */
export default async function Page() {
  // サーバーサイドでデータを取得
  const projects = await getMyProjects('user-admin-01');

  return <ProjectListPage initialProjects={projects} />;
}
