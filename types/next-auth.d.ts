import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      uid: string;
      email?: string | null;
      image?: string | null;
      name?: string | null;
    };
  }
}
