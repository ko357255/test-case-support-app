import { Trash2 } from 'lucide-react';
import { evidenceTypeConfig } from '@/config/testcase';
import { NestedEvidence } from '@/types/testcase';

type Props = {
  evidence: NestedEvidence;
  isEditing: boolean;
  onChange?: (id: string, field: keyof NestedEvidence, value: string) => void;
  onDelete?: (id: string) => void;
  onBlur?: () => void;
  className?: string;
  compact?: boolean;
};

export default function EvidenceItem({
  evidence,
  isEditing,
  onChange,
  onDelete,
  onBlur,
  className = '',
  compact = false,
}: Props) {
  const EvidenceIcon = evidenceTypeConfig[evidence.type].icon;
  const iconSize = compact ? 'h-4 w-4' : 'h-5 w-5';
  const deleteBtnClass = compact ? 'h-6 w-6' : 'h-8 w-8';
  const deleteIconSize = compact ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={`border-border rounded-lg border p-3 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <EvidenceIcon
          className={`mt-1 shrink-0 ${iconSize} ${evidenceTypeConfig[evidence.type].color}`}
        />

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-2">
          {isEditing ? (
            <>
              <input
                type="text"
                value={evidence.name}
                onChange={(e) =>
                  onChange?.(evidence.id, 'name', e.target.value)
                }
                onBlur={onBlur}
                placeholder="エビデンス名"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-md border px-2 py-1 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              />
              {evidence.type === 'text' ? (
                <textarea
                  value={evidence.textContent || ''}
                  onChange={(e) =>
                    onChange?.(evidence.id, 'textContent', e.target.value)
                  }
                  onBlur={onBlur}
                  placeholder="テキスト内容"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground min-h-[80px] w-full rounded-md border px-2 py-1 text-xs focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
                />
              ) : evidence.url ? (
                <div className="text-xs">
                  <a
                    href={evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    添付ファイルを確認
                  </a>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="text-sm font-medium">
                {evidence.url ? (
                  <a
                    href={evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary hover:underline"
                  >
                    {evidence.name}
                  </a>
                ) : (
                  <span className="text-foreground">{evidence.name}</span>
                )}
              </div>
              {evidence.type === 'text' && evidence.textContent && (
                <div className="bg-muted text-muted-foreground max-h-32 overflow-y-auto rounded-md p-2 font-mono text-xs whitespace-pre-wrap">
                  {evidence.textContent}
                </div>
              )}
            </>
          )}

          {/* Image Preview */}
          {evidence.type === 'screenshot' && evidence.url && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={evidence.url}
                alt={evidence.name}
                className="border-border bg-muted/20 max-h-64 w-full rounded-md border object-contain"
              />
            </div>
          )}

          {/* Date */}
          <div className="text-muted-foreground text-xs">
            {evidence.createdAt.toLocaleString('ja-JP')}
          </div>
        </div>

        {/* Delete Button */}
        {isEditing && (
          <button
            onClick={() => onDelete?.(evidence.id)}
            className={`text-destructive hover:bg-destructive/10 -mt-1 -mr-1 inline-flex shrink-0 items-center justify-center rounded-md transition-colors ${deleteBtnClass}`}
          >
            <Trash2 className={deleteIconSize} />
          </button>
        )}
      </div>
    </div>
  );
}
