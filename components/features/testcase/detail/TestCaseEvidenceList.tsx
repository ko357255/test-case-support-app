import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { NestedEvidence } from '@/types/testcase';
import EvidenceItem from './EvidenceItem';

type Props = {
  isEditing: boolean;
  evidences: NestedEvidence[];
  onChange?: (evidences: NestedEvidence[]) => void;
  onBlur?: () => void;
};

export default function TestCaseEvidenceList({
  isEditing,
  evidences,
  onChange,
  onBlur,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onChange) return;

    const newEvidence: NestedEvidence = {
      id: crypto.randomUUID(),
      name: '',
      type: 'screenshot',
      url: URL.createObjectURL(file),
      createdAt: new Date(),
    };
    onChange([...evidences, newEvidence]);
    e.target.value = '';
  };

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

  const handleEvidenceDelete = (id: string) => {
    if (!onChange) return;
    const newEvidences = evidences.filter((e) => e.id !== id);
    onChange(newEvidences);
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
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
            return (
              <EvidenceItem
                key={evidence.id}
                evidence={evidence}
                isEditing={isEditing}
                onChange={handleEvidenceChange}
                onDelete={handleEvidenceDelete}
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
