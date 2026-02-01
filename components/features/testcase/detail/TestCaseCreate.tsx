'use client';

import { Save } from 'lucide-react';
import { useState } from 'react';
import TestCaseHeader from './TestCaseHeader';
// NOTE: Creating a new test case doesn't yet have project/testCase IDs
// so we avoid using TestCaseStepList/TestCaseEvidenceList which expect those.
import { TestCaseWithStepsAndEvidencesDTO } from '@/types/firestore';

// type Props = {
//   onSave: (testCase: NestedTestCase) => void;
//   onCancel: () => void;
// };

export default function TestCaseCreate() {
  // {
  //  onSave, onCancel
  // }: Props
  const [newTestCase, setNewTestCase] =
    useState<TestCaseWithStepsAndEvidencesDTO>(
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
        // DTO uses numeric timestamps (placeholder until saved)
        createdAt: 0,
        updatedAt: 0,
      },
    );

  /**
   * 保存処理
   */
  const handleSave = async () => {
    // DB保存処理
    // 親コンポーネントにデータを渡す
    // onSave(newTestCase);
  };

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bold">新規テストケース作成</h2>

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        <TestCaseHeader
          isEditing={true}
          editedTestCase={newTestCase}
          setTestCase={(tc) => {
            if (tc) setNewTestCase(tc as TestCaseWithStepsAndEvidencesDTO);
          }}
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
                // onClick={onCancel}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 ring-offset-background focus-visible:ring-ring rounded-md px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                キャンセル
              </button>
            </div>
          }
        />

        {/* ステップ・エビデンスは保存後に追加可能。プロジェクト/ケースIDが必要なため作成後のUIで扱います。 */}
        <div className="text-muted-foreground px-8 py-4 text-sm">
          ※ ステップ・エビデンスは保存後に追加できます。
        </div>
      </div>
    </div>
  );
}
