import {
  ProjectDoc,
  TestCaseDoc,
  TestStepDoc,
  EvidenceDoc,
} from '@/types/firestore';

/** * Timestampプロパティを Date に変換し、必須化する
 * 元のDoc定義に存在する createdAt, updatedAt を Date 型に上書きします
 */
type StrictDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: Date;
  updatedAt: Date;
};

/** エビデンス: EvidenceDoc の日付を Date に変換 */
export type NestedEvidence = StrictDates<EvidenceDoc>;

/** ステップ: 日付を Date に変換し、evidences を追加 */
export interface NestedTestStep extends StrictDates<TestStepDoc> {
  evidences: NestedEvidence[];
}

/** テストケース: 日付を Date に変換し、steps と evidences を追加 */
export interface NestedTestCase extends StrictDates<TestCaseDoc> {
  steps: NestedTestStep[];
  evidences: NestedEvidence[];
}

/** プロジェクト: 日付を Date に変換し、testCases を追加 */
export interface NestedProject extends StrictDates<ProjectDoc> {
  testCases: NestedTestCase[];
}

/** * 変換前のモックデータ構造を定義する型 (mockDataのキャスト用)
 * Firestoreの各Doc型（Timestamp保持）を維持した入れ子構造です
 */
export interface RawMockProject extends ProjectDoc {
  testCases: (TestCaseDoc & {
    steps: (TestStepDoc & { evidences: EvidenceDoc[] })[];
    evidences: EvidenceDoc[];
  })[];
}
