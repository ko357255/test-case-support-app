import { Plus } from 'lucide-react';
import { TestCase } from '@/types/testcase';
import TestStepItem from './TestStepItem';

type Props = {
  isEditing: boolean;
  steps: TestCase['steps'];
};

export default function TestCaseStepList({ isEditing, steps }: Props) {
  return (
    <div className="border-border border-b px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg">テストステップ</h3>
        {isEditing && (
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
            <Plus className="h-4 w-4" />
            ステップ追加
          </button>
        )}
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <TestStepItem key={step.id} step={step} isEditing={isEditing} />
        ))}
      </div>
    </div>
  );
}
