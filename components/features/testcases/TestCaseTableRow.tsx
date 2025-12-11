'use client';

import type { TestCase } from '@/types/testcase';

import StatusCell from './cells/StatusCell';
import TitleCell from './cells/TitleCell';
import CategoryCell from './cells/CategoryCell';
import PriorityCell from './cells/PriorityCell';
import StepsCell from './cells/StepsCell';
import EvidenceCell from './cells/EvidenceCell';
import UpdatedAtCell from './cells/UpdatedAtCell';
import { useRouter } from 'next/navigation'; // next/router ではなく next/navigation からインポート

type Props = {
  testCase: TestCase;
};

export default function TestCaseTableRow({ testCase }: Props) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/testcases/${testCase.id}`)}
      className="cursor-pointer transition-colors hover:bg-gray-100"
    >
      <StatusCell status={testCase.status} />
      <TitleCell title={testCase.title} description={testCase.description} />
      <CategoryCell category={testCase.category} />
      <PriorityCell priority={testCase.priority} />
      <StepsCell count={testCase.steps.length} />
      <EvidenceCell count={testCase.evidences.length} />
      <UpdatedAtCell date={testCase.updatedAt} />
    </tr>
  );
}
