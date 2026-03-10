'use server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { DEFAULT_AVATAR_URL } from '@/config/user';

/**
 * ユーザー登録
 * Firebase Authで作成されたユーザーをFirestoreに登録する
 */
export async function registerUser(idToken: string, displayName: string) {
  try {
    // idTokenを検証してユーザー情報を取得
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    if (!email) {
      throw new Error('Email not found in token');
    }

    // Firestoreにユーザー情報を保存
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.set(
      {
        displayName: displayName.trim() || 'ユーザー',
        email: email.toLowerCase().trim(),
        avatarUrl: DEFAULT_AVATAR_URL,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true },
    );

    return { success: true, uid };
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to register user',
    );
  }
}
