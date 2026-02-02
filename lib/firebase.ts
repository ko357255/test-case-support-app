import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!, // APIキー
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!, // 認証ドメイン
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!, // Realtime Database URL
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!, // プロジェクトID
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!, // ストレージバケット名
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!, // プッシュ通知(FCM)
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!, // アプリID
};

// firebaseの初期化
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app); // Firestore
export const auth = getAuth(app); // 認証
export const storage = getStorage(app); // ストレージ
export const rtdb = getDatabase(app); // Realtime Database
