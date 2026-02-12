import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * エビデンスの更新
 */
export async function updateEvidence(
  projectId: string,
  testCaseId: string,
  evidenceId: string,
  data: Partial<{ name: string; textContent?: string }>,
  stepId?: string,
) {
  const ref = stepId
    ? doc(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'testSteps',
        stepId,
        'evidences',
        evidenceId,
      )
    : doc(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'evidences',
        evidenceId,
      );
  return updateDoc(ref, data);
}

/**
 * エビデンスの削除
 */
export async function deleteEvidence(
  projectId: string,
  testCaseId: string,
  evidenceId: string,
  stepId?: string,
) {
  const ref = stepId
    ? doc(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'testSteps',
        stepId,
        'evidences',
        evidenceId,
      )
    : doc(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'evidences',
        evidenceId,
      );
  return deleteDoc(ref);
}
