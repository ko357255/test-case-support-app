'use client';

import { useState, useMemo, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { ProjectDTO, TestCaseDTO, Presence, UserDoc } from '@/types/firestore';
import SidebarHeader from './SidebarHeader';
import SidebarFilters from './SidebarFilters';
import TestCaseList from './TestCaseList';
import SidebarFooter from './SidebarFooter';

interface Props {
  /** プロジェクト */
  project: ProjectDTO;
  /** テストケース一覧 */
  testCases: TestCaseDTO[];
  /** 選択中のテストケースID */
  selectedTestCaseId: string | null;
  /** テストケース選択時のコールバック */
  onSelectTestCaseId: (testCaseId: string) => void;
  /** 設定画面オープン時のコールバック */
  onOpenSettings: () => void;
  /** プレゼンス */
  presences: Record<string, Presence>;
  /** プレゼンス設定関数 */
  setPresence: (data: Partial<Presence>) => void;
  /** 現在のセッションID */
  currentSessionId: string | null;
  /** 現在のユーザーID */
  currentUserId: string | null;
  /** テストケース追加時のコールバック */
  onAddTestCase?: (payload: {
    title: string;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
  }) => Promise<void>;
  /** ローディング状態 */
  isLoading?: boolean;
  /** 新規テストケース保存中状態 */
  isSavingNewTestCase?: boolean;
  /** ユーザー設定画面オープン時のコールバック */
  onOpenUserSettings: () => void;
}

/**
 * プロジェクト専用サイドバーコンポーネント
 */
export default function ProjectSidebar({
  project,
  testCases,
  selectedTestCaseId,
  onSelectTestCaseId,
  onOpenSettings,
  presences,
  setPresence,
  currentSessionId,
  currentUserId,
  onAddTestCase,
  isLoading = false,
  isSavingNewTestCase = false,
  onOpenUserSettings,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // カテゴリ一覧を抽出（空文字・空白のみのカテゴリは除外）
  const categories = useMemo(() => {
    return Array.from(
      new Set(
        testCases.map((tc) => tc.category).filter((c) => c.trim() !== ''),
      ),
    );
  }, [testCases]);

  // フィルタリング処理
  const filteredTestCases = useMemo(() => {
    return testCases.filter((tc) => {
      const matchesSearch = tc.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || tc.status === statusFilter;
      const matchesCategory = !categoryFilter || tc.category === categoryFilter;
      const matchesPriority = !priorityFilter || tc.priority === priorityFilter;
      return (
        matchesSearch && matchesStatus && matchesCategory && matchesPriority
      );
    });
  }, [testCases, searchQuery, statusFilter, categoryFilter, priorityFilter]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>(
    'medium',
  );

  const [userName, setUserName] = useState('');

  useEffect(() => {
    let unsubAuth: (() => void) | null = null;
    let unsubUser: (() => void) | null = null;

    const startListener = (uid: string) => {
      unsubUser = onSnapshot(doc(db, 'users', uid), (snap) => {
        const data = snap.exists() ? (snap.data() as UserDoc) : undefined;
        setUserName(data?.displayName ?? '');
      });
    };

    const current = auth.currentUser;
    if (current) {
      startListener(current.uid);
    } else {
      unsubAuth = onAuthStateChanged(auth, (u) => {
        if (u) startListener(u.uid);
      });
    }

    return () => {
      if (unsubAuth) unsubAuth();
      if (unsubUser) unsubUser();
    };
  }, []);

  const initials = useMemo(() => {
    const parts = userName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [userName]);

  const presenceByTestCase = useMemo(() => {
    const map: Record<string, Presence[]> = {};
    const myUid = auth.currentUser?.uid ?? currentUserId ?? null;
    Object.values(presences || {}).forEach((p) => {
      if (!p?.testCaseId) return;
      // ignore presence records without identifiers (defensive: old overwritten records)
      if (!p.sessionId && !p.userId) return;
      // exclude own session and own user id to avoid showing self as 'other'
      if (p.sessionId && currentSessionId && p.sessionId === currentSessionId)
        return;
      if (p.userId && myUid && p.userId === myUid) return;
      (map[p.testCaseId] = map[p.testCaseId] || []).push(p);
    });
    return map;
  }, [presences, currentSessionId, currentUserId]);

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewTitle('');
    setNewCategory('');
    setNewPriority('medium');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleSaveAdd = async () => {
    if (!newTitle.trim()) {
      alert('タイトルを入力してください。');
      return;
    }
    if (!onAddTestCase) return;
    await onAddTestCase({
      title: newTitle.trim(),
      category: newCategory.trim(),
      priority: newPriority,
    });
    setIsAdding(false);
  };

  return (
    <aside className="border-border bg-sidebar text-sidebar-foreground flex h-full w-100 flex-col border-r">
      {/* プロジェクトヘッダー */}
      <SidebarHeader
        projectName={project.name}
        onOpenSettings={onOpenSettings}
      />

      {/* 検索・フィルタセクション */}
      <SidebarFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* テストケースリスト */}
      <TestCaseList
        filteredTestCases={filteredTestCases}
        isLoading={isLoading}
        isAdding={isAdding}
        handleStartAdd={handleStartAdd}
        handleCancelAdd={handleCancelAdd}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newPriority={newPriority}
        setNewPriority={setNewPriority}
        handleSaveAdd={handleSaveAdd}
        isSavingNewTestCase={isSavingNewTestCase}
        selectedTestCaseId={selectedTestCaseId}
        onSelectTestCaseId={onSelectTestCaseId}
        presenceByTestCase={presenceByTestCase}
        setPresence={setPresence}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        priorityFilter={priorityFilter}
        statusFilter={statusFilter}
      />

      {/* フッター: ユーザー情報 */}
      <SidebarFooter
        initials={initials}
        userName={userName}
        onOpenUserSettings={onOpenUserSettings}
      />
    </aside>
  );
}
