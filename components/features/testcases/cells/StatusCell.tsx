import type { TestCase } from '@/types/testcase';
import { statusConfig } from '@/config/testcase';

export default function StatusCell({ status }: { status: TestCase['status'] }) {
  const info = statusConfig[status];
  const Icon = info.icon;

  return (
    <td className="px-6 py-4">
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${info.bgColor} ${info.borderColor}`}
      >
        <Icon className={`h-4 w-4 ${info.color}`} />
        <span className={`text-sm ${info.color}`}>{info.label}</span>
      </div>
    </td>
  );
}
