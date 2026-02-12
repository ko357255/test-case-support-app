'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hook/use-auth';
import { LogOut, Moon, Sun, User, X, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { auth, db } from '@/lib/firebase';
import { storage } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserDoc } from '@/types/firestore';
import Avatar from '@/components/shared/avatar';
import { DEFAULT_AVATAR_URL } from '@/config/user';

interface Props {
  /** モーダルの開閉 */
  isOpen: boolean;
  /** モーダルを閉じるための関数 */
  onClose: () => void;
}

/**
 * クライアントサイドでマウントされているかを返す
 */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * ユーザー設定モーダル（クライアント）
 */
export default function UserSettingsModal({ isOpen, onClose }: Props) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [hasDoc, setHasDoc] = useState(false);

  // モーダルが開いたときにユーザードキュメントを取得する
  useEffect(() => {
    if (!isOpen) return;
    let unsub: (() => void) | null = null;

    const loadUser = async (uid: string) => {
      try {
        setLoading(true);
        // Firestore からユーザー情報を取得
        const d = await getDoc(doc(db, 'users', uid));
        const data = d.exists() ? (d.data() as UserDoc) : undefined;
        setName(data?.displayName ?? '');
        setOriginalName(data?.displayName ?? '');
        setAvatarUrl(data?.avatarUrl ?? DEFAULT_AVATAR_URL);
        setHasDoc(d.exists());
      } finally {
        setLoading(false);
      }
    };

    const current = auth.currentUser;
    if (current) {
      loadUser(current.uid);
    } else {
      unsub = onAuthStateChanged(auth, (u) => {
        if (u) loadUser(u.uid);
      });
    }

    return () => {
      if (unsub) unsub();
    };
  }, [isOpen]);

  /**
   * ユーザーアイコン画像アップロード処理
   */
  const handleAvatarUpload = async (file: File) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert('ログインしてください。');
      return;
    }

    // ファイルサイズチェック（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズが大きすぎます（5MB以下）');
      return;
    }

    // 画像形式チェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルのみアップロード可能です');
      return;
    }

    try {
      setUploadingAvatar(true);
      const storageRef = ref(storage, `users/${uid}/avatar`);

      // ファイルをアップロード
      await uploadBytes(storageRef, file);

      // ダウンロードURLを取得
      const url = await getDownloadURL(storageRef);

      // Firestoreに保存
      await setDoc(
        doc(db, 'users', uid),
        {
          avatarUrl: url,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setAvatarUrl(url);
      alert('アイコンを更新しました。');
    } catch (err) {
      console.error(err);
      alert('アイコンのアップロードに失敗しました。');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * ファイル選択時のハンドラ
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  /**
   * ユーザー情報の保存処理
   */
  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert('ログインしてください。');
      return;
    }
    try {
      setSaving(true);
      if (hasDoc) {
        // 既存ドキュメントの更新は createdAt を変更しない
        await setDoc(
          doc(db, 'users', uid),
          {
            displayName: name,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } else {
        // 新規作成時のみ createdAt を設定
        await setDoc(
          doc(db, 'users', uid),
          {
            displayName: name,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        setHasDoc(true);
      }
      setOriginalName(name);
      alert('保存しました。');
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  /**
   * ログアウト処理
   */
  const handleLogout = async () => {
    const result = await logout();
    // ログアウト処理が成功した場合のみページ遷移する
    if (result.success) {
      router.replace('/login');
    }
  };

  // モーダルが閉じているときは何も表示しない
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in fade-in bg-card text-card-foreground border-border flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <header className="border-border flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <User size={20} />
            <h3 className="text-lg font-bold">ユーザー設定</h3>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-accent rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* メインコンテンツ */}
        <div className="space-y-8 p-6">
          {/* アイコン */}
          <div>
            <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              アイコン
            </label>
            <div className="mt-4 flex items-end gap-4">
              <Avatar
                avatarUrl={avatarUrl}
                name={name}
                size={80}
                backgroundColor="#ccc"
              />
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploadingAvatar || loading}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar || loading}
                  className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Upload size={16} />
                  {uploadingAvatar ? 'アップロード中...' : 'アップロード'}
                </button>
              </div>
            </div>
          </div>

          {/* ユーザー名 */}
          <div>
            <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              ユーザー名
            </label>
            <input
              type="text"
              className="border-input bg-background mt-2 w-full rounded-lg border p-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || saving}
            />
            <div className="mt-2 flex gap-2">
              <Button
                onClick={handleSave}
                disabled={
                  saving || loading || name.trim() === originalName.trim()
                }
                className="py-2"
              >
                {saving ? '保存中...' : '保存'}
              </Button>
              <Button
                onClick={() => setName(originalName)}
                variant="outline"
                disabled={saving || loading}
                className="py-2"
              >
                キャンセル
              </Button>
            </div>
          </div>

          {/* テーマ切り替え */}
          <div>
            <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
              テーマ
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg py-4 font-medium transition-all ${
                  mounted && resolvedTheme === 'light'
                    ? 'border-primary bg-primary text-primary-foreground border-2'
                    : 'border-border bg-background text-muted-foreground border hover:border-gray-400'
                }`}
              >
                <Sun size={18} />
                <span>ライト</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg py-4 font-medium transition-all ${
                  mounted && resolvedTheme === 'dark'
                    ? 'border-primary bg-primary text-primary-foreground border-2'
                    : 'border-border bg-background text-muted-foreground border hover:border-gray-400'
                }`}
              >
                <Moon size={18} />
                <span>ダーク</span>
              </button>
            </div>
          </div>

          {/* ログアウト */}
          <div>
            <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
              アカウント
            </label>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive h-auto w-full gap-2 py-3 hover:text-white"
            >
              {isLoading ? (
                'ログアウト中...'
              ) : (
                <>
                  <LogOut size={16} />
                  <span>ログアウト</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
