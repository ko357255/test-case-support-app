'use client';

import { statusConfig } from '@/config/testcase';
import { Circle, Filter } from 'lucide-react';

const STATUSES = [
  { key: 'all', label: 'すべて', icon: Circle, color: '' },
  { key: 'not_started', ...statusConfig.not_started },
  { key: 'in_progress', ...statusConfig.in_progress },
  { key: 'passed', ...statusConfig.passed },
  { key: 'failed', ...statusConfig.failed },
] as const;

type Props = {
  /** 選択中のステータスフィルタ */
  filterStatus: string;
  /** ステータス変更時のコールバック */
  onStatusChange: (status: string) => void;
};

export default function StatusFilter({ filterStatus, onStatusChange }: Props) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <Filter className="text-muted-foreground h-4 w-4" />
        <span className="text-sm font-medium">ステータス</span>
      </div>

      <div className="space-y-1">
        {STATUSES.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => onStatusChange(key)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              filterStatus === key
                ? 'dark:bg-accent dark:text-accent-foreground dark:ring-border bg-blue-50 text-blue-700'
                : 'hover:bg-muted'
            }`}
          >
            <Icon className={`h-4 w-4 ${color}`} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
