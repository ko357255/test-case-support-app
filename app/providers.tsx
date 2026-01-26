'use client';

import { ThemeProvider } from 'next-themes';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // テーマの設定
    <ThemeProvider
      attribute="class" // clas="dark" を付ける
      defaultTheme="system" // 初期値はシステム設定に合わせる
      enableSystem // システム設定の変更を監視する
    >
      {children}
    </ThemeProvider>
  );
}
