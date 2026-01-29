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
  const [project] = useState(initialProject);
  const [selectedTestCase, setSelectedTestCase] =
    useState<NestedTestCase | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        project={project}
        selectedTestCaseId={selectedTestCase?.id}
        onSelectTestCase={setSelectedTestCase}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        <TestCaseDetail testCase={selectedTestCase} />
      </main>

      <ProjectSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        project={project}
      />
    </div>
  );
}
