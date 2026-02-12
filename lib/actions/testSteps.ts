'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { TestStepDoc } from '@/types/firestore';

/**
 * テストステップの更新
 */
export async function updateTestStep(
  projectId: string,
  testCaseId: string,
  stepId: string,
  data: Partial<Omit<TestStepDoc, 'createdAt' | 'updatedAt' | 'testCaseId'>>,
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
  const path = `projects/${projectId}/testCases/${testCaseId}/testSteps/${stepId}`;
  await adminDb.doc(path).update({
    ...data,
    updatedAt: new Date(),
  });
}

/**
 * テストステップの削除
 */
export async function deleteTestStep(
  projectId: string,
  testCaseId: string,
  stepId: string,
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

  // Admin SDK で削除
  const path = `projects/${projectId}/testCases/${testCaseId}/testSteps/${stepId}`;
  await adminDb.doc(path).delete();
}
