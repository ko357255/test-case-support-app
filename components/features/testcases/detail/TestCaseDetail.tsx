'use client';

import { Edit2, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import TestCaseHeader from './TestCaseHeader';
import TestCaseStepList from './TestCaseStepList';
import TestCaseEvidenceList from './TestCaseEvidenceList';
import { NestedTestCase } from '@/types/testcase';

type Props = {
  testCase: NestedTestCase | null;
};

export default function TestCaseDetail({ testCase }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTestCase, setEditedTestCase] = useState<NestedTestCase | null>(
    null,
  );

  // 表示に使うテストケースを決定
  const currentTestCase = isEditing ? editedTestCase : testCase;

  /**
   * モード切替処理
   */
  const handleModeChange = (nextIsEditing: boolean) => {
    if (nextIsEditing) {
      // 編集モードへ: 現在の testCase をコピー
      if (testCase) {
        setEditedTestCase(testCase);
        setIsEditing(true);
      }
    } else {
      // 閲覧モードへ: 保存処理を実行して終了
      if (editedTestCase) {
        // TODO: ここで DB 保存処理などを行う
      }
      setIsEditing(false);
      setEditedTestCase(null);
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

  return (
    <div className="p-8">
      {currentTestCase && (
        <>
          <div className="mb-4 flex justify-end">
            <div className="border-border bg-background flex items-center rounded-lg border p-1 shadow-sm">
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
            />

            {/* テストステップ一覧 */}
            <TestCaseStepList
              isEditing={isEditing}
              steps={currentTestCase.steps}
              onStepsChange={(steps) =>
                setEditedTestCase((prev) => (prev ? { ...prev, steps } : prev))
              }
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
            />
          </div>
        </>
      )}
    </div>
  );
}
