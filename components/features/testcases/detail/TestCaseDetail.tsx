'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TestCase } from '@/types/testcase';
import BackButton from './BackButton';
import TestCaseHeader from './TestCaseHeader';
import TestCaseStepList from './TestCaseStepList';
import TestCaseEvidenceList from './TestCaseEvidenceList';

type Props = {
  testCase: TestCase;
};

export default function TestCaseDetail({ testCase }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTestCase, setTestCase] = useState<TestCase>(testCase);
  const router = useRouter();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTestCase(testCase);
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <BackButton onBack={router.back} />

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        <TestCaseHeader
          isEditing={isEditing}
          editedTestCase={editedTestCase}
          setTestCase={setTestCase}
          onEdit={handleEdit}
          onCancel={handleCancel}
        />

        <TestCaseStepList isEditing={isEditing} steps={editedTestCase.steps} />

        <TestCaseEvidenceList
          isEditing={isEditing}
          evidences={editedTestCase.evidences}
        />
      </div>
    </div>
  );
}
