import { Metadata } from 'next';
import LoginForm from '@/components/features/auth/LoginForm';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
