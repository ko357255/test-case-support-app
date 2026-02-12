'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { ProjectDoc } from '@/types/firestore';

/**
 * プロジェクト作成
 */
export async function createProject(
  data: Pick<ProjectDoc, 'name' | 'description'>,
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('ユーザーが認証されていません');

  const uid = session.user.uid as string;
  const name = data.name.trim();
  const description = data.description.trim();

  if (!name) throw new Error('プロジェクト名を入力してください');

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

/**
 * プロジェクト情報の更新
 */
export async function updateProject(
  projectId: string,
  data: Pick<ProjectDoc, 'name' | 'description'>,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) throw new Error('ユーザーが認証されていません');

  const name = data.name.trim();
  const description = data.description.trim();

  if (!name) throw new Error('プロジェクト名を入力してください');

  const projectRef = adminDb.collection('projects').doc(projectId);
  const projectSnap = await projectRef.get();

  if (!projectSnap.exists) throw new Error('プロジェクトが見つかりません');

  const projectData = projectSnap.data() as ProjectDoc;
  if (projectData.ownerId !== session.user.uid) {
    throw new Error('このプロジェクトへのアクセス権限がありません');
  }

  await projectRef.update({
    name,
    description,
    updatedAt: new Date(),
  });
}

/**
 * メンバーをメールアドレスで追加
 */
export async function addProjectMemberByEmail(
  projectId: string,
  email: string,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) throw new Error('ユーザーが認証されていません');

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) throw new Error('メールアドレスを入力してください');

  const projectRef = adminDb.collection('projects').doc(projectId);
  const projectSnap = await projectRef.get();

  if (!projectSnap.exists) throw new Error('プロジェクトが見つかりません');

  const projectData = projectSnap.data() as ProjectDoc;
  if (projectData.ownerId !== session.user.uid) {
    throw new Error('このプロジェクトへのアクセス権限がありません');
  }

  const userSnap = await adminDb
    .collection('users')
    .where('email', '==', normalizedEmail)
    .limit(1)
    .get();

  if (userSnap.empty) throw new Error('該当するユーザーが見つかりません');

  const userId = userSnap.docs[0].id;

  if ((projectData.memberIds || []).includes(userId)) {
    throw new Error('既にメンバーです');
  }

  await projectRef.update({
    memberIds: FieldValue.arrayUnion(userId),
    updatedAt: new Date(),
  });

  return userId;
}

/**
 * メンバーを削除
 */
export async function removeProjectMember(projectId: string, memberId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) throw new Error('ユーザーが認証されていません');

  const projectRef = adminDb.collection('projects').doc(projectId);
  const projectSnap = await projectRef.get();

  if (!projectSnap.exists) throw new Error('プロジェクトが見つかりません');

  const projectData = projectSnap.data() as ProjectDoc;
  if (projectData.ownerId !== session.user.uid) {
    throw new Error('このプロジェクトへのアクセス権限がありません');
  }

  if (memberId === projectData.ownerId) {
    throw new Error('オーナーは削除できません');
  }

  await projectRef.update({
    memberIds: FieldValue.arrayRemove(memberId),
    updatedAt: new Date(),
  });
}
