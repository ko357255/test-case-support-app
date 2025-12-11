import TestCaseTable from '@/components/features/testcases/TestCaseTable';
import { fetchTestCases } from '@/lib/api/testcases';

/**
 * ホーム（サーバー）
 */
export default async function Home() {
  // テストケースの一覧を取得
  const testcases = await fetchTestCases();
  return (
    <div className="px-8 py-4">
      <TestCaseTable testCases={testcases} />
    </div>
  );
}
