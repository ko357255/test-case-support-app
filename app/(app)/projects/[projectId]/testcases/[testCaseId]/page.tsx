import TestCaseDetail from '@/components/features/testcases/detail/TestCaseDetail';
import { fetchTestCaseById } from '@/lib/api/testcases';

/**
 * テストケース詳細（サーバー）
 */
export default async function page({
  params,
}: {
  params: Promise<{ testCaseId: string }>;
}) {
  const { testCaseId } = await params; // パラメータを受け取る

  // テストケースを取得
  const testcase = await fetchTestCaseById(testCaseId);
  return (
    <div className="px-8 py-4">
      <TestCaseDetail testCase={testcase} />
    </div>
  );
}
