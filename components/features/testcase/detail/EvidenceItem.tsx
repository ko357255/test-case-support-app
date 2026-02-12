import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { evidenceTypeConfig } from '@/config/testcase';
import { EvidenceDTO } from '@/types/firestore';

type Props = {
  evidence: EvidenceDTO;
  isEditing: boolean;
  onChange?: (
    id: string,
    patch: { name?: string; textContent?: string },
  ) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
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

  const [localName, setLocalName] = useState(evidence.name);
  const [localText, setLocalText] = useState(evidence.textContent ?? '');

  const handleBlur = async () => {
    const patch: { name?: string; textContent?: string } = {};
    if (localName !== evidence.name) patch.name = localName;
    if (
      evidence.type === 'text' &&
      localText !== (evidence.textContent || '')
    ) {
      patch.textContent = localText;
    }

    if (Object.keys(patch).length > 0) {
      await onChange?.(evidence.id, patch);
    }
    onBlur?.();
  };

  return (
    <div className={`border-border rounded-lg border p-3 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <EvidenceIcon
          className={`mt-1 shrink-0 ${iconSize} ${evidenceTypeConfig[evidence.type].color}`}
        />

        <div className="min-w-0 flex-1 space-y-2">
          {isEditing ? (
            <>
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                onBlur={handleBlur}
                placeholder="エビデンス名"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-md border px-2 py-1 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              />
              {evidence.type === 'text' && (
                <textarea
                  value={localText}
                  onChange={(e) => setLocalText(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="テキスト内容"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground min-h-20 w-full rounded-md border px-2 py-1 text-xs focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
                />
              )}
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

          {/* エビデンス画像 */}
          {evidence.type === 'screenshot' && evidence.url && (
            <div className="relative mt-2 h-64 w-full">
              <Image
                src={evidence.url}
                alt={evidence.name}
                fill
                className="border-border bg-muted/20 rounded-md border object-contain"
              />
            </div>
          )}

          {/* 日付 */}
          <div className="text-muted-foreground text-xs">
            {new Date(evidence.createdAt).toLocaleString('ja-JP')}
          </div>
        </div>

        {/* 削除ボタン */}
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
