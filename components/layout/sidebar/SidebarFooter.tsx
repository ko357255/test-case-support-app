import Image from 'next/image';

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
        <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center overflow-hidden rounded-full font-bold">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName || 'User avatar'}
              width={36}
              height={36}
              sizes="36px"
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm">{initials}</span>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-bold">{userName}</p>
        </div>
      </button>
    </div>
  );
}
