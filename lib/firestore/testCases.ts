import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TestCaseDoc {
  projectId: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'passed' | 'failed' | 'in_progress' | 'not_started';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** プロジェクト配下のテストケース取得 */
export async function fetchTestCases(projectId: string) {
  const q = query(
    collection(db, 'testCases'), // testCasesコレクションから
    where('projectId', '==', projectId), // プロジェクトIDが一致するテストケースを取得
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/** テストケース作成 */
export async function createTestCase(
  projectId: string,
  data: Omit<TestCaseDoc, 'projectId' | 'createdAt' | 'updatedAt'>,
) {
  return addDoc(collection(db, 'testCases'), {
    projectId,
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}
