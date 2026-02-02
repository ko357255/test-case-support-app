import Link from 'next/link';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';

type Props = {
  projectName: string;
  onOpenSettings: () => void;
};

export default function SidebarHeader({ projectName, onOpenSettings }: Props) {
  return (
    <div className="border-border bg-card border-b p-5">
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
      >
        <ArrowLeft size={14} /> プロジェクト一覧へ
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="truncate text-base font-black tracking-tight">
          {projectName}
        </h2>
        <button
          type="button"
          aria-label="プロジェクト設定"
          onClick={onOpenSettings}
          className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1 transition-colors"
        >
          <SettingsIcon size={18} />
        </button>
      </div>
    </div>
  );
}
