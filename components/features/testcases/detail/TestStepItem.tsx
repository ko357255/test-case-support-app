import { Trash2 } from 'lucide-react';
import { stepStatusConfig } from '@/config/testcase';
import { TestStep } from '@/types/testcase';
import StepEvidenceList from './StepEvidenceList';

type Props = {
  /** テストステップ */
  step: TestStep;
  /** 編集モードかどうか */
  isEditing: boolean;
  /** テストステップを変更するための関数 */
  onChange?: (step: TestStep) => void;
  /** テストステップを削除するための関数 */
  onDelete?: (id: string) => void;
};

export default function TestStepItem({
  step,
  isEditing,
  onChange,
  onDelete,
}: Props) {
  const handleChange = (field: keyof typeof step, value: string) => {
    if (onChange) {
      onChange({ ...step, [field]: value });
    }
  };

  return (
    <div className="border-border bg-muted/50 rounded-lg border p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* ステップ番号 */}
          <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            {step.stepNumber}
          </div>
          {/* ステップステータス */}
          {step.status && (
            <span
              className={`rounded border px-2 py-1 text-sm ${stepStatusConfig[step.status].color} ${stepStatusConfig[step.status].bgColor} ${stepStatusConfig[step.status].borderColor}`}
            >
              {stepStatusConfig[step.status].label}
            </span>
          )}
        </div>
        {isEditing && (
          <button
            onClick={() => onDelete?.(step.id)}
            className="text-destructive hover:bg-destructive/10 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3">
        {/* 操作 */}
        <div>
          <label className="text-muted-foreground mb-1 block text-sm">
            操作
          </label>
          {isEditing ? (
            <input
              type="text"
              value={step.action}
              onChange={(e) => handleChange('action', e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          ) : (
            <p className="text-foreground text-sm">{step.action}</p>
          )}
        </div>

        {/* 期待結果 */}
        <div>
          <label className="text-muted-foreground mb-1 block text-sm">
            期待結果
          </label>
          {isEditing ? (
            <input
              type="text"
              value={step.expected}
              onChange={(e) => handleChange('expected', e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          ) : (
            <p className="text-foreground text-sm">{step.expected}</p>
          )}
        </div>

        {step.actual && (
          // 実行結果
          <div>
            <label className="text-muted-foreground mb-1 block text-sm">
              実行結果
            </label>
            {isEditing ? (
              <input
                type="text"
                value={step.actual}
                onChange={(e) => handleChange('actual', e.target.value)}
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
              onChange={(e) => handleChange('status', e.target.value)}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <option value="not_started">未実施</option>
              <option value="in_progress">実施中</option>
              <option value="passed">成功</option>
              <option value="failed">失敗</option>
            </select>
          </div>
        )}
      </div>

      {/* 全体エビデンス */}
      <StepEvidenceList step={step} isEditing={isEditing} />
    </div>
  );
}
