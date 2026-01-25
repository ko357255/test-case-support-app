'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/components/features/auth/AuthProvider';
import AuthGuard from '@/components/features/auth/AuthGuard';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // テーマの設定
    <ThemeProvider
      attribute="class" // clas="dark" を付ける
      defaultTheme="system" // 初期値はシステム設定に合わせる
      enableSystem // システム設定の変更を監視する
    >
      {/* 認証の設定 */}
      <AuthProvider>
        {/* 認証ガードの設定 */}
        <AuthGuard>{children}</AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
