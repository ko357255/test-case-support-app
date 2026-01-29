import { Trash2, Upload } from 'lucide-react';
import { evidenceTypeConfig } from '@/config/testcase';
import { NestedEvidence } from '@/types/testcase';

type Props = {
  isEditing: boolean;
  evidences: NestedEvidence[];
  onChange?: (evidences: NestedEvidence[]) => void;
};

export default function TestCaseEvidenceList({
  isEditing,
  evidences,
  onChange,
}: Props) {
  const handleEvidenceChange = (
    id: string,
    field: keyof NestedEvidence,
    value: string,
  ) => {
    if (!onChange) return;
    const newEvidences = evidences.map((e) =>
      e.id === id ? { ...e, [field]: value } : e,
    );
    onChange(newEvidences);
  };

  return (
    <div className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg">全体エビデンス</h3>
        {isEditing && (
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
            <Upload className="h-4 w-4" />
            エビデンス追加
          </button>
        )}
      </div>

      {evidences.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          全体エビデンスがありません
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {evidences.map((evidence) => {
            const EvidenceIcon = evidenceTypeConfig[evidence.type].icon;

            return (
              <div
                key={evidence.id}
                className="border-border hover:bg-muted/50 rounded-lg border p-4 transition-colors"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-2">
                    <EvidenceIcon
                      className={`mt-1 h-5 w-5 shrink-0 ${evidenceTypeConfig[evidence.type].color}`}
                    />
                    {isEditing ? (
                      <div className="w-full space-y-2 pr-2">
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
                          placeholder="エビデンス名"
                          className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                            placeholder="テキスト内容"
                            className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-20 w-full rounded-md border px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                      <div className="min-w-0 flex-1">
                        {evidence.url ? (
                          <a
                            href={evidence.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors hover:underline"
                          >
                            {evidence.name}
                          </a>
                        ) : (
                          <span className="text-foreground text-sm">
                            {evidence.name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <button className="text-destructive hover:bg-destructive/10 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {!isEditing &&
                  evidence.type === 'text' &&
                  evidence.textContent && (
                    <div className="bg-muted text-muted-foreground mb-2 max-h-32 overflow-y-auto rounded-md p-2 font-mono text-xs whitespace-pre-wrap">
                      {evidence.textContent}
                    </div>
                  )}

                <div className="text-muted-foreground mb-2 text-xs">
                  {evidence.createdAt.toLocaleString('ja-JP')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
