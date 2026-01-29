'use client';

import { Save } from 'lucide-react';
import { useState } from 'react';
import TestCaseHeader from './TestCaseHeader';
import TestCaseStepList from './TestCaseStepList';
import TestCaseEvidenceList from './TestCaseEvidenceList';
import { NestedTestCase } from '@/types/testcase';

type Props = {
  onSave: (testCase: NestedTestCase) => void;
  onCancel: () => void;
};

export default function TestCaseCreate({ onSave, onCancel }: Props) {
  const [newTestCase, setNewTestCase] = useState<NestedTestCase>(
    // テストケースの初期値を設定
    {
      id: '',
      title: '',
      description: '',
      status: 'not_started',
      priority: 'medium',
      category: '',
      steps: [],
      evidences: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  );

  /**
   * 保存処理
   */
  const handleSave = async () => {
    // DB保存処理
    // 親コンポーネントにデータを渡す
    onSave(newTestCase);
  };

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bold">新規テストケース作成</h2>

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        <TestCaseHeader
          isEditing={true}
          editedTestCase={newTestCase}
          setTestCase={setNewTestCase}
          actions={
            <div className="flex gap-2">
              <button
                onClick={handleSave}
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
            </div>
          }
        />

        <TestCaseStepList
          isEditing={true}
          steps={newTestCase.steps}
          onStepsChange={(steps) => setNewTestCase({ ...newTestCase, steps })}
        />

        <TestCaseEvidenceList
          isEditing={true}
          evidences={newTestCase.evidences}
          onChange={(evidences) =>
            setNewTestCase({ ...newTestCase, evidences })
          }
        />
      </div>
    </div>
  );
}
