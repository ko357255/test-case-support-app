// hooks/use-auth.ts
import { useState } from 'react';
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from 'next-auth/react';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      // Firebase Authで認証
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass,
      );
      const idToken = await userCredential.user.getIdToken();

      // NextAuthのセッション開始
      const result = await nextAuthSignIn('credentials', {
        idToken,
        redirect: false,
      });

      if (result?.error) throw new Error(result.error);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      // Firebase Authでユーザー作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        pass,
      );
      const user = userCredential.user;
      const trimmedName = name.trim();

      // idTokenを取得
      const idToken = await user.getIdToken();

      // Server ActionでFirestoreにユーザー情報を保存
      const { registerUser } = await import('@/lib/actions/users');
      await registerUser(idToken, trimmedName);

      // NextAuthのセッション開始
      const result = await nextAuthSignIn('credentials', {
        idToken,
        redirect: false,
      });

      if (result?.error) throw new Error(result.error);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        firebaseSignOut(auth), // firebaseのログアウト
        nextAuthSignOut({ redirect: false }), // NextAuthのログアウト
      ]);

      const hasError = results.some((r) => r.status === 'rejected');

      if (hasError) {
        setIsLoading(false); // 失敗時はローディングを解除
        return { success: false };
      }
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false };
    }
  };

  return { login, logout, register, isLoading };
};
