'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TestCase } from '@/types/testcase';
import BackButton from '../detail/BackButton';
import TestCaseHeader from '../detail/TestCaseHeader';
import TestCaseStepList from '../detail/TestCaseStepList';
import TestCaseEvidenceList from '../detail/TestCaseEvidenceList';

export default function TestCaseCreate() {
  const router = useRouter();
  const [newTestCase, setNewTestCase] = useState<TestCase>({
    id: '',
    title: '',
    description: '',
    status: 'not_started',
    priority: 'medium',
    category: '',
    steps: [],
    evidences: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = async () => {
    // 保存処理
    router.push('/');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="p-8">
      <BackButton onBack={router.back} />

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        <TestCaseHeader
          isEditing={true}
          editedTestCase={newTestCase}
          setTestCase={setNewTestCase}
          onEdit={() => {}} // 新規作成時は使用しない
          onCancel={handleCancel}
          onSave={handleSave}
        />

        <TestCaseStepList
          isEditing={true}
          steps={newTestCase.steps}
          onStepsChange={(steps) => setNewTestCase({ ...newTestCase, steps })}
        />

        <TestCaseEvidenceList
          isEditing={true}
          evidences={newTestCase.evidences}
        />
      </div>
    </div>
  );
}
