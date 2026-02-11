import { Metadata } from 'next';
import SignupForm from '@/components/features/auth/SignupForm';

export const metadata: Metadata = {
  title: 'サインアップ',
};

export default function SignupPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <SignupForm />
    </div>
  );
}
