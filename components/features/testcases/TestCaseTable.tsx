'use client';

import type { TestCase } from '@/types/testcase';
import TestCaseTableHeader from './TestCaseTableHeader';
import TestCaseTableRow from './TestCaseTableRow';

type Props = {
  testCases: TestCase[];
};

export default function TestCaseTable({ testCases }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
      <table className="w-full">
        <TestCaseTableHeader />
        <tbody className="divide-y divide-gray-300">
          {testCases.map((tc) => (
            <TestCaseTableRow key={tc.id} testCase={tc} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
