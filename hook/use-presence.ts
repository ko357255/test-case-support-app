'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { auth, rtdb, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';

import {
  ref as dbRef, // RTDB参照生成
  onValue, // データ購読
  set, // データ書き込み
  update, // データ更新
  remove, // データ削除
  onDisconnect, // 切断時の処理
} from 'firebase/database';
import type { DatabaseReference } from 'firebase/database';
import type { Presence, UserDoc } from '@/types/firestore';

export const usePresence = (projectId?: string) => {
  // 全ユーザーのPresenceデータを保持する状態
  const [presences, setPresences] = useState<Record<string, Presence>>({});
  // 現在のタブのsessionId
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  // 現在のユーザーID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  // 自身のPresenceデータのDB参照
  const presenceRef = useRef<DatabaseReference | null>(null);
  // Presenceリスト（全ユーザー分）のDB参照
  const listRef = useRef<DatabaseReference | null>(null);
  // Presenceリスト購読解除用
  const listUnsubRef = useRef<(() => void) | null>(null);
  // 現在のsessionId（タブ単位）
  const sessionIdRef = useRef<string | null>(null);
  // 更新待ちのPresenceデータ（throttle用）
  const pendingRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    // projectIdが無い場合は何もしない
    if (!projectId) return;

    // 認証状態監視用の解除関数
    let authUnsub: (() => void) | null = null;

    // 認証ユーザーごとにPresence登録・購読を開始する関数
    const startWithUser = (user: User) => {
      const uid = user.uid;
      let sessionId = sessionIdRef.current;

      // sessionIdがなければ取得
      if (!sessionId) {
        // sessionIdを取得
        const existing = sessionStorage.getItem(
          `presence_session_${projectId}`,
        );
        // もしsessionIdがすでにあるなら、それを使う
        if (existing) sessionId = existing;
        // 無ければsessionIdを生成
        else {
          // ランダムなsessionIdを生成
          sessionId = `${uid}_${Math.random().toString(36).slice(2, 9)}`;
          try {
            // sessionStorageに保存
            sessionStorage.setItem(`presence_session_${projectId}`, sessionId);
          } catch {}
        }
        sessionIdRef.current = sessionId;
        // sessionIdとユーザーIDをセット
        setCurrentSessionId(sessionId);
        setCurrentUserId(uid);
      } else {
        // 既にsessionIdがあれば、それをセット
        setCurrentSessionId(sessionId);
        setCurrentUserId(uid);
      }

      // 自身のPresenceのDB参照を取得
      const pRef = dbRef(rtdb, `presence/${projectId}/${sessionId}`);
      // 参照をセット
      presenceRef.current = pRef;

      // 切断時にPresenceデータを削除する
      try {
        onDisconnect(pRef) // 切断時に発火する
          .remove()
          .catch((err) => console.error('onDisconnect error', err));
      } catch (err) {
        console.error('onDisconnect exception', err);
      }

      // 初期Presenceデータを作成
      const initialPresence: Partial<Presence> = {
        sessionId, // セッションID
        userId: uid, // ユーザーID
        displayName: '', // ユーザー名
        avatarUrl: user.photoURL ?? '', // アバターURL
        // color: undefined, // 色
        isFocused: false, // フォーカスしているかどうか
        lastActive: Date.now(), // 最終アクティブ時刻
      };

      // Firestoreからユーザー名を取得し、Presenceデータにセット
      // IIFE
      (async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          const name = userDoc.exists()
            ? (userDoc.data() as UserDoc).name
            : undefined;
          initialPresence.displayName = name ?? '';
        } catch (err) {
          console.error(
            'presence: failed to fetch user name from users collection',
            err,
          );
        }

        // 初期Presenceデータを書き込み
        set(pRef, initialPresence)
          .then(() =>
            console.log(
              'presence initial set',
              projectId,
              sessionId,
              initialPresence,
            ),
          )
          .catch((err) =>
            console.error('presence initial set error', err, initialPresence),
          );
      })();

      // Presenceリスト（全ユーザー分）のDB参照を作成
      const list = dbRef(rtdb, `presence/${projectId}`);
      listRef.current = list;

      // 古い監視があれば解除
      if (listUnsubRef.current) {
        try {
          listUnsubRef.current();
        } catch {}
        listUnsubRef.current = null;
      }

      // Presenceリストを購読し、状態に反映
      const unsubscribe = onValue(
        list,
        (snap) => {
          // スナップショットから値を取得
          const val = (snap.val() as Record<string, Presence>) ?? {};
          console.log('presence onValue snap', projectId, val);
          // Presenceリストを状態に反映
          setPresences(val);
        },
        (err: unknown) => {
          const code = (err as { code?: string })?.code;
          // 権限エラーはログアウト扱い
          if (code === 'permission_denied' || code === 'PERMISSION_DENIED') {
            console.warn(
              'presence onValue permission denied (likely logged out)',
              err,
            );
            setPresences({});
            return;
          }
          console.error('presence onValue error', err);
        },
      );
      // 購読解除関数を保持
      listUnsubRef.current = unsubscribe;
    };

    // ログイン済みならPresence購読開始
    if (auth.currentUser) startWithUser(auth.currentUser);

    // 認証状態の監視
    authUnsub = onAuthStateChanged(auth, (user) => {
      // ログアウト時の処理
      if (!user) {
        // データを削除
        if (presenceRef.current) remove(presenceRef.current).catch(() => {});
        if (listUnsubRef.current) {
          try {
            listUnsubRef.current();
          } catch {}
          listUnsubRef.current = null;
        }
        // clear local state
        setPresences({});
        sessionIdRef.current = null;
        setCurrentSessionId(null);
        setCurrentUserId(null);
      }
    });

    // アンマウント時のクリーンアップ
    return () => {
      // データを削除
      if (presenceRef.current) remove(presenceRef.current).catch(() => {});
      if (listUnsubRef.current) {
        try {
          listUnsubRef.current();
        } catch {}
        listUnsubRef.current = null;
      }
      if (authUnsub) authUnsub();
    };
  }, [projectId]);

  // Presenceデータの部分更新を1秒ごとにまとめてRTDBへ送信する関数
  const scheduleUpdate = useCallback((payload: Partial<Presence>) => {
    // Presence参照が無ければ何もしない
    if (!presenceRef.current) return;

    // 直近の更新を貯める
    pendingRef.current = { ...(pendingRef.current ?? {}), ...payload };

    // １秒後に実行
    setTimeout(() => {
      // 更新待ちなら何もしない
      if (!pendingRef.current) return;

      // 書き込み対象を作成
      const toWrite: Record<string, unknown> = {
        ...(pendingRef.current as Record<string, unknown>),
      };
      // 最終アクティブ時刻を更新
      toWrite.lastActive = Date.now();
      // undefined を除去
      const cleaned = Object.fromEntries(
        Object.entries(toWrite).filter(([, v]) => v !== undefined),
      );
      // Presenceデータを更新
      update(presenceRef.current as DatabaseReference, cleaned).catch(() => {});
      // 更新待ちをクリア
      pendingRef.current = null;
    }, 1000); // １秒
  }, []);

  // Presenceデータの部分更新用関数
  const setPresence = useCallback(
    (data: Partial<Presence>) => {
      // 更新をスケジュール
      scheduleUpdate(data);
    },
    [scheduleUpdate],
  );

  // 自身のPresenceデータを削除する関数
  const clearPresence = useCallback(() => {
    // Presenceデータを削除
    if (presenceRef.current) remove(presenceRef.current).catch(() => {});
  }, []);

  // フックの返却値
  return {
    presences,
    setPresence,
    clearPresence,
    currentSessionId,
    currentUserId,
  } as const;
};
