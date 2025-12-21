import { Trash2 } from 'lucide-react';
import { stepStatusConfig } from '@/config/testcase';
import { TestCase } from '@/types/testcase';
import StepEvidenceList from './StepEvidenceList';

type Props = {
  step: TestCase['steps'][number];
  isEditing: boolean;
};

export default function TestStepItem({ step, isEditing }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            {step.stepNumber}
          </div>
          {step.status && (
            <span
              className={`rounded px-2 py-1 text-xs text-white ${stepStatusConfig[step.status].color}`}
            >
              {stepStatusConfig[step.status].label}
            </span>
          )}
        </div>
        {isEditing && (
          <button className="text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">操作</label>
          {isEditing ? (
            <input
              type="text"
              value={step.action}
              onChange={() => {}}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-900">{step.action}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">期待結果</label>
          {isEditing ? (
            <input
              type="text"
              value={step.expected}
              onChange={() => {}}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-900">{step.expected}</p>
          )}
        </div>

        {step.actual && (
          <div>
            <label className="mb-1 block text-sm text-gray-700">実行結果</label>
            {isEditing ? (
              <input
                type="text"
                value={step.actual}
                onChange={() => {}}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            ) : (
              <p className="text-sm text-gray-900">{step.actual}</p>
            )}
          </div>
        )}

        {isEditing && (
          <div>
            <label className="mb-1 block text-sm text-gray-700">
              ステップステータス
            </label>
            <select
              value={step.status || ''}
              onChange={() => {}}
              className="rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">未設定</option>
              <option value="passed">成功</option>
              <option value="failed">失敗</option>
              <option value="skipped">スキップ</option>
            </select>
          </div>
        )}
      </div>

      <StepEvidenceList step={step} isEditing={isEditing} />
    </div>
  );
}
