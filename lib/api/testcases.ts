import { TestCase } from '@/types/testcase';

/**
 * テストケース一覧を取得するAPI関数
 */
export async function fetchTestCases(): Promise<TestCase[]> {
  const response = await fetch('http://192.168.2.105:3000/api/testcases', {
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
  const res = await fetch(`http://192.168.2.105:3000/api/testcases/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch test case: ${id}`);
  }

  return res.json();
}
