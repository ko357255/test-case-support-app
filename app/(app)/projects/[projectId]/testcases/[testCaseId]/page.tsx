import TestCaseDetail from '@/components/features/testcase/detail/TestCaseDetail';
import { getTestCase } from '@/lib/api/testcases';

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
  const testcase = await getTestCase(testCaseId);
  if (!testcase) return new Response('Not Found', { status: 404 });
  return (
    <div className="px-8 py-4">
      <TestCaseDetail testCase={testcase} />
    </div>
  );
}
