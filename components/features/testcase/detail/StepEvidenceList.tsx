import { useRef } from 'react';
import { Paperclip, Upload } from 'lucide-react';
import { NestedEvidence } from '@/types/testcase';
import EvidenceItem from './EvidenceItem';

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
      name: '',
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
            return (
              <EvidenceItem
                key={evidence.id}
                evidence={evidence}
                isEditing={isEditing}
                onChange={handleEvidenceChange}
                onDelete={handleEvidenceDelete}
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
