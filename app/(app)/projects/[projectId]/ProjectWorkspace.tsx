'use client';

import { useEffect, useState } from 'react';
import TestCaseDetail from '@/components/features/testcase/detail/TestCaseDetail';
import TestCaseCreate from '@/components/features/testcase/detail/TestCaseCreate';
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
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(true);
  const [isSavingNewTestCase, setIsSavingNewTestCase] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);

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

  /**
   * テストケースが更新されたときに呼ばれるハンドラ
   * @param updatedTestCase 更新されたテストケース
   */
  // const handleTestCaseUpdate = (updatedTestCase: NestedTestCase) => {
  //   // プロジェクト内のテストケースリストを更新
  //   const updatedTestCases = project.testCases.map((tc) =>
  //     tc.id === updatedTestCase.id ? updatedTestCase : tc,
  //   );
  //   setProject({ ...project, testCases: updatedTestCases });

  //   // 選択中のテストケースも更新
  //   if (selectedTestCase?.id === updatedTestCase.id) {
  //     setSelectedTestCase(updatedTestCase);
  //   }
  // };

  /**
   * 新規テストケース保存時のハンドラ
   */
  // const handleTestCaseCreate = (newTestCase: NestedTestCase) => {
  //   // IDを生成してプロジェクトに追加 (本来はAPIレスポンスのIDを使用)
  //   const createdTestCase = {
  //     ...newTestCase,
  //     id: crypto.randomUUID(),
  //   };

  //   const updatedTestCases = [...project.testCases, createdTestCase];
  //   setProject({ ...project, testCases: updatedTestCases });

  //   // 作成モードを終了し、作成したテストケースを選択
  //   setIsCreating(false);
  //   setSelectedTestCase(createdTestCase);
  // };

  /**
   * テストケース削除時のハンドラ
   */
  // const handleTestCaseDelete = (testCaseId: string) => {
  //   const updatedTestCases = project.testCases.filter(
  //     (tc) => tc.id !== testCaseId,
  //   );
  //   setProject({ ...project, testCases: updatedTestCases });

  //   if (selectedTestCase?.id === testCaseId) {
  //     setSelectedTestCase(null);
  //   }
  // };

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
      setIsCreating(false);
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
        onSelectTestCaseId={(tc) => {
          setSelectedTestCaseId(tc);
          setIsCreating(false);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAddTestCase={handleAddTestCase}
        isLoading={isLoadingTestCases}
        isSavingNewTestCase={isSavingNewTestCase}
        onOpenUserSettings={() => setIsUserSettingsOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {isCreating ? (
          <TestCaseCreate
          // onSave={handleTestCaseCreate}
          // onCancel={() => {
          //   setIsCreating(false);
          //   // キャンセル時は選択状態を戻すなどの処理が必要ならここに追加
          // }}
          />
        ) : !selectedTestCaseId || !project.id ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-8">
            <p className="text-lg font-medium">
              テストケースを選択してください
            </p>
          </div>
        ) : (
          <TestCaseDetail
            projectId={project.id}
            testCaseId={selectedTestCaseId}
            // onUpdate={handleTestCaseUpdate}
            // onDelete={handleTestCaseDelete}
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
