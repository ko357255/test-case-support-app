import { ArrowLeft } from 'lucide-react';

type Props = {
  onBack: () => void;
};

export default function BackButton({ onBack }: Props) {
  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        テストケース一覧に戻る
      </button>
    </div>
  );
}
