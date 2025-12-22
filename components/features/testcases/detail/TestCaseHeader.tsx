import { Edit2, Save } from 'lucide-react';
import { TestCase } from '@/types/testcase';
import { statusConfig } from '@/config/testcase';

type Props = {
  isEditing: boolean;
  editedTestCase: TestCase;
  setTestCase: (tc: TestCase) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave?: () => void;
};

export default function TestCaseHeader({
  isEditing,
  editedTestCase,
  setTestCase,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  const StatusIcon = statusConfig[editedTestCase.status].icon;

  return (
    <div className="border-border bg-muted/50 border-b px-8 py-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedTestCase.title}
              onChange={(e) =>
                setTestCase({ ...editedTestCase, title: e.target.value })
              }
              className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          ) : (
            <h2 className="text-foreground text-2xl">{editedTestCase.title}</h2>
          )}
        </div>

        <div className="ml-4 flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-md px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Save className="h-4 w-4" />
                保存
              </button>
              <button
                onClick={onCancel}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 ring-offset-background focus-visible:ring-ring rounded-md px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                キャンセル
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-md px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
          className="border-input bg-background text-muted-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          rows={2}
        />
      ) : (
        <p className="text-muted-foreground">{editedTestCase.description}</p>
      )}

      <div className="mt-4 flex gap-4">
        <div className="flex">
          <span className="text-muted-foreground">ステータス:</span>
          {isEditing ? (
            <select
              value={editedTestCase.status}
              onChange={(e) =>
                setTestCase({
                  ...editedTestCase,
                  status: e.target.value as TestCase['status'],
                })
              }
              className="border-input bg-background ring-offset-background focus-visible:ring-ring ml-2 rounded-md border px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
          <span className="text-muted-foreground">カテゴリ:</span>
          {isEditing ? (
            <input
              type="text"
              value={editedTestCase.category}
              onChange={(e) =>
                setTestCase({ ...editedTestCase, category: e.target.value })
              }
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring ml-2 w-32 rounded-md border px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          ) : (
            <span className="text-foreground ml-2">
              {editedTestCase.category}
            </span>
          )}
        </div>

        <div className="flex">
          <span className="text-muted-foreground">優先度:</span>
          {isEditing ? (
            <select
              value={editedTestCase.priority}
              onChange={(e) =>
                setTestCase({
                  ...editedTestCase,
                  priority: e.target.value as TestCase['priority'],
                })
              }
              className="border-input bg-background ring-offset-background focus-visible:ring-ring ml-2 rounded-md border px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          ) : (
            <span className="text-foreground ml-2">
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
