// hooks/use-auth.ts
import { useState } from 'react';
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from 'next-auth/react';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { UserDoc } from '@/types/firestore';
import { DEFAULT_AVATAR_URL } from '@/config/user';

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
      // Firebase Authでユーザー作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass,
      );
      const user = userCredential.user;
      const trimmedName = name.trim();

      // usersコレクションにユーザーデータを保存
      await setDoc(
        doc(db, 'users', user.uid),
        {
          displayName: trimmedName || 'ユーザー',
          avatarUrl: DEFAULT_AVATAR_URL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        } as UserDoc,
        { merge: true },
      );

      // NextAuthのセッション開始
      const idToken = await user.getIdToken();
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
