'use client';

import { useEffect, useState } from 'react';
import { Settings, Users, X } from 'lucide-react';
import { ProjectDTO } from '@/types/firestore';
import { auth, db } from '@/lib/firebase';
import {
  doc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDTO;
}

/**
 * プロジェクト設定モーダル
 */
export default function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
}: Props) {
  const [activeTab, setActiveTab] = useState<'project' | 'members'>('project');

  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(
    project.description,
  );
  const [members, setMembers] = useState<string[]>(project.memberIds || []);
  const [newMemberId, setNewMemberId] = useState('');
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // props.project が変わったときに状態を同期
  useEffect(() => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setMembers(project.memberIds || []);
  }, [project]);

  // 現在のユーザーがオーナーかどうか判定
  useEffect(() => {
    const current = auth.currentUser;
    if (current) {
      setIsOwner(current.uid === project.ownerId);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setIsOwner(u?.uid === project.ownerId);
    });
    return () => unsub();
  }, [project.ownerId]);

  const handleSaveProject = async () => {
    if (!isOwner) {
      alert('オーナーのみプロジェクト設定を変更できます。');
      return;
    }
    try {
      setSaving(true);
      await updateDoc(doc(db, 'projects', project.id), {
        name: projectName,
        description: projectDescription,
        updatedAt: serverTimestamp(),
      });
      alert('プロジェクトを保存しました。');
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async () => {
    const id = newMemberId.trim();
    if (!id) return alert('メンバーIDを入力してください。');
    if (members.includes(id)) return alert('既にメンバーです。');
    try {
      setSaving(true);
      await updateDoc(doc(db, 'projects', project.id), {
        memberIds: arrayUnion(id),
        updatedAt: serverTimestamp(),
      });
      setMembers((s) => [...s, id]);
      setNewMemberId('');
    } catch (err) {
      console.error(err);
      alert('メンバーの追加に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    if (!isOwner) return alert('オーナーのみ変更できます。');
    if (id === project.ownerId) return alert('オーナーは削除できません。');
    try {
      setSaving(true);
      await updateDoc(doc(db, 'projects', project.id), {
        memberIds: arrayRemove(id),
        updatedAt: serverTimestamp(),
      });
      setMembers((s) => s.filter((m) => m !== id));
    } catch (err) {
      console.error(err);
      alert('メンバーの削除に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  // モーダルが閉じているときは何も表示しない
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose} // 背景クリック時にモーダルを閉じる
    >
      <div
        className="animate-in fade-in bg-card text-card-foreground border-border flex h-[550px] w-full max-w-3xl overflow-hidden rounded-2xl border shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()} // 親コンポーネントにクリックを伝達させない
      >
        {/* サイドメニュー */}
        <aside className="border-border bg-muted/30 w-52 border-r p-4">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('project')}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'project'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Settings size={16} className="shrink-0" />
              <span>プロジェクト設定</span>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'members'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Users size={16} className="shrink-0" />
              <span>メンバー</span>
            </button>
          </nav>
        </aside>

        {/* メインコンテンツエリア */}
        <div className="flex flex-1 flex-col">
          <header className="border-border flex items-center justify-between border-b p-6">
            <h3 className="text-lg font-bold">
              {activeTab === 'project' ? 'プロジェクト設定' : 'メンバー管理'}
            </h3>
            <button
              onClick={onClose}
              className="hover:bg-accent rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'project' ? (
              /* プロジェクト情報設定 */
              <div className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    プロジェクト名
                  </label>
                  <input
                    type="text"
                    className="border-input bg-background mt-1 w-full rounded-lg border p-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={!isOwner || saving}
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    説明
                  </label>
                  <textarea
                    className="border-input bg-background mt-1 w-full rounded-lg border p-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    disabled={!isOwner || saving}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <>
                      <button
                        onClick={handleSaveProject}
                        disabled={saving}
                        className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
                      >
                        {saving ? '保存中...' : '保存'}
                      </button>
                      <button
                        onClick={() => {
                          setProjectName(project.name);
                          setProjectDescription(project.description);
                        }}
                        disabled={saving}
                        className="rounded-md border px-4 py-2 text-sm"
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-xs">
                      プロジェクトの設定はオーナーのみ変更できます。
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* メンバーリスト表示 */
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="メンバーIDを追加"
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                    disabled={!isOwner || saving}
                  />
                  <button
                    onClick={handleAddMember}
                    disabled={!isOwner || saving}
                    className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
                  >
                    追加
                  </button>
                </div>
                <div className="space-y-2">
                  {members.map((id) => (
                    <div
                      key={id}
                      className="border-border bg-accent/20 flex items-center justify-between rounded-xl border p-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                          {id[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {id === project.ownerId && (
                          <span className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-[10px] font-bold uppercase">
                            オーナー
                          </span>
                        )}
                        {isOwner && id !== project.ownerId && (
                          <button
                            onClick={() => handleRemoveMember(id)}
                            disabled={saving}
                            className="text-destructive rounded-md border px-3 py-1 text-sm"
                          >
                            削除
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
