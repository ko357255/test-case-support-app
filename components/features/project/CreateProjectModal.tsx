'use client';

import { useEffect, useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createProject } from '@/lib/api/projects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (projectId: string) => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setDescription('');
    setError('');
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('プロジェクト名を入力してください。');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const projectId = await createProject({
        name: trimmedName,
        description,
      });
      onCreated(projectId);
      onClose();
    } catch (err) {
      console.error(err);
      setError('作成に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus size={18} />
              新規プロジェクト
            </DialogTitle>
            <DialogDescription>
              プロジェクトの基本情報を入力してください。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                プロジェクト名
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 次世代EC品質保証"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                説明
              </label>
              <textarea
                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-[120px] w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="プロジェクトの目的や範囲を入力"
                disabled={saving}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? '作成中...' : '作成する'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
