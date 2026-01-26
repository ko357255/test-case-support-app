import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { adminAuth } from '@/lib/firebase-admin';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Firebase Email Login',
      credentials: {
        idToken: { type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;

        const decoded = await adminAuth.verifyIdToken(credentials.idToken);

        return {
          id: decoded.uid,
          uid: decoded.uid,
          email: decoded.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.uid = token.uid as string;
      return session;
    },
  },
};
