'use client';

import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import TestCaseHeader from './TestCaseHeader';
import TestCaseStepList from './TestCaseStepList';
import TestCaseEvidenceList from './TestCaseEvidenceList';
import { NestedTestCase } from '@/types/testcase';
import { updateTestCase } from '@/lib/api/mock/testcases';

type Props = {
  testCase: NestedTestCase | null;
  onUpdate: (updatedTestCase: NestedTestCase) => void;
  onDelete: (testCaseId: string) => void;
};

export default function TestCaseDetail({
  testCase,
  onUpdate,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTestCase, setEditedTestCase] = useState<NestedTestCase | null>(
    null,
  );

  // 表示に使うテストケースを決定
  const currentTestCase = isEditing ? editedTestCase : testCase;

  /**
   * モード切替処理
   */
  const handleModeChange = async (nextIsEditing: boolean) => {
    if (nextIsEditing) {
      // 編集モードへ: 現在の testCase をコピー
      if (testCase) {
        setEditedTestCase(testCase);
        setIsEditing(true);
      }
    } else {
      // 閲覧モードへ: 保存処理を実行して終了
      if (editedTestCase) {
        await updateTestCase(editedTestCase);
        onUpdate(editedTestCase);
      }
      setIsEditing(false);
      setEditedTestCase(null);
    }
  };

  /**
   * 自動保存用ハンドラ (onBlur等で呼び出し)
   */
  const handleAutoSave = async () => {
    if (editedTestCase) {
      await updateTestCase(editedTestCase);
      onUpdate(editedTestCase);
    }
  };

  /**
   * 削除処理
   */
  const handleDelete = () => {
    if (!testCase) return;
    if (window.confirm('このテストケースを削除してもよろしいですか？')) {
      onDelete(testCase.id);
    }
  };

  /**
   * 親の testCase が切り替わったときの処理
   * 編集中なら自動で編集モードをオフにしてローカルコピーを破棄
   */
  useEffect(() => {
    if (isEditing) {
      setIsEditing(false);
      setEditedTestCase(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCase?.id]);

  if (!testCase) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-8">
        <p className="text-lg font-medium">テストケースを選択してください</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {currentTestCase && (
        <>
          <div className="pointer-events-none sticky top-8 z-10 mb-4 flex justify-end gap-2">
            <div className="border-border bg-background pointer-events-auto flex items-center rounded-lg border p-1 shadow-sm">
              <button
                onClick={() => handleModeChange(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  !isEditing
                    ? 'bg-muted text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>閲覧</span>
              </button>
              <button
                onClick={() => handleModeChange(true)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  isEditing
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Edit2 className="h-4 w-4" />
                <span>編集</span>
              </button>
            </div>
          </div>

          <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
            {/* テストケースのヘッダー */}
            <TestCaseHeader
              isEditing={isEditing}
              editedTestCase={currentTestCase}
              setTestCase={setEditedTestCase}
              onBlur={handleAutoSave}
              actions={
                !isEditing ? (
                  <button
                    onClick={handleDelete}
                    className="text-destructive hover:bg-destructive/10 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    title="テストケースを削除"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">削除</span>
                  </button>
                ) : undefined
              }
            />

            {/* テストステップ一覧 */}
            <TestCaseStepList
              isEditing={isEditing}
              steps={currentTestCase.steps}
              onStepsChange={(steps) =>
                setEditedTestCase((prev) => (prev ? { ...prev, steps } : prev))
              }
              onBlur={handleAutoSave}
            />

            {/* エビデンス一覧 */}
            <TestCaseEvidenceList
              isEditing={isEditing}
              evidences={currentTestCase.evidences}
              onChange={(evidences) =>
                setEditedTestCase((prev) =>
                  prev ? { ...prev, evidences } : prev,
                )
              }
              onBlur={handleAutoSave}
            />
          </div>
        </>
      )}
    </div>
  );
}
