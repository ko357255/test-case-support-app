'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useSyncExternalStore } from 'react';

// クライアントサイドでマウントされているかを返す
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <div className="flex items-center gap-2 px-6 pt-4">
      <Sun className="h-4 w-4" />
      <Switch
        checked={mounted && resolvedTheme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
      <Moon className="h-4 w-4" />
    </div>
  );
}
