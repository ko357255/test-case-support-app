import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TestStepDoc {
  testCaseId: string;
  stepNumber: number;
  action: string;
  expected: string;
  actual?: string;
  status: 'passed' | 'failed' | 'in_progress' | 'not_started';
}

export async function fetchTestSteps(testCaseId: string) {
  const q = query(
    collection(db, 'testSteps'),
    where('testCaseId', '==', testCaseId),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createTestStep(step: TestStepDoc) {
  return addDoc(collection(db, 'testSteps'), step);
}
