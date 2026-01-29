'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hook/use-auth';
import { LogOut, Moon, Sun, User, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * クライアントサイドでマウントされているかを返す
 */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * ユーザー設定モーダル
 */
export default function UserSettingsModal({ isOpen, onClose }: Props) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const router = useRouter();
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    // ログアウト処理が成功した場合のみページ遷移する
    if (result.success) {
      router.replace('/login');
    }
  };

  // モーダルが閉じているときは何も表示しない
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in fade-in bg-card text-card-foreground border-border flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <header className="border-border flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <User size={20} />
            <h3 className="text-lg font-bold">ユーザー設定</h3>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-accent rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* メインコンテンツ */}
        <div className="space-y-8 p-6">
          {/* ユーザー名 */}
          <div>
            <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              ユーザー名
            </label>
            <input
              type="text"
              className="border-input bg-background mt-2 w-full rounded-lg border p-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
              defaultValue="デモユーザー" // 仮のユーザー名
            />
          </div>

          {/* テーマ切り替え */}
          <div>
            <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
              テーマ
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg py-4 font-medium transition-all ${
                  mounted && resolvedTheme === 'light'
                    ? 'border-primary bg-primary text-primary-foreground border-2'
                    : 'border-border bg-background text-muted-foreground border hover:border-gray-400'
                }`}
              >
                <Sun size={18} />
                <span>ライト</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg py-4 font-medium transition-all ${
                  mounted && resolvedTheme === 'dark'
                    ? 'border-primary bg-primary text-primary-foreground border-2'
                    : 'border-border bg-background text-muted-foreground border hover:border-gray-400'
                }`}
              >
                <Moon size={18} />
                <span>ダーク</span>
              </button>
            </div>
          </div>

          {/* ログアウト */}
          <div>
            <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
              アカウント
            </label>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive h-auto w-full gap-2 py-3 hover:text-white"
            >
              {isLoading ? (
                'ログアウト中...'
              ) : (
                <>
                  <LogOut size={16} />
                  <span>ログアウト</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
