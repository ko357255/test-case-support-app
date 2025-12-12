import { TestCase } from '@/types/testcase';

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * テストケース一覧を取得するAPI関数
 */
export async function fetchTestCases(): Promise<TestCase[]> {
  const response = await fetch(`${API_BASE_URL}/api/testcases`, {
    cache: 'no-store', // 常に最新を取得
  });
  if (!response.ok) {
    throw new Error('Failed to fetch test cases');
  }
  return response.json();
}

/**
 * テストケースIDでテストケースを取得するAPI関数
 * @param id テストケースID
 */
export async function fetchTestCaseById(id: string): Promise<TestCase> {
  const res = await fetch(`${API_BASE_URL}/api/testcases/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch test case: ${id}`);
  }

  return res.json();
}
