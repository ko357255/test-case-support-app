'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hook/use-auth';

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const { register, isLoading } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('パスワードが一致しません。');
      return;
    }

    const result = await register(name, email, password);

    if (result.success) {
      router.push('/projects');
    } else {
      setError(
        'サインアップに失敗しました。入力内容を確認して再度お試しください。',
      );
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">サインアップ</CardTitle>
        <CardDescription>
          必要事項を入力してアカウントを作成してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">ユーザー名</Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="passwordConfirm">パスワード（確認）</Label>
            <Input
              id="passwordConfirm"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {error && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-center text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? '作成中...' : 'アカウント作成'}
          </Button>
        </form>

        <p className="text-muted-foreground mt-4 text-center text-sm">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/login" className="text-primary hover:underline">
            ログイン
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
