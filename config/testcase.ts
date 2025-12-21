import {
  CheckCircle,
  XCircle,
  Clock,
  Minus,
  FileText,
  Video,
  Image,
} from 'lucide-react';

/**
 * ステータスとの対応付け
 */
export const statusConfig = {
  passed: {
    label: '成功',
    color: 'text-passed',
    bgColor: 'bg-passed-bg',
    borderColor: 'border-passed-border',
    icon: CheckCircle,
  },
  failed: {
    label: '失敗',
    color: 'text-failed',
    bgColor: 'bg-failed-bg',
    borderColor: 'border-failed-border',
    icon: XCircle,
  },
  in_progress: {
    label: '実施中',
    color: 'text-in-progress',
    bgColor: 'bg-in-progress-bg',
    borderColor: 'border-in-progress-border',
    icon: Clock,
  },
  not_started: {
    label: '未実施',
    color: 'text-not-started',
    bgColor: 'bg-not-started-bg',
    borderColor: 'border-not-started-border',
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

/**
 * ステップステータスとの対応付け
 */
export const stepStatusConfig = {
  passed: {
    label: '成功',
    color: 'bg-green-500',
  },
  failed: {
    label: '失敗',
    color: 'bg-red-500',
  },
  skipped: {
    label: 'スキップ',
    color: 'bg-gray-400',
  },
  in_progress: {
    label: '実施中',
    color: 'text-blue-600',
  },
  not_started: {
    label: '未実施',
    color: 'text-gray-600',
  },
};

export const evidenceTypeConfig = {
  screenshot: {
    label: 'スクリーンショット',
    icon: Image,
    color: 'text-blue-500',
  },
  document: {
    label: 'ドキュメント',
    icon: FileText,
    color: 'text-green-500',
  },
  video: {
    label: '動画',
    icon: Video,
    color: 'text-purple-500',
  },
};
