import { ArrowLeft } from 'lucide-react';

type Props = {
  onBack: () => void;
};

export default function BackButton({ onBack }: Props) {
  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
        テストケース一覧に戻る
      </button>
    </div>
  );
}
