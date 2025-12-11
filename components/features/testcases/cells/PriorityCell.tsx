import type { TestCase } from '@/types/testcase';
import { priorityConfig } from '@/config/testcase';

export default function PriorityCell({
  priority,
}: {
  priority: TestCase['priority'];
}) {
  const info = priorityConfig[priority];

  return (
    <td className="px-6 py-4">
      <span
        className={`inline-flex px-2 py-1 text-xs ${info.color} ${info.bgColor} rounded`}
      >
        {info.label}
      </span>
    </td>
  );
}
