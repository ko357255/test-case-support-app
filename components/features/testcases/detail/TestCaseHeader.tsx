import { NestedTestCase } from '@/types/testcase';
import { statusConfig } from '@/config/testcase';

type Props = {
  /** 編集モードかどうか */
  isEditing: boolean;
  /** 編集中のテストケース */
  editedTestCase: NestedTestCase;
  /** テストケース更新時のコールバック */
  setTestCase: (tc: NestedTestCase) => void;
  /** ヘッダー右側に表示するアクション要素 */
  actions?: React.ReactNode;
  /** フォーカスが外れた時のコールバック（自動保存用） */
  onBlur?: () => void;
};

export default function TestCaseHeader({
  isEditing,
  editedTestCase,
  setTestCase,
  actions,
  onBlur,
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
              onBlur={onBlur}
              className="border-input bg-background text-foreground placeholder:text-muted-foreground flex w-full rounded-md border px-3 py-2 text-2xl focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
            />
          ) : (
            <h2 className="text-foreground text-2xl">{editedTestCase.title}</h2>
          )}
        </div>

        {actions && <div className="ml-4">{actions}</div>}
      </div>

      {isEditing ? (
        <textarea
          value={editedTestCase.description}
          onChange={(e) =>
            setTestCase({ ...editedTestCase, description: e.target.value })
          }
          onBlur={onBlur}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground flex min-h-20 w-full rounded-md border px-3 py-2 focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
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
                  status: e.target.value as NestedTestCase['status'],
                })
              }
              onBlur={onBlur}
              className="border-input bg-background ml-2 rounded-md border px-2 py-1 focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
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
              onBlur={onBlur}
              className="border-input bg-background placeholder:text-muted-foreground ml-2 w-32 rounded-md border px-2 py-1 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
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
                  priority: e.target.value as NestedTestCase['priority'],
                })
              }
              onBlur={onBlur}
              className="border-input bg-background ml-2 rounded-md border px-2 py-1 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
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
