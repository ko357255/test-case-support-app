import { CheckCircle, XCircle, Clock, Minus } from 'lucide-react';

/**
 * ステータスとの対応付け
 */
export const statusConfig = {
  passed: {
    label: '成功',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
  },
  failed: {
    label: '失敗',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle,
  },
  in_progress: {
    label: '実施中',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Clock,
  },
  not_started: {
    label: '未実施',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: Minus,
  },
} as const;

/**
 * 優先度との対応付け
 */
export const priorityConfig = {
  high: {
    label: '高',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  medium: {
    label: '中',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  low: {
    label: '低',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
} as const;
