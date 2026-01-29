'use client';

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
   * 編集開始
   */
  const handleEdit = () => {
    if (!testCase) return;
    setEditedTestCase(testCase); // 親の最新をコピー
    setIsEditing(true);
  };

  /**
   * 編集キャンセル
   */
  const handleCancel = () => {
    setEditedTestCase(null); // 編集内容を破棄
    setIsEditing(false);
  };

  /**
   * 保存処理
   */
  const handleSave = async () => {
    if (!editedTestCase) return;

    // ここで DB 保存処理などを行う
    // await saveTestCase(editedTestCase);

    setIsEditing(false);
    setEditedTestCase(null); // 編集用ローカルコピー破棄
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
        <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
          {/* テストケースのヘッダー */}
          <TestCaseHeader
            isEditing={isEditing}
            editedTestCase={currentTestCase}
            setTestCase={setEditedTestCase}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
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
      )}
    </div>
  );
}
