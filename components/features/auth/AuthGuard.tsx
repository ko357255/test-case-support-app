'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/login');
    }
  }, [loading, user, isLoginPage, router]);

  // リダイレクト中は何も表示しない
  if (loading) {
    return null;
  }

  if (!user && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
}
