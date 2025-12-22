import { Paperclip, Trash2, Upload } from 'lucide-react';
import { evidenceTypeConfig } from '@/config/testcase';
import { TestCase } from '@/types/testcase';

type Props = {
  step: TestCase['steps'][number];
  isEditing: boolean;
};

export default function StepEvidenceList({ step, isEditing }: Props) {
  return (
    <div className="border-border mt-4 border-t pt-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-sm">
            エビデンス ({step.evidences?.length || 0})
          </span>
        </div>

        {isEditing && (
          <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors">
            <Upload className="h-3 w-3" />
            追加
          </button>
        )}
      </div>

      {step.evidences && step.evidences.length > 0 ? (
        <div className="space-y-2">
          {step.evidences.map((evidence) => {
            const EvidenceIcon = evidenceTypeConfig[evidence.type].icon;

            return (
              <div
                key={evidence.id}
                className="border-border bg-background rounded border p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-2">
                    <EvidenceIcon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${evidenceTypeConfig[evidence.type].color}`}
                    />
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={evidence.name}
                          onChange={() => {}}
                          className="border-input bg-background text-foreground mb-1 w-full rounded border px-2 py-1 text-sm"
                        />
                      ) : (
                        <div className="text-foreground mb-1 text-sm">
                          {evidence.name}
                        </div>
                      )}
                      <div className="text-muted-foreground text-xs">
                        {new Date(evidence.uploadedAt).toLocaleString('ja-JP')}
                      </div>
                      {evidence.note && (
                        <div className="text-muted-foreground mt-1 text-xs">
                          {evidence.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <button className="text-destructive hover:text-destructive/90 ml-2 shrink-0">
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
