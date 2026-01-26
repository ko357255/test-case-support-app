// hooks/use-auth.ts
import { useState } from 'react';
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from 'next-auth/react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      // 1. Firebase Authで認証
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass,
      );
      const idToken = await userCredential.user.getIdToken();

      // 2. NextAuthのセッション開始
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
      await firebaseSignOut(auth); // Firebase側
      await nextAuthSignOut({ callbackUrl: '/login' }); // NextAuth側
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, isLoading };
};
