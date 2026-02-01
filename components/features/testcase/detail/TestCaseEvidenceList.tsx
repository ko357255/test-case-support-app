import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import EvidenceItem from './EvidenceItem';
import { EvidenceDTO } from '@/types/firestore';

type Props = {
  isEditing: boolean;
  evidences: EvidenceDTO[];
  projectId: string;
  testCaseId: string;
  onChange?: (evidences: EvidenceDTO[]) => void;
  onBlur?: () => void;
};

export default function TestCaseEvidenceList({
  isEditing,
  evidences,
  projectId,
  testCaseId,
  onBlur,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const { uploadEvidence } = await import('@/lib/storage/uploadEvidence');
      await uploadEvidence({
        file,
        projectId,
        testCaseId,
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
    <div className="px-8 py-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-foreground text-lg">全体エビデンス</h3>
        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'アップロード中...' : 'エビデンス追加'}
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
            return (
              <EvidenceItem
                key={evidence.id}
                evidence={evidence}
                isEditing={isEditing}
                onChange={async (id, patch) => {
                  try {
                    const { updateEvidence } =
                      await import('@/lib/firestore/evidences');
                    await updateEvidence(projectId, testCaseId, id, patch);
                  } catch (err) {
                    console.error('Failed to update evidence', err);
                    alert('エビデンスの保存に失敗しました。');
                  }
                }}
                onDelete={async (id) => {
                  if (!confirm('このエビデンスを削除してもよろしいですか？'))
                    return;
                  try {
                    const { deleteEvidence } =
                      await import('@/lib/firestore/evidences');
                    await deleteEvidence(projectId, testCaseId, id);
                    onBlur?.();
                  } catch (err) {
                    console.error('Failed to delete evidence', err);
                    alert('エビデンスの削除に失敗しました。');
                  }
                }}
                onBlur={onBlur}
                className="hover:bg-muted/50 transition-colors"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
