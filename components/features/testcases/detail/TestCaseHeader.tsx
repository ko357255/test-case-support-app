import { Edit2, Save } from 'lucide-react';
import { TestCase } from '@/types/testcase';
import { statusConfig } from '@/config/testcase';

type Props = {
  isEditing: boolean;
  editedTestCase: TestCase;
  setTestCase: (tc: TestCase) => void;
  onEdit: () => void;
  onCancel: () => void;
};

export default function TestCaseHeader({
  isEditing,
  editedTestCase,
  setTestCase,
  onEdit,
  onCancel,
}: Props) {
  const StatusIcon = statusConfig[editedTestCase.status].icon;

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-8 py-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedTestCase.title}
              onChange={(e) =>
                setTestCase({ ...editedTestCase, title: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-2xl text-gray-900"
            />
          ) : (
            <h2 className="text-2xl text-gray-900">{editedTestCase.title}</h2>
          )}
        </div>

        <div className="ml-4 flex gap-2">
          {isEditing ? (
            <>
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                <Save className="h-4 w-4" />
                保存
              </button>
              <button
                onClick={onCancel}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                キャンセル
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <Edit2 className="h-4 w-4" />
              編集
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editedTestCase.description}
          onChange={(e) =>
            setTestCase({ ...editedTestCase, description: e.target.value })
          }
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-600"
          rows={2}
        />
      ) : (
        <p className="text-gray-600">{editedTestCase.description}</p>
      )}

      <div className="mt-4 flex gap-4">
        <div className="flex">
          <span className="text-gray-500">ステータス:</span>
          {isEditing ? (
            <select
              value={editedTestCase.status}
              onChange={(e) =>
                setTestCase({
                  ...editedTestCase,
                  status: e.target.value as TestCase['status'],
                })
              }
              className="ml-2 rounded border border-gray-300 px-2 py-1"
            >
              <option value="not_started">未実施</option>
              <option value="in_progress">実施中</option>
              <option value="passed">成功</option>
              <option value="failed">失敗</option>
            </select>
          ) : (
            <span
              className={`ml-2 inline-flex items-center gap-1 ${statusConfig[editedTestCase.status].color}`}
            >
              <StatusIcon className="h-4 w-4" />
              {statusConfig[editedTestCase.status].label}
            </span>
          )}
        </div>

        <div className="flex">
          <span className="text-gray-500">カテゴリ:</span>
          {isEditing ? (
            <input
              type="text"
              value={editedTestCase.category}
              onChange={(e) =>
                setTestCase({ ...editedTestCase, category: e.target.value })
              }
              className="ml-2 w-32 rounded border border-gray-300 px-2 py-1 text-sm"
            />
          ) : (
            <span className="ml-2 text-gray-900">
              {editedTestCase.category}
            </span>
          )}
        </div>

        <div className="flex">
          <span className="text-gray-500">優先度:</span>
          {isEditing ? (
            <select
              value={editedTestCase.priority}
              onChange={(e) =>
                setTestCase({
                  ...editedTestCase,
                  priority: e.target.value as TestCase['priority'],
                })
              }
              className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          ) : (
            <span className="ml-2 text-gray-900">
              {editedTestCase.priority === 'high'
                ? '高'
                : editedTestCase.priority === 'medium'
                  ? '中'
                  : '低'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
