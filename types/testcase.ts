import {
  ProjectDoc,
  TestCaseDoc,
  TestStepDoc,
  EvidenceDoc,
} from '@/types/firestore';

/**
 * Timestamp型をDate型に変換するためのユーティリティ
 * T: 対象の型, K: Dateに変換したいプロパティ名のユニオン
 */
type ToDate<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: Date;
};

// --- Nested Types (For Frontend Use) ---

/**
 * エビデンス: updatedAt を持たないため createdAt のみ変換
 */
export type NestedEvidence = ToDate<EvidenceDoc, 'createdAt'>;

/**
 * ステップ: 日付を Date に変換し、evidences を追加
 */
export interface NestedTestStep extends ToDate<
  TestStepDoc,
  'createdAt' | 'updatedAt'
> {
  evidences: NestedEvidence[];
}

/**
 * テストケース: 日付を Date に変換し、steps と evidences を追加
 */
export interface NestedTestCase extends ToDate<
  TestCaseDoc,
  'createdAt' | 'updatedAt'
> {
  steps: NestedTestStep[];
  evidences: NestedEvidence[];
}

/**
 * プロジェクト: 日付を Date に変換し、testCases を追加
 */
export interface NestedProject extends ToDate<
  ProjectDoc,
  'createdAt' | 'updatedAt'
> {
  testCases: NestedTestCase[];
}

// --- Mock Data Types ---

/**
 * 変換前のモックデータ構造（Firestoreの構造をシミュレート）
 */
export interface RawMockProject extends ProjectDoc {
  testCases: (TestCaseDoc & {
    steps: (TestStepDoc & { evidences: EvidenceDoc[] })[];
    evidences: EvidenceDoc[];
  })[];
}
