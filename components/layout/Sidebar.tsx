import { fetchTestCases } from '@/lib/api/testcases';
import {
  CheckCircle,
  Circle,
  Clock,
  FileText,
  Filter,
  Plus,
  XCircle,
} from 'lucide-react';

interface SidebarProps {
  /** 選択中のステータスフィルタ */
  filterStatus: string;
  /** 選択中のカテゴリフィルタ */
  filterCategory: string;
}

/**
 * サイドバーコンポーネント（サーバー）
 */
export default async function Sidebar({
  filterStatus,
  filterCategory,
}: SidebarProps) {
  // テストケースの一覧を取得
  const testcases = await fetchTestCases();
  // カテゴリの一覧を抽出
  const categories = Array.from(new Set(testcases.map((tc) => tc.category)));

  return (
    // サイドバー全体（縦に並べる）
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* タイトルと新規作成ボタン */}
      <div className="border-b border-gray-200 p-6">
        {/* タイトル */}
        <div className="mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="text-lg text-gray-900">テスト管理</span>
        </div>

        {/* 新規作成ボタン */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          新規作成
        </button>
      </div>

      {/* フィルタ */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ステータスフィルタ */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">ステータス</span>
          </div>

          {/* ステータスのボタン群 */}
          <div className="space-y-1">
            <button
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                // 選択中なら強調表示
                filterStatus === 'all'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Circle className="h-4 w-4" />
              すべて
            </button>

            <button
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                filterStatus === 'not_started'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Circle className="h-4 w-4 text-gray-400" />
              未実施
            </button>

            <button
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                filterStatus === 'in_progress'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clock className="h-4 w-4 text-blue-500" />
              実施中
            </button>

            <button
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                filterStatus === 'passed'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
              成功
            </button>

            <button
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                filterStatus === 'failed'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <XCircle className="h-4 w-4 text-red-500" />
              失敗
            </button>
          </div>
        </div>

        {/* カテゴリフィルタ */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">カテゴリ</span>
          </div>

          {/* カテゴリのボタン群 */}
          <div className="space-y-1">
            <button
              className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                filterCategory === 'all'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              すべて
            </button>

            {/* categoriesから自動生成 */}
            {categories.map((category) => (
              <button
                key={category}
                className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                  filterCategory === category
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
