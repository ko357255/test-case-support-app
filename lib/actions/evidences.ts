'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
  const path = stepId
    ? `projects/${projectId}/testCases/${testCaseId}/testSteps/${stepId}/evidences/${evidenceId}`
    : `projects/${projectId}/testCases/${testCaseId}/evidences/${evidenceId}`;

  await adminDb.doc(path).update(data);
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
  const path = stepId
    ? `projects/${projectId}/testCases/${testCaseId}/testSteps/${stepId}/evidences/${evidenceId}`
    : `projects/${projectId}/testCases/${testCaseId}/evidences/${evidenceId}`;

  await adminDb.doc(path).delete();
}
