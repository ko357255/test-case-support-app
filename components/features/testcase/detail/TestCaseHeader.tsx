import { statusConfig } from '@/config/testcase';
import { TestCaseDTO } from '@/types/firestore';
import { User2 } from 'lucide-react';

import { Presence } from '@/types/firestore';

type Props = {
  /** 編集モードかどうか */
  isEditing: boolean;
  /** 編集中のテストケース */
  editedTestCase: TestCaseDTO;
  /** テストケース更新時のコールバック */
  setTestCase: (tc: TestCaseDTO | null) => void;
  /** ヘッダー右側に表示するアクション要素 */
  actions?: React.ReactNode;
  /** フォーカスが外れた時のコールバック（自動保存用） */
  onBlur?: () => void;
  /** presence updater */
  setPresence?: (p: Partial<Presence>) => void;
  /** presence grouped by field */
  presenceByField?: Record<string, Presence[]>;
  /** current test case id */
  testCaseId?: string;
};

export default function TestCaseHeader({
  isEditing,
  editedTestCase,
  setTestCase,
  actions,
  onBlur,
  setPresence,
  presenceByField,
  testCaseId,
}: Props) {
  const StatusIcon = statusConfig[editedTestCase.status].icon;

  return (
    <div className="border-border bg-muted/50 border-b px-8 py-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedTestCase.title}
                onChange={(e) =>
                  setTestCase({ ...editedTestCase, title: e.target.value })
                }
                onBlur={() => {
                  onBlur?.();
                  setPresence?.({
                    testCaseId: testCaseId,
                    fieldId: 'title',
                    isFocused: false,
                  });
                }}
                onFocus={() =>
                  setPresence?.({
                    testCaseId: testCaseId,
                    fieldId: 'title',
                    isFocused: true,
                  })
                }
                className="border-input bg-background text-foreground placeholder:text-muted-foreground flex w-full rounded-md border px-3 py-2 text-2xl focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              />
              {/* presence indicators */}
              {presenceByField?.['title']?.length ? (
                <div className="flex -space-x-2">
                  {presenceByField['title'].slice(0, 3).map((p) => (
                    <div
                      key={p.sessionId}
                      title={p.displayName}
                      className="border-background h-6 w-6 shrink-0 rounded-full border-2"
                      style={{
                        backgroundColor: p.avatarUrl ? undefined : p.color,
                      }}
                    >
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User2 className="m-auto h-4 w-4 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <h2 className="text-foreground text-2xl">{editedTestCase.title}</h2>
          )}
        </div>

        {actions && <div className="ml-4">{actions}</div>}
      </div>

      {isEditing ? (
        <div className="flex items-start gap-2">
          <textarea
            value={editedTestCase.description}
            onChange={(e) =>
              setTestCase({ ...editedTestCase, description: e.target.value })
            }
            onBlur={() => {
              onBlur?.();
              setPresence?.({
                testCaseId: testCaseId,
                fieldId: 'description',
                isFocused: false,
              });
            }}
            onFocus={() =>
              setPresence?.({
                testCaseId: testCaseId,
                fieldId: 'description',
                isFocused: true,
              })
            }
            className="border-input bg-background text-foreground placeholder:text-muted-foreground flex min-h-20 w-full rounded-md border px-3 py-2 focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
            rows={2}
          />

          {presenceByField?.['description']?.length ? (
            <div className="mt-1 flex -space-x-2">
              {presenceByField['description'].slice(0, 3).map((p) => (
                <div
                  key={p.sessionId}
                  title={p.displayName}
                  className="border-background h-6 w-6 shrink-0 rounded-full border-2"
                  style={{ backgroundColor: p.avatarUrl ? undefined : p.color }}
                >
                  {p.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.avatarUrl}
                      alt={p.displayName}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <User2 className="m-auto h-4 w-4 text-white" />
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-muted-foreground">{editedTestCase.description}</p>
      )}

      <div className="mt-4 flex gap-4">
        <div className="flex">
          <span className="text-muted-foreground">ステータス:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <select
                value={editedTestCase.status}
                onChange={(e) =>
                  setTestCase({
                    ...editedTestCase,
                    status: e.target.value as TestCaseDTO['status'],
                  })
                }
                onBlur={() => {
                  onBlur?.();
                  setPresence?.({
                    testCaseId: testCaseId,
                    fieldId: 'status',
                    isFocused: false,
                  });
                }}
                onFocus={() =>
                  setPresence?.({
                    testCaseId: testCaseId,
                    fieldId: 'status',
                    isFocused: true,
                  })
                }
                className="border-input bg-background ml-2 rounded-md border px-2 py-1 focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              >
                <option value="not_started">未実施</option>
                <option value="in_progress">実施中</option>
                <option value="passed">成功</option>
                <option value="failed">失敗</option>
              </select>

              {presenceByField?.['status']?.length ? (
                <div className="flex -space-x-2">
                  {presenceByField['status'].slice(0, 3).map((p) => (
                    <div
                      key={p.sessionId}
                      title={p.displayName}
                      className="border-background h-6 w-6 shrink-0 rounded-full border-2"
                      style={{
                        backgroundColor: p.avatarUrl ? undefined : p.color,
                      }}
                    >
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User2 className="m-auto h-4 w-4 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
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
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedTestCase.category}
                onChange={(e) =>
                  setTestCase({ ...editedTestCase, category: e.target.value })
                }
                onBlur={() => {
                  onBlur?.();
                  setPresence?.({
                    testCaseId: testCaseId,
                    fieldId: 'category',
                    isFocused: false,
                  });
                }}
                onFocus={() =>
                  setPresence?.({
                    testCaseId: testCaseId,
                    fieldId: 'category',
                    isFocused: true,
                  })
                }
                className="border-input bg-background placeholder:text-muted-foreground ml-2 w-32 rounded-md border px-2 py-1 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              />

              {presenceByField?.['category']?.length ? (
                <div className="flex -space-x-2">
                  {presenceByField['category'].slice(0, 3).map((p) => (
                    <div
                      key={p.sessionId}
                      title={p.displayName}
                      className="border-background h-6 w-6 shrink-0 rounded-full border-2"
                      style={{
                        backgroundColor: p.avatarUrl ? undefined : p.color,
                      }}
                    >
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User2 className="m-auto h-4 w-4 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <span className="text-foreground ml-2">
              {editedTestCase.category}
            </span>
          )}
        </div>

        <div className="flex">
          <span className="text-muted-foreground">優先度:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <select
                value={editedTestCase.priority}
                onChange={(e) =>
                  setTestCase({
                    ...editedTestCase,
                    priority: e.target.value as TestCaseDTO['priority'],
                  })
                }
                onBlur={() => {
                  onBlur?.();
                  setPresence?.({
                    testCaseId: testCaseId,
                    fieldId: 'priority',
                    isFocused: false,
                  });
                }}
                onFocus={() =>
                  setPresence?.({
                    testCaseId: testCaseId,
                    fieldId: 'priority',
                    isFocused: true,
                  })
                }
                className="border-input bg-background ml-2 rounded-md border px-2 py-1 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>

              {presenceByField?.['priority']?.length ? (
                <div className="flex -space-x-2">
                  {presenceByField['priority'].slice(0, 3).map((p) => (
                    <div
                      key={p.sessionId}
                      title={p.displayName}
                      className="border-background h-6 w-6 shrink-0 rounded-full border-2"
                      style={{
                        backgroundColor: p.avatarUrl ? undefined : p.color,
                      }}
                    >
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User2 className="m-auto h-4 w-4 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
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
