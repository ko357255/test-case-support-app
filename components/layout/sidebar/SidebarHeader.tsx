import { FileText, Plus } from 'lucide-react';

export default function SidebarHeader() {
  return (
    <div className="border-border border-b p-6">
      <div className="mb-6 flex items-center gap-2">
        <FileText className="text-primary h-6 w-6" />
        <span className="text-lg font-medium">テスト管理</span>
      </div>

      <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5">
        <Plus className="h-4 w-4" />
        新規作成
      </button>
    </div>
  );
}
