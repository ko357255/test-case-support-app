'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './auth/AuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 認証の設定
    <AuthProvider>
      {/* テーマの設定 */}
      <ThemeProvider
        attribute="class" // clas="dark" を付ける
        defaultTheme="system" // 初期値はシステム設定に合わせる
        enableSystem // システム設定の変更を監視する
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
