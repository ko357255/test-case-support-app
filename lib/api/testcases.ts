'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { TestCaseDoc } from '@/types/firestore';

export async function createTestCase(
  projectId: string,
  data: Omit<TestCaseDoc, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const ref = adminDb
    .collection('projects')
    .doc(projectId)
    .collection('testcases')
    .doc();

  await ref.set({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return ref.id;
}
