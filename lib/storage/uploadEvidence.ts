import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

export async function uploadEvidence(params: {
  file: File;
  projectId: string;
  testCaseId: string;
  stepId?: string;
  type: 'screenshot' | 'document' | 'video';
  note?: string;
}) {
  const { file, projectId, testCaseId, stepId, type, note } = params;

  const storageRef = ref(
    storage,
    `projects/${projectId}/testCases/${testCaseId}/evidences/${crypto.randomUUID()}`,
  );

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'evidences'), {
    projectId,
    testCaseId,
    stepId,
    type,
    url,
    note,
    uploadedAt: Timestamp.now(),
  });
}
