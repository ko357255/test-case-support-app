'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { auth, rtdb } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  ref as dbRef,
  onValue,
  set,
  remove,
  onDisconnect,
} from 'firebase/database';
import type { DatabaseReference } from 'firebase/database';
import type { Presence } from '@/types/firestore';

/**
 * usePresence
 * - projectId: Realtime DB の presence 配下を購読/更新する
 * - presences: { [sessionId]: Presence }
 * - setPresence: 部分更新（内部で throttle）
 * - clearPresence: 自クライアントの presence を削除
 */
export const usePresence = (projectId?: string) => {
  const [presences, setPresences] = useState<Record<string, Presence>>({});
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const presenceRef = useRef<DatabaseReference | null>(null);
  const listRef = useRef<DatabaseReference | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const pendingRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!projectId) return;

    let authUnsub: (() => void) | null = null;

    const startWithUser = (user: User) => {
      const uid = user.uid;

      // sessionId はタブ単位で保持（プロジェクトごと）
      let sessionId = sessionIdRef.current;
      if (!sessionId) {
        const existing = sessionStorage.getItem(
          `presence_session_${projectId}`,
        );
        if (existing) sessionId = existing;
        else {
          sessionId = `${uid}_${Math.random().toString(36).slice(2, 9)}`;
          try {
            sessionStorage.setItem(`presence_session_${projectId}`, sessionId);
          } catch {}
        }
        sessionIdRef.current = sessionId;
        // expose current session id and user id
        setCurrentSessionId(sessionId);
        setCurrentUserId(uid);
      } else {
        // ensure state is set if sessionId already existed
        setCurrentSessionId(sessionId);
        setCurrentUserId(uid);
      }

      const pRef = dbRef(rtdb, `presence/${projectId}/${sessionId}`);
      presenceRef.current = pRef;

      // onDisconnect で確実に削除
      try {
        onDisconnect(pRef)
          .remove()
          .catch((err) => console.error('onDisconnect error', err));
      } catch (err) {
        console.error('onDisconnect exception', err);
      }

      // 初期情報を書き込む
      const initialPayload: Partial<Presence> = {
        sessionId,
        userId: uid,
        displayName: user.displayName ?? '',
        avatarUrl: user.photoURL ?? '',
        color: undefined,
        isFocused: false,
        lastActive: Date.now(),
      };
      // Realtime DB は undefined プロパティを受け付けないため除去する
      const cleanedInitial = Object.fromEntries(
        Object.entries(initialPayload).filter(([, v]) => v !== undefined),
      );
      set(pRef, cleanedInitial)
        .then(() =>
          console.log(
            'presence initial set',
            projectId,
            sessionId,
            cleanedInitial,
          ),
        )
        .catch((err) =>
          console.error('presence initial set error', err, cleanedInitial),
        );

      // presence リストを購読
      const list = dbRef(rtdb, `presence/${projectId}`);
      listRef.current = list;
      onValue(
        list,
        (snap) => {
          const val = snap.val() || {};
          console.log('presence onValue snap', projectId, val);
          setPresences(val);
        },
        (err) => console.error('presence onValue error', err),
      );
    };

    if (auth.currentUser) startWithUser(auth.currentUser);
    authUnsub = onAuthStateChanged(auth, (u) => {
      if (u) startWithUser(u);
    });

    return () => {
      // unmount: remove own presence
      if (presenceRef.current) remove(presenceRef.current).catch(() => {});
      if (authUnsub) authUnsub();
      // Note: onValue subscription will be cleaned by firebase when the component unmounts
    };
  }, [projectId]);

  // throttle-like batching of updates: 最後の更新を1s後にまとめて反映
  const scheduleUpdate = useCallback((payload: Partial<Presence>) => {
    if (!presenceRef.current) return;

    pendingRef.current = { ...(pendingRef.current ?? {}), ...payload };

    // schedule flush
    setTimeout(() => {
      if (!pendingRef.current) return;
      const toWrite: Record<string, unknown> = {
        ...(pendingRef.current as Record<string, unknown>),
      };
      // ensure lastActive
      toWrite.lastActive = Date.now();
      // RTDB は undefined を含む値を拒否するので除去する
      const cleaned = Object.fromEntries(
        Object.entries(toWrite).filter(([, v]) => v !== undefined),
      );
      set(presenceRef.current as DatabaseReference, cleaned).catch(() => {});
      pendingRef.current = null;
    }, 1000);
  }, []);

  const setPresence = useCallback(
    (data: Partial<Presence>) => {
      scheduleUpdate(data);
    },
    [scheduleUpdate],
  );

  const clearPresence = useCallback(() => {
    if (presenceRef.current) remove(presenceRef.current).catch(() => {});
  }, []);

  return {
    presences,
    setPresence,
    clearPresence,
    currentSessionId,
    currentUserId,
  } as const;
};
