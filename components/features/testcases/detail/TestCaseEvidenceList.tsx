import { Trash2, Upload } from 'lucide-react';
import { evidenceTypeConfig } from '@/config/testcase';
import { NestedEvidence } from '@/types/testcase';

type Props = {
  isEditing: boolean;
  evidences: NestedEvidence[];
};

export default function TestCaseEvidenceList({ isEditing, evidences }: Props) {
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
                  <div className="flex items-center gap-2">
                    <EvidenceIcon
                      className={`h-5 w-5 ${evidenceTypeConfig[evidence.type].color}`}
                    />
                    <span className="text-foreground text-sm">
                      {evidence.name}
                    </span>
                  </div>

                  {isEditing && (
                    <button className="text-destructive hover:bg-destructive/10 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="text-muted-foreground mb-2 text-xs">
                  {evidence.createdAt.toLocaleString('ja-JP')}
                </div>

                {evidence.note && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    {evidence.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
