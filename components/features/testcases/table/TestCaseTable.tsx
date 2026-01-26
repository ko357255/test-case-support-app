'use client';

import type { NestedTestCase } from '@/types/testcase';
import TestCaseTableHeader from '@/components/features/testcases/table/TestCaseTableHeader';
import TestCaseTableRow from '@/components/features/testcases/table/TestCaseTableRow';

type Props = {
  testCases: NestedTestCase[];
};

/**
 * テストケーステーブルコンポーネント（クライアント）
 */
export default function TestCaseTable({ testCases }: Props) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
      <table className="w-full">
        {/* 列名 */}
        <TestCaseTableHeader />

        {/* 行 */}
        <tbody className="divide-border divide-y">
          {testCases.map((tc) => (
            // テストケースの行
            <TestCaseTableRow key={tc.id} testCase={tc} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
