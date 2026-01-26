import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * NextAuthの設定
 */
export const authOptions: NextAuthOptions = {
  // ログイン方法の登録
  providers: [
    // メールアドレスによるログイン
    CredentialsProvider({
      name: 'Firebase Email Login',
      // 受け取るデータ
      credentials: {
        // ログイン時に Firebase から idToken を受け取る
        idToken: { type: 'text' },
      },
      // 認証関数
      async authorize(credentials) {
        if (!credentials?.idToken) return null;
        // idToken をfirebaseで検証する
        const decoded = await adminAuth.verifyIdToken(credentials.idToken);

        // ログイン成功時にデータを返す
        return {
          id: decoded.uid,
          uid: decoded.uid,
          email: decoded.email,
        };
      },
    }),
  ],
  // JWTの秘密鍵
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login', // 未ログイン時に遷移する
  },

  // セッションのカスタマイズ
  callbacks: {
    // jwt に uid を含めるよう変更
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },

    // セッションユーザーに uid を含めるよう変更
    async session({ session, token }) {
      session.user.uid = token.uid as string;
      return session;
    },
  },
};
