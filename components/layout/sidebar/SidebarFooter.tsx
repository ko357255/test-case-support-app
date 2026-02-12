import Avatar from '@/components/shared/avatar';

type Props = {
  avatarUrl?: string;
  initials: string;
  userName: string;
  onOpenUserSettings: () => void;
};

export default function SidebarFooter({
  avatarUrl,
  initials,
  userName,
  onOpenUserSettings,
}: Props) {
  return (
    <div className="border-border mt-auto border-t px-3 py-1">
      <button
        type="button"
        aria-label="ユーザー設定を開く"
        onClick={onOpenUserSettings}
        className="hover:bg-accent flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors"
      >
        <Avatar
          avatarUrl={avatarUrl}
          name={userName}
          size={36}
          className="bg-primary text-primary-foreground font-bold"
        />
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-bold">{userName}</p>
        </div>
      </button>
    </div>
  );
}
