import {
  collection,
  addDoc,
  getDocs,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TestStepDoc {
  testCaseId: string;
  stepNumber: number;
  action: string;
  expected: string;
  actual?: string;
  status?: 'passed' | 'failed' | 'in_progress' | 'not_started';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** プロジェクト/テストケース配下のテストステップを取得 */
export async function fetchTestSteps(projectId: string, testCaseId: string) {
  const q = query(
    collection(db, 'projects', projectId, 'testCases', testCaseId, 'testSteps'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as TestStepDoc) }));
}

/** テストステップを作成 */
export async function createTestStep(
  projectId: string,
  testCaseId: string,
  data: Omit<TestStepDoc, 'createdAt' | 'updatedAt'>,
) {
  return addDoc(
    collection(db, 'projects', projectId, 'testCases', testCaseId, 'testSteps'),
    {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  );
}
