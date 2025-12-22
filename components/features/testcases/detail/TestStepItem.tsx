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
    <div className="border-border bg-muted/50 rounded-lg border p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
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
          <button className="text-destructive hover:bg-destructive/10 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3">
        <div>
          <label className="text-muted-foreground mb-1 block text-sm">
            操作
          </label>
          {isEditing ? (
            <input
              type="text"
              value={step.action}
              onChange={() => {}}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          ) : (
            <p className="text-foreground text-sm">{step.action}</p>
          )}
        </div>

        <div>
          <label className="text-muted-foreground mb-1 block text-sm">
            期待結果
          </label>
          {isEditing ? (
            <input
              type="text"
              value={step.expected}
              onChange={() => {}}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          ) : (
            <p className="text-foreground text-sm">{step.expected}</p>
          )}
        </div>

        {step.actual && (
          <div>
            <label className="text-muted-foreground mb-1 block text-sm">
              実行結果
            </label>
            {isEditing ? (
              <input
                type="text"
                value={step.actual}
                onChange={() => {}}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              />
            ) : (
              <p className="text-foreground text-sm">{step.actual}</p>
            )}
          </div>
        )}

        {isEditing && (
          <div>
            <label className="text-muted-foreground mb-1 block text-sm">
              ステップステータス
            </label>
            <select
              value={step.status || ''}
              onChange={() => {}}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
