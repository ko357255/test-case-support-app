import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Update an evidence document under either testCase or testStep
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
