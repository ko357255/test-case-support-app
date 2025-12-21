import { Trash2, Upload } from 'lucide-react';
import { evidenceTypeConfig } from '@/config/testcase';
import { TestCase } from '@/types/testcase';

type Props = {
  isEditing: boolean;
  evidences: TestCase['evidences'];
};

export default function TestCaseEvidenceList({ isEditing, evidences }: Props) {
  return (
    <div className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg text-gray-900">全体エビデンス</h3>
        {isEditing && (
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white transition-colors hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            エビデンス追加
          </button>
        )}
      </div>

      {evidences.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          全体エビデンスがありません
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {evidences.map((evidence) => {
            const EvidenceIcon = evidenceTypeConfig[evidence.type].icon;

            return (
              <div
                key={evidence.id}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <EvidenceIcon
                      className={`h-5 w-5 ${evidenceTypeConfig[evidence.type].color}`}
                    />
                    <span className="text-sm text-gray-900">
                      {evidence.name}
                    </span>
                  </div>

                  {isEditing && (
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mb-2 text-xs text-gray-500">
                  {new Date(evidence.uploadedAt).toLocaleString('ja-JP')}
                </div>

                {evidence.note && (
                  <p className="mt-2 text-sm text-gray-600">{evidence.note}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
