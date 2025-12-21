import { Plus } from 'lucide-react';
import { TestCase } from '@/types/testcase';
import TestStepItem from './TestStepItem';

type Props = {
  isEditing: boolean;
  steps: TestCase['steps'];
};

export default function TestCaseStepList({ isEditing, steps }: Props) {
  return (
    <div className="border-b border-gray-200 px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg text-gray-900">テストステップ</h3>
        {isEditing && (
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white transition-colors hover:bg-blue-700">
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
