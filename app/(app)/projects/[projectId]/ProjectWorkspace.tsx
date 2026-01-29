'use client';

import { useState } from 'react';
import { NestedProject, NestedTestCase } from '@/types/testcase';
// import SettingsModal from './_components/SettingsModal';
import TestCaseDetail from '@/components/features/testcase/detail/TestCaseDetail';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import ProjectSettingsModal from '@/components/features/project/ProjectSettingsModal';

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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        project={project}
        selectedTestCaseId={selectedTestCase?.id}
        onSelectTestCase={setSelectedTestCase}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        <TestCaseDetail
          testCase={selectedTestCase}
          onUpdate={handleTestCaseUpdate}
        />
      </main>

      <ProjectSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        project={project}
      />
    </div>
  );
}
