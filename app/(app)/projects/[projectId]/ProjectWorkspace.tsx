'use client';

import { useState } from 'react';
import { NestedProject, NestedTestCase } from '@/types/testcase';
// import SettingsModal from './_components/SettingsModal';
import TestCaseDetail from '@/components/features/testcase/detail/TestCaseDetail';
import TestCaseCreate from '@/components/features/testcase/detail/TestCaseCreate';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import ProjectSettingsModal from '@/components/features/project/ProjectSettingsModal';
import UserSettingsModal from '@/components/features/user/UserSettingsModal';

type Props = {
  initialProject: NestedProject;
};

/**
 * プロジェクトスペース（クライアント）
 */
export default function ProjectWorkspace({ initialProject }: Props) {
  const [project, setProject] = useState(initialProject);
  const [selectedTestCase, setSelectedTestCase] =
    useState<NestedTestCase | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);

  /**
   * テストケースが更新されたときに呼ばれるハンドラ
   * @param updatedTestCase 更新されたテストケース
   */
  const handleTestCaseUpdate = (updatedTestCase: NestedTestCase) => {
    // プロジェクト内のテストケースリストを更新
    const updatedTestCases = project.testCases.map((tc) =>
      tc.id === updatedTestCase.id ? updatedTestCase : tc,
    );
    setProject({ ...project, testCases: updatedTestCases });

    // 選択中のテストケースも更新
    if (selectedTestCase?.id === updatedTestCase.id) {
      setSelectedTestCase(updatedTestCase);
    }
  };

  /**
   * 新規テストケース保存時のハンドラ
   */
  const handleTestCaseCreate = (newTestCase: NestedTestCase) => {
    // IDを生成してプロジェクトに追加 (本来はAPIレスポンスのIDを使用)
    const createdTestCase = {
      ...newTestCase,
      id: crypto.randomUUID(),
    };

    const updatedTestCases = [...project.testCases, createdTestCase];
    setProject({ ...project, testCases: updatedTestCases });

    // 作成モードを終了し、作成したテストケースを選択
    setIsCreating(false);
    setSelectedTestCase(createdTestCase);
  };

  /**
   * テストケース削除時のハンドラ
   */
  const handleTestCaseDelete = (testCaseId: string) => {
    const updatedTestCases = project.testCases.filter(
      (tc) => tc.id !== testCaseId,
    );
    setProject({ ...project, testCases: updatedTestCases });

    if (selectedTestCase?.id === testCaseId) {
      setSelectedTestCase(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        project={project}
        selectedTestCaseId={selectedTestCase?.id}
        onSelectTestCase={(tc) => {
          setSelectedTestCase(tc);
          setIsCreating(false);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAddTestCase={() => {
          setIsCreating(true);
          setSelectedTestCase(null);
        }}
        onOpenUserSettings={() => setIsUserSettingsOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {isCreating ? (
          <TestCaseCreate
            onSave={handleTestCaseCreate}
            onCancel={() => {
              setIsCreating(false);
              // キャンセル時は選択状態を戻すなどの処理が必要ならここに追加
            }}
          />
        ) : (
          <TestCaseDetail
            testCase={selectedTestCase}
            onUpdate={handleTestCaseUpdate}
            onDelete={handleTestCaseDelete}
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
