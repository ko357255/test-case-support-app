import { Plus } from 'lucide-react';
import { TestStep } from '@/types/testcase';
import TestStepItem from './TestStepItem';

type Props = {
  /** 編集モードかどうか */
  isEditing: boolean;
  /** テストステップの配列 */
  steps: TestStep[];
  /** テストステップ配列変更時のコールバック */
  onStepsChange?: (steps: TestStep[]) => void;
};

export default function TestCaseStepList({
  isEditing,
  steps,
  onStepsChange,
}: Props) {
  const handleStepChange = (updatedStep: TestStep) => {
    const newSteps = steps.map((s) =>
      s.id === updatedStep.id ? updatedStep : s,
    );
    onStepsChange?.(newSteps);
  };

  const handleStepDelete = (id: string) => {
    const newSteps = steps.filter((s) => s.id !== id);
    onStepsChange?.(newSteps);
  };

  const handleStepAdd = () => {
    // ステップの初期値を設定
    const newStep = {
      id: crypto.randomUUID(),
      stepNumber: steps.length + 1,
      action: '',
      expected: '',
      status: 'not_started' as const,
    };
    onStepsChange?.([...steps, newStep]);
  };

  return (
    <div className="border-border border-b px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg">テストステップ</h3>
        {isEditing && (
          <button
            onClick={handleStepAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Plus className="h-4 w-4" />
            ステップ追加
          </button>
        )}
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <TestStepItem
            key={step.id}
            step={step}
            isEditing={isEditing}
            onChange={handleStepChange}
            onDelete={handleStepDelete}
          />
        ))}
      </div>
    </div>
  );
}
