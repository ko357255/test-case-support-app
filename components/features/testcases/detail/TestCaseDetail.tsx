'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BackButton from './BackButton';
import TestCaseHeader from './TestCaseHeader';
import TestCaseStepList from './TestCaseStepList';
import TestCaseEvidenceList from './TestCaseEvidenceList';
import { NestedTestCase } from '@/types/testcase';

type Props = {
  testCase: NestedTestCase;
};

export default function TestCaseDetail({ testCase }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTestCase, setTestCase] = useState<NestedTestCase>(testCase);
  const router = useRouter();

  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * キャンセル処理
   */
  const handleCancel = () => {
    setTestCase(testCase);
    setIsEditing(false);
  };

  /**
   * 保存処理
   */
  const handleSave = () => {
    setIsEditing(false);

    // DB保存処理
  };

  return (
    <div className="p-8">
      {/* 戻るボタン */}
      <BackButton onBack={router.back} />

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        {/* テストケースのヘッダー */}
        <TestCaseHeader
          isEditing={isEditing}
          editedTestCase={editedTestCase}
          setTestCase={setTestCase}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
        />
        {/* テストステップ一覧 */}
        <TestCaseStepList
          isEditing={isEditing}
          steps={editedTestCase.steps}
          onStepsChange={(steps) => setTestCase({ ...editedTestCase, steps })}
        />
        {/* エビデンス一覧 */}
        <TestCaseEvidenceList
          isEditing={isEditing}
          evidences={editedTestCase.evidences}
        />
      </div>
    </div>
  );
}
