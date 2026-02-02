import { Plus, Edit, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { TestCaseDTO, Presence } from '@/types/firestore';

type Props = {
  filteredTestCases: TestCaseDTO[];
  isLoading: boolean;
  isAdding: boolean;
  handleStartAdd: () => void;
  handleCancelAdd: () => void;
  newTitle: string;
  setNewTitle: (s: string) => void;
  newCategory: string;
  setNewCategory: (s: string) => void;
  newPriority: TestCaseDTO['priority'];
  setNewPriority: (p: TestCaseDTO['priority']) => void;
  handleSaveAdd: () => void;
  isSavingNewTestCase: boolean;
  filteredCountLabel?: string;
  selectedTestCaseId: string | null;
  onSelectTestCaseId: (id: string) => void;
  presenceByTestCase: Record<string, Presence[]>;
  setPresence: (p: Partial<Presence>) => void;
  searchQuery: string;
  categoryFilter: string | null;
  priorityFilter: string | null;
  statusFilter: string | null;
};

export default function TestCaseList({
  filteredTestCases,
  isLoading,
  isAdding,
  handleStartAdd,
  handleCancelAdd,
  newTitle,
  setNewTitle,
  newCategory,
  setNewCategory,
  newPriority,
  setNewPriority,
  handleSaveAdd,
  isSavingNewTestCase,
  filteredCountLabel,
  selectedTestCaseId,
  onSelectTestCaseId,
  presenceByTestCase,
  setPresence,
  searchQuery,
  categoryFilter,
  priorityFilter,
  statusFilter,
}: Props) {
  return (
    <nav className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-4">
      <div className="text-muted-foreground mb-2 flex items-center justify-between px-3 text-xs font-black uppercase">
        <span>
          {filteredCountLabel ?? `${filteredTestCases.length} 件のケース`}
        </span>
        {!isAdding ? (
          <button
            onClick={handleStartAdd}
            className="hover:text-foreground flex items-center gap-1 transition-colors"
            disabled={isSavingNewTestCase}
          >
            <Plus size={14} />
            <span>{isSavingNewTestCase ? '作成中...' : '追加'}</span>
          </button>
        ) : (
          <button
            onClick={handleCancelAdd}
            className="text-muted-foreground hover:text-foreground text-sm"
            disabled={isSavingNewTestCase}
          >
            キャンセル
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-3 px-3">
          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              placeholder="タイトル"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 rounded-md border px-3 py-2 text-sm"
            />
            <select
              value={newPriority}
              onChange={(e) =>
                setNewPriority(e.target.value as TestCaseDTO['priority'])
              }
              className="bg-background text-foreground rounded-md border px-3 py-2 text-sm"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
            <button
              onClick={handleSaveAdd}
              disabled={isSavingNewTestCase}
              className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
            >
              保存
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="カテゴリ（省略可）"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 rounded-md border px-3 py-2 text-sm"
            />
            <button
              onClick={handleCancelAdd}
              disabled={isSavingNewTestCase}
              className="rounded-md border px-3 py-2 text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-muted/50 animate-pulse rounded-xl px-4 py-4"
            />
          ))}
        </div>
      ) : filteredTestCases.length === 0 ? (
        <div className="text-muted-foreground px-3 py-6 text-center text-sm">
          {searchQuery || categoryFilter || priorityFilter || statusFilter ? (
            <p className="mb-3">該当するテストケースが見つかりません。</p>
          ) : (
            <p className="text-xs">まだテストケースがありません。</p>
          )}
        </div>
      ) : (
        filteredTestCases.map((tc) => (
          <button
            key={tc.id}
            type="button"
            onClick={() => {
              onSelectTestCaseId(tc.id);
              try {
                setPresence({
                  testCaseId: tc.id,
                  fieldId: undefined,
                  isFocused: true,
                });
              } catch {}
            }}
            className={`flex w-full flex-col items-start rounded-xl border px-4 py-3 text-left transition-all duration-150 ${
              selectedTestCaseId === tc.id
                ? 'bg-primary/5'
                : 'hover:bg-primary/5 hover:shadow-sm'
            } ${(presenceByTestCase[tc.id] || []).length > 0 ? 'border-primary/10 dark:border-primary/20 border-l-2 pl-3' : ''}`}
          >
            <div className="mb-2 flex w-full items-start justify-between gap-2">
              <span className="text-primary/70 truncate text-[10px] font-black tracking-tighter uppercase">
                {tc.category}
              </span>
              <div className="flex items-center gap-1.5">
                {tc.priority === 'high' && (
                  <ArrowUp className="text-destructive h-3.5 w-3.5 shrink-0" />
                )}
                {tc.priority === 'medium' && (
                  <Minus className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
                )}
                {tc.priority === 'low' && (
                  <ArrowDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                )}
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${tc.status === 'passed' ? 'bg-passed' : tc.status === 'failed' ? 'bg-failed' : 'bg-muted-foreground'}`}
                />

                <span className="text-muted-foreground ml-1 text-[11px] font-semibold">
                  {tc.status === 'passed'
                    ? '成功'
                    : tc.status === 'failed'
                      ? '失敗'
                      : tc.status === 'in_progress'
                        ? '実施中'
                        : '未実施'}
                </span>
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2">
                {((presenceByTestCase[tc.id] || []).length ?? 0) > 0 && (
                  <Edit className="text-muted-foreground" size={12} />
                )}
                <span className="text-left text-sm leading-snug font-bold">
                  {tc.title}
                </span>
              </div>
            </div>
          </button>
        ))
      )}
    </nav>
  );
}
