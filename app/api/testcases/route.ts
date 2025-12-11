import mockTestcases from '@/data/testcases.json';

/**
 * サーバー テストケースの配列を返すAPIエンドポイント（モック）
 * GET /api/testcases
 */
export async function GET() {
  return Response.json(mockTestcases);
}
