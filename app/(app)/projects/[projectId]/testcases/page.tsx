import TestCaseTable from '@/components/features/testcases/table/TestCaseTable';
import { fetchTestCases } from '@/lib/api/testcases';
import { TestCase } from '@/types/testcase';

/**
 * プロジェクト内のテストケース一覧
 */
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    projectId: string;
    status?: string;
    category?: string;
  }>;
}) {
  const { projectId } = await searchParams; // パラメータを受け取る

  const resolvedSearchParams = await searchParams;
  // ステータスフィルタ
  const status = resolvedSearchParams?.status || 'all';
  // カテゴリフィルタ
  const category = resolvedSearchParams?.category || 'all';
  // テストケースの一覧を取得
  const allTestCases = await fetchTestCases();

  // フィルタリング
  const filteredTestCases = allTestCases.filter((tc: TestCase) => {
    const statusMatch = status === 'all' || tc.status === status;
    const categoryMatch = category === 'all' || tc.category === category;
    return statusMatch && categoryMatch;
  });
  return (
    <div className="px-8 py-4">
      <TestCaseTable testCases={filteredTestCases} />
    </div>
  );
}
