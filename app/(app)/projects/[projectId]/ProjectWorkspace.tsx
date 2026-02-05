'use client';

import { useEffect, useState } from 'react';
import TestCaseDetail from '@/components/features/testcase/detail/TestCaseDetail';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import ProjectSettingsModal from '@/components/features/project/ProjectSettingsModal';
import UserSettingsModal from '@/components/features/user/UserSettingsModal';
import { ProjectDTO, TestCaseDoc, TestCaseDTO } from '@/types/firestore';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Props = {
  project: ProjectDTO;
};

/**
 * プロジェクトスペース（クライアント）
 */
export default function ProjectWorkspace({ project }: Props) {
  const [testCases, setTestCases] = useState<TestCaseDTO[]>([]);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(
    null,
  );
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(true);
  const [isSavingNewTestCase, setIsSavingNewTestCase] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);

  // テストケースのデータ取得
  useEffect(() => {
    const q = query(
      collection(db, 'projects', project.id, 'testCases'),
      orderBy('createdAt'),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        console.log('onSnapshot: testCases');
        setTestCases(
          snap.docs.map((doc) => {
            const data = doc.data() as TestCaseDoc;
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt.toMillis(),
              updatedAt: data.updatedAt.toMillis(),
            };
          }),
        );
        setIsLoadingTestCases(false);
      },
      (err) => {
        // Permission denied can occur during sign-out when the user loses access
        if ((err as { code?: string })?.code === 'permission-denied') {
          console.warn('Snapshot listener permission-denied after sign-out');
          return;
        }
        console.error('Snapshot listener error (testCases):', err);
      },
    );

    return () => unsub();
  }, [project.id]);

  const handleAddTestCase = async (payload: {
    title: string;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
  }) => {
    setIsSavingNewTestCase(true);
    try {
      const { createTestCase } = await import('@/lib/firestore/testCases');
      const ref = await createTestCase(project.id, {
        title: payload.title,
        description: '',
        category: payload.category ?? '',
        priority: payload.priority ?? 'medium',
        status: 'not_started',
      });
      setSelectedTestCaseId(ref.id);
    } catch (err) {
      console.error('Failed to create test case', err);
      alert('テストケースの作成に失敗しました。');
    } finally {
      setIsSavingNewTestCase(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        project={project}
        testCases={testCases}
        selectedTestCaseId={selectedTestCaseId}
        onSelectTestCaseId={(tc) => setSelectedTestCaseId(tc)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAddTestCase={handleAddTestCase}
        isLoading={isLoadingTestCases}
        isSavingNewTestCase={isSavingNewTestCase}
        onOpenUserSettings={() => setIsUserSettingsOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {!selectedTestCaseId || !project.id ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-8">
            <p className="text-lg font-medium">
              テストケースを選択してください
            </p>
          </div>
        ) : (
          <TestCaseDetail
            projectId={project.id}
            testCaseId={selectedTestCaseId}
          />
        )}
      </main>

      <ProjectSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        project={project}
      />

      <UserSettingsModal
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
      />
    </div>
  );
}
