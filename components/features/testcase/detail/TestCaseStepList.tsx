import { Plus } from 'lucide-react';
import TestStepItem from './TestStepItem';
import { TestStepDTO } from '@/types/firestore';
import {
  createTestStep,
  updateTestStep,
  deleteTestStep,
} from '@/lib/firestore/testSteps';

import { useCallback } from 'react';

import type { Presence } from '@/types/firestore';

type Props = {
  /** プロジェクトID */
  projectId: string;
  /** テストケースID */
  testCaseId: string;
  /** 編集モードかどうか */
  isEditing: boolean;
  /** テストステップの配列 */
  steps: TestStepDTO[];
  /** テストステップ配列変更時のコールバック */
  // onStepsChange?: (steps: NestedTestStep[]) => void;
  /** フォーカスが外れた時のコールバック（自動保存用） */
  onBlur?: () => void;
  setPresence?: (p: Partial<Presence>) => void;
  presenceByField?: Record<string, Presence[]>;
};

export default function TestCaseStepList({
  projectId,
  testCaseId,
  isEditing,
  steps,
  // onStepsChange,
  onBlur,
  setPresence,
  presenceByField,
}: Props) {
  const handleStepChange = useCallback(
    async (updatedStep: TestStepDTO) => {
      try {
        const { id, ...rest } = updatedStep;
        const data = rest as Partial<Omit<TestStepDTO, 'id'>>;
        delete (data as Partial<TestStepDTO>).createdAt;
        delete (data as Partial<TestStepDTO>).updatedAt;
        await updateTestStep(projectId, testCaseId, id, data);
      } catch (e) {
        console.error('Failed to update step', e);
        alert('ステップの保存に失敗しました。');
      }
    },
    [projectId, testCaseId],
  );

  const handleStepDelete = useCallback(
    async (id: string) => {
      if (!confirm('このステップを削除してもよろしいですか？')) return;
      try {
        await deleteTestStep(projectId, testCaseId, id);
      } catch (e) {
        console.error('Failed to delete step', e);
        alert('ステップの削除に失敗しました。');
      }
    },
    [projectId, testCaseId],
  );

  const handleStepAdd = useCallback(async () => {
    try {
      const nextNumber =
        steps.length > 0 ? Math.max(...steps.map((s) => s.stepNumber)) + 1 : 1;
      await createTestStep(projectId, testCaseId, {
        testCaseId,
        stepNumber: nextNumber,
        action: '',
        actual: '',
        expected: '',
        status: 'not_started',
      });
    } catch (e) {
      console.error('Failed to create step', e);
      alert('ステップの作成に失敗しました。');
    }
  }, [projectId, testCaseId, steps]);
  return (
    <div className="border-border border-b px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg">テストステップ</h3>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <TestStepItem
            projectId={projectId}
            testCaseId={testCaseId}
            key={step.id}
            step={step}
            isEditing={isEditing}
            onChange={handleStepChange}
            onDelete={handleStepDelete}
            onBlur={onBlur}
            // presence props forwarded
            setPresence={setPresence}
            presenceByField={presenceByField}
          />
        ))}

        {isEditing && (
          <button
            onClick={handleStepAdd}
            className="border-primary/50 text-primary hover:bg-primary/5 hover:border-primary ring-offset-background focus-visible:ring-ring flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed py-3 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Plus className="h-4 w-4" />
            ステップを追加
          </button>
        )}
      </div>
    </div>
  );
}
