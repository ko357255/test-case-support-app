import { useRef, useState } from 'react';
import { Paperclip, Upload } from 'lucide-react';
import EvidenceItem from './EvidenceItem';
import { EvidenceDTO } from '@/types/firestore';
import { updateEvidence, deleteEvidence } from '@/lib/actions/evidences';
import { uploadEvidence } from '@/lib/storage/uploadEvidence';

type Props = {
  evidences: EvidenceDTO[];
  isEditing: boolean;
  projectId: string;
  testCaseId: string;
  stepId?: string;
  // onChange?: (evidences: EvidenceDTO[]) => void;
  onBlur?: () => void;
};

export default function StepEvidenceList({
  evidences: evidences,
  isEditing,
  projectId,
  testCaseId,
  stepId,
  // onChange,
  onBlur,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      await uploadEvidence({
        file,
        projectId,
        testCaseId,
        stepId,
        type: 'screenshot',
      });
      onBlur?.();
    } catch (err) {
      console.error('Upload failed', err);
      alert('エビデンスのアップロードに失敗しました。');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
            disabled={isUploading}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 ring-offset-background focus-visible:ring-ring flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Upload className="h-3 w-3" />
            {isUploading ? 'アップロード中...' : '追加'}
          </button>
        )}
      </div>

      {evidences && evidences.length > 0 ? (
        <div className="space-y-2">
          {evidences.map((evidence) => {
            return (
              <EvidenceItem
                key={evidence.id}
                evidence={evidence}
                isEditing={isEditing}
                onChange={async (id, patch) => {
                  try {
                    await updateEvidence(
                      projectId,
                      testCaseId,
                      id,
                      patch,
                      stepId,
                    );
                  } catch (err) {
                    console.error('Failed to update evidence', err);
                    alert('エビデンスの保存に失敗しました。');
                  }
                }}
                onDelete={async (id) => {
                  if (!confirm('このエビデンスを削除してもよろしいですか？'))
                    return;
                  try {
                    await deleteEvidence(projectId, testCaseId, id, stepId);
                    onBlur?.();
                  } catch (err) {
                    console.error('Failed to delete evidence', err);
                    alert('エビデンスの削除に失敗しました。');
                  }
                }}
                onBlur={onBlur}
                className="bg-background"
                compact={true}
              />
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
