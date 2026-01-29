import { useRef } from 'react';
import { Paperclip, Trash2, Upload } from 'lucide-react';
import { evidenceTypeConfig } from '@/config/testcase';
import { NestedEvidence } from '@/types/testcase';

type Props = {
  evidences: NestedEvidence[];
  isEditing: boolean;
  onChange?: (evidences: NestedEvidence[]) => void;
  onBlur?: () => void;
};

export default function StepEvidenceList({
  evidences: evidences,
  isEditing,
  onChange,
  onBlur,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onChange) return;

    const currentEvidences = evidences || [];
    const newEvidence: NestedEvidence = {
      id: crypto.randomUUID(),
      name: file.name,
      type: 'screenshot',
      url: URL.createObjectURL(file),
      createdAt: new Date(),
    };
    onChange([...currentEvidences, newEvidence]);
    e.target.value = '';
  };

  const handleEvidenceChange = (
    id: string,
    field: keyof NestedEvidence,
    value: string,
  ) => {
    if (!onChange || !evidences) return;
    const newEvidences = evidences.map((e) =>
      e.id === id ? { ...e, [field]: value } : e,
    );
    onChange(newEvidences);
  };

  const handleEvidenceDelete = (id: string) => {
    if (!onChange || !evidences) return;
    const newEvidences = evidences.filter((e) => e.id !== id);
    onChange(newEvidences);
  };

  return (
    <div className="border-border mt-4 border-t pt-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-sm">
            エビデンス ({evidences?.length || 0})
          </span>
        </div>

        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 ring-offset-background focus-visible:ring-ring flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Upload className="h-3 w-3" />
            追加
          </button>
        )}
      </div>

      {evidences && evidences.length > 0 ? (
        <div className="space-y-2">
          {evidences.map((evidence) => {
            const EvidenceIcon = evidenceTypeConfig[evidence.type].icon;

            return (
              <div
                key={evidence.id}
                className="border-border bg-background rounded-md border p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-2">
                    <EvidenceIcon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${evidenceTypeConfig[evidence.type].color}`}
                    />
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={evidence.name}
                            onChange={(e) =>
                              handleEvidenceChange(
                                evidence.id,
                                'name',
                                e.target.value,
                              )
                            }
                            onBlur={onBlur}
                            placeholder="エビデンス名"
                            className="border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-md border px-2 py-1 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
                          />
                          {evidence.type === 'text' ? (
                            <textarea
                              value={evidence.textContent || ''}
                              onChange={(e) =>
                                handleEvidenceChange(
                                  evidence.id,
                                  'textContent',
                                  e.target.value,
                                )
                              }
                              onBlur={onBlur}
                              placeholder="テキスト内容"
                              className="border-input bg-background text-foreground placeholder:text-muted-foreground min-h-[60px] w-full rounded-md border px-2 py-1 text-xs focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
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
                        </div>
                      ) : (
                        <div className="text-foreground mb-1 text-sm">
                          {evidence.url ? (
                            <a
                              href={evidence.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {evidence.name}
                            </a>
                          ) : (
                            <span className="text-foreground">
                              {evidence.name}
                            </span>
                          )}
                        </div>
                      )}
                      {!isEditing &&
                        evidence.type === 'text' &&
                        evidence.textContent && (
                          <div className="bg-muted text-muted-foreground mt-1 rounded-md p-2 font-mono text-xs whitespace-pre-wrap">
                            {evidence.textContent}
                          </div>
                        )}
                      <div className="text-muted-foreground text-xs">
                        {evidence.createdAt.toLocaleString('ja-JP')}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => handleEvidenceDelete(evidence.id)}
                      className="text-destructive hover:bg-destructive/10 ml-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-muted-foreground py-3 text-center text-sm">
          エビデンスなし
        </div>
      )}
    </div>
  );
}
