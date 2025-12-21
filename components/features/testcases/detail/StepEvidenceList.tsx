import { Paperclip, Trash2, Upload } from 'lucide-react';
import { evidenceTypeConfig } from '@/config/testcase';
import { TestCase } from '@/types/testcase';

type Props = {
  step: TestCase['steps'][number];
  isEditing: boolean;
};

export default function StepEvidenceList({ step, isEditing }: Props) {
  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            エビデンス ({step.evidences?.length || 0})
          </span>
        </div>

        {isEditing && (
          <button className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-300">
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
                className="rounded border border-gray-200 bg-white p-3"
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
                          className="mb-1 w-full rounded border border-gray-300 px-2 py-1 text-sm text-gray-900"
                        />
                      ) : (
                        <div className="mb-1 text-sm text-gray-900">
                          {evidence.name}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {new Date(evidence.uploadedAt).toLocaleString('ja-JP')}
                      </div>
                      {evidence.note && (
                        <div className="mt-1 text-xs text-gray-600">
                          {evidence.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <button className="ml-2 shrink-0 text-red-500 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-3 text-center text-sm text-gray-400">
          エビデンスなし
        </div>
      )}
    </div>
  );
}
