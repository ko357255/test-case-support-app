'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { TestCaseDoc } from '@/types/firestore';

/**
 * テストケース作成
 */
export async function createTestCase(
  projectId: string,
  data: Omit<TestCaseDoc, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const ref = adminDb
    .collection('projects')
    .doc(projectId)
    .collection('testCases')
    .doc();

  await ref.set({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return ref.id;
}

/**
 * テストケースの更新
 */
export async function updateTestCase(
  projectId: string,
  testCaseId: string,
  data: Partial<Omit<TestCaseDoc, 'createdAt' | 'updatedAt' | 'projectId'>>,
) {
  // サーバーセッションからユーザーを取得
  const session = await getServerSession(authOptions);

  if (!session?.user?.uid) {
    throw new Error('ユーザーが認証されていません');
  }

  // プロジェクトの権限チェック（Admin SDKを使用）
  const projectSnap = await adminDb.collection('projects').doc(projectId).get();

  if (!projectSnap.exists) {
    throw new Error('プロジェクトが見つかりません');
  }

  const projectData = projectSnap.data();
  const isOwner = projectData?.ownerId === session.user.uid;
  const isMember = (projectData?.memberIds || []).includes(session.user.uid);

  if (!isOwner && !isMember) {
    throw new Error('このプロジェクトへのアクセス権限がありません');
  }

  // Admin SDK で更新
  const path = `projects/${projectId}/testCases/${testCaseId}`;
  await adminDb.doc(path).update({
    ...data,
    updatedAt: new Date(),
  });
}

/**
 * テストケースの削除
 */
export async function deleteTestCase(projectId: string, testCaseId: string) {
  // サーバーセッションからユーザーを取得
  const session = await getServerSession(authOptions);

  if (!session?.user?.uid) {
    throw new Error('ユーザーが認証されていません');
  }

  // プロジェクトの権限チェック（Admin SDKを使用）
  const projectSnap = await adminDb.collection('projects').doc(projectId).get();

  if (!projectSnap.exists) {
    throw new Error('プロジェクトが見つかりません');
  }

  const projectData = projectSnap.data();
  const isOwner = projectData?.ownerId === session.user.uid;
  const isMember = (projectData?.memberIds || []).includes(session.user.uid);

  if (!isOwner && !isMember) {
    throw new Error('このプロジェクトへのアクセス権限がありません');
  }

  // Admin SDK で削除
  const path = `projects/${projectId}/testCases/${testCaseId}`;
  await adminDb.doc(path).delete();
}
