import TestCaseDetail from '@/components/features/testcases/detail/TestCaseDetail';
import { fetchTestCaseById } from '@/lib/api/testcases';

/**
 * ホーム（サーバー）
 */
export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // パラメータを受け取る

  // テストケースを取得
  const testcase = await fetchTestCaseById(id);
  return (
    <div className="px-8 py-4">
      <TestCaseDetail testCase={testcase} />
    </div>
  );
}
