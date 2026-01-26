// import { NextRequest } from 'next/server';
// import testcases from '@/data/testcases.json';

// /**
//  * サーバー テストケースを返すAPIエンドポイント（モック）
//  * GET /api/testcases/{id}
//  */
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }, // [id] を受け取るための型指定
// ) {
//   const { id } = await context.params; // 非同期で id を取得

//   const testcase = testcases.find((t) => t.id === id);

//   if (!testcase) {
//     return new Response('Not Found', { status: 404 });
//   }

//   return Response.json(testcase);
// }
