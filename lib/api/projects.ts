'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { ProjectDoc } from '@/types/firestore';

export async function createProject(
  data: Pick<ProjectDoc, 'name' | 'description'>,
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const uid = session.user.uid as string;
  const name = data.name.trim();
  const description = data.description.trim();

  if (!name) throw new Error('Project name is required');

  const ref = adminDb.collection('projects').doc();

  await ref.set({
    name,
    description,
    ownerId: uid,
    memberIds: [uid],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return ref.id;
}
