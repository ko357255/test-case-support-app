'use client';

import { useState, useMemo } from 'react';
import { NestedProject, NestedTestCase } from '@/types/testcase';
// import Sidebar from './_components/Sidebar';
// import SettingsModal from './_components/SettingsModal';
import TestCaseDetail from '@/components/features/testcases/detail/TestCaseDetail';

type Props = {
  initialProject: NestedProject;
};

export default function ProjectWorkspace({ initialProject }: Props) {
  // ---- グローバル state ----
  const [project] = useState(initialProject);
  const [selectedTestCase, setSelectedTestCase] =
    useState<NestedTestCase | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ---- derived state ----
  const categories = useMemo(() => {
    return Array.from(new Set(project.testCases.map((tc) => tc.category)));
  }, [project]);

  const filteredTestCases = useMemo(() => {
    return project.testCases.filter((tc) => {
      const matchesSearch = tc.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || tc.status === statusFilter;
      const matchesCategory = !categoryFilter || tc.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [project, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* <Sidebar
        project={project}
        testCases={filteredTestCases}
        categories={categories}
        selectedTestCase={selectedTestCase}
        onSelectTestCase={setSelectedTestCase}
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        statusFilter={statusFilter}
        onChangeStatus={setStatusFilter}
        categoryFilter={categoryFilter}
        onChangeCategory={setCategoryFilter}
        onOpenSettings={() => setIsSettingsOpen(true)}
      /> */}

      <main className="flex-1 overflow-y-auto">
        <TestCaseDetail testCase={selectedTestCase} />
      </main>

      {/* <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        project={project}
      /> */}
    </div>
  );
}
