import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

export async function uploadEvidence(params: {
  file?: File;
  textContent?: string;
  name?: string;
  projectId: string;
  testCaseId: string;
  stepId?: string;
  type: 'screenshot' | 'document' | 'video' | 'text';
}) {
  const { file, textContent, name, projectId, testCaseId, stepId, type } =
    params;

  // 保存先コレクションを決定（stepId がある場合は step のサブコレクションへ）
  const targetCollection = stepId
    ? collection(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'testSteps',
        stepId,
        'evidences',
      )
    : collection(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'evidences',
      );

  // テキスト証拠
  if (type === 'text') {
    if (!textContent)
      throw new Error('textContent is required for text evidence');
    await addDoc(targetCollection, {
      name: name ?? '',
      type,
      textContent,
      createdAt: Timestamp.now(),
    });
    return;
  }

  // ファイルが必要
  if (!file) throw new Error('file is required for non-text evidence');

  const uuid = crypto.randomUUID();
  const storagePath = stepId
    ? `projects/${projectId}/testCases/${testCaseId}/testSteps/${stepId}/evidences/${uuid}`
    : `projects/${projectId}/testCases/${testCaseId}/evidences/${uuid}`;

  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(targetCollection, {
    name: name ?? '',
    type,
    url,
    createdAt: Timestamp.now(),
  });
}
