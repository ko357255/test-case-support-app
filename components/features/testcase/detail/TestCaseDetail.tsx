'use client';

import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import TestCaseHeader from './TestCaseHeader';
import TestCaseStepList from './TestCaseStepList';
import TestCaseEvidenceList from './TestCaseEvidenceList';
import { useMemo } from 'react';
import { Presence } from '@/types/firestore';
import { auth } from '@/lib/firebase';
import {
  EvidenceDoc,
  EvidenceDTO,
  TestCaseDoc,
  TestCaseDTO,
  TestStepDoc,
  TestStepDTO,
} from '@/types/firestore';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateTestCase, deleteTestCase } from '@/lib/firestore/testCases';
import { useRouter } from 'next/navigation';

type Props = {
  projectId: string;
  testCaseId: string;
  presences: Record<string, Presence>;
  setPresence: (data: Partial<Presence>) => void;
  currentSessionId: string | null;
  currentUserId: string | null;
};

export default function TestCaseDetail({
  projectId,
  testCaseId,
  presences,
  setPresence,
  currentSessionId,
  currentUserId,
}: Props) {
  const [testCase, setTestCase] = useState<TestCaseDTO | null>(null);
  const [testSteps, setTestSteps] = useState<TestStepDTO[]>([]);
  const [evidences, setEvidences] = useState<EvidenceDTO[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTestCase, setEditedTestCase] = useState<TestCaseDTO | null>(
    null,
  );

  const router = useRouter();

  // map fieldId => Presence[] for this test case
  const presenceByField = useMemo((): Record<string, Presence[]> => {
    const map: Record<string, Presence[]> = {};
    const myUid = auth.currentUser?.uid ?? currentUserId ?? null;
    Object.values(presences || {}).forEach((p) => {
      if (!p || p.testCaseId !== testCaseId) return;
      if (!p.fieldId) return;
      // ignore own presence
      if (p.sessionId && currentSessionId && p.sessionId === currentSessionId)
        return;
      if (p.userId && myUid && p.userId === myUid) return;
      (map[p.fieldId] = map[p.fieldId] || []).push(p);
    });
    return map;
  }, [presences, currentSessionId, currentUserId, testCaseId]);

  // テストケースの読み込み
  useEffect(() => {
    // テストケースの変更を監視
    const unsub = onSnapshot(
      doc(db, 'projects', projectId, 'testCases', testCaseId), // 監視対象
      // 変更があると、発火する
      (snap) => {
        console.log('onSnapshot: testcase');
        if (snap.exists()) {
          const data = snap.data() as TestCaseDoc;
          // テストケースのデータを再代入
          setTestCase({
            id: snap.id,
            ...data,
            createdAt: data.createdAt.toMillis(),
            updatedAt: data.updatedAt.toMillis(),
          });
        }
      },
      (err) => {
        if ((err as { code?: string })?.code === 'permission-denied') {
          console.warn('Snapshot listener permission-denied on testcase doc');
          return;
        }
        console.error('Snapshot listener error (testcase doc):', err);
      },
    );
    return () => unsub();
  }, [projectId, testCaseId]);

  // テストステップの読み込み
  useEffect(() => {
    const q = query(
      collection(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'testSteps',
      ),
      orderBy('stepNumber'),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        console.log('onSnapshot: testSteps');
        setTestSteps(
          snap.docs.map((doc) => {
            const data = doc.data() as TestStepDoc;
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt.toMillis(),
              updatedAt: data.updatedAt.toMillis(),
            };
          }),
        );
      },
      (err) => {
        if ((err as { code?: string })?.code === 'permission-denied') {
          console.warn('Snapshot listener permission-denied on testSteps');
          return;
        }
        console.error('Snapshot listener error (testSteps):', err);
      },
    );

    return () => unsub();
  }, [projectId, testCaseId]);

  // 全体エビデンスの読み込み
  useEffect(() => {
    const unsub = onSnapshot(
      collection(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'evidences',
      ),
      (snap) => {
        console.log('onSnapshot: all evidences');
        setEvidences(
          snap.docs.map((doc) => {
            const data = doc.data() as EvidenceDoc;
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt.toMillis(),
            };
          }),
        );
      },
      (err) => {
        if ((err as { code?: string })?.code === 'permission-denied') {
          console.warn('Snapshot listener permission-denied on evidences');
          return;
        }
        console.error('Snapshot listener error (evidences):', err);
      },
    );
    return () => unsub();
  }, [projectId, testCaseId]);

  /**
   * 編集内容に差分があるか判定
   */
  const isTestCaseChanged = (
    edited?: TestCaseDTO | null,
    original?: TestCaseDTO | null,
  ) => {
    if (!edited) return false; // 編集がないなら変更なし
    if (!original) return true; // 元がない場合は変更ありとみなす

    const rest1 = { ...edited } as Record<string, unknown>;
    delete rest1.id;
    delete rest1.createdAt;
    delete rest1.updatedAt;

    const rest2 = { ...original } as Record<string, unknown>;
    delete rest2.id;
    delete rest2.createdAt;
    delete rest2.updatedAt;

    return JSON.stringify(rest1) !== JSON.stringify(rest2);
  };

  /**
   * モード切替処理
   */
  const handleModeChange = async (nextIsEditing: boolean) => {
    if (nextIsEditing) {
      // 編集モードへ: 現在の testCase をコピー
      if (testCase) {
        setEditedTestCase(testCase);
        setIsEditing(true);
      }
    } else {
      // 閲覧モードへ: 保存処理を実行して終了
      if (editedTestCase && isTestCaseChanged(editedTestCase, testCase)) {
        try {
          const { id, ...rest } = editedTestCase;
          const data = rest as Partial<Omit<TestCaseDTO, 'id'>>;
          delete data.createdAt;
          delete data.updatedAt;
          await updateTestCase(projectId, id, data);
        } catch (e) {
          console.error('Failed to update test case', e);
          alert('テストケースの保存に失敗しました。');
        }
      }
      setIsEditing(false);
      setEditedTestCase(null);
    }
  };

  /**
   * 自動保存用ハンドラ (onBlur等で呼び出し)
   */
  const handleAutoSave = async () => {
    if (!editedTestCase || !testCase) return;
    if (!isTestCaseChanged(editedTestCase, testCase)) return;

    try {
      const { id, ...rest } = editedTestCase;
      const data = rest as Partial<Omit<TestCaseDTO, 'id'>>;
      delete data.createdAt;
      delete data.updatedAt;
      await updateTestCase(projectId, id, data);
    } catch (e) {
      console.error('Failed to autosave test case', e);
    }
  };

  /**
   * 削除処理
   */
  const handleDelete = async () => {
    if (!testCase) return;
    if (window.confirm('このテストケースを削除してもよろしいですか？')) {
      try {
        await deleteTestCase(projectId, testCase.id);
        // navigate back to project page
        router.push(`/projects/${projectId}`);
      } catch (e) {
        console.error('Failed to delete test case', e);
        alert('テストケースの削除に失敗しました。');
      }
    }
  };

  /**
   * 親の testCase が切り替わったときの処理
   * 編集中なら自動で編集モードをオフにしてローカルコピーを破棄
   */
  useEffect(() => {
    if (isEditing) {
      setIsEditing(false);
      setEditedTestCase(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCase?.id]);

  if (!testCase) return <p>読み込み中...</p>;

  return (
    <div className="p-8">
      <div className="pointer-events-none sticky top-8 z-10 mb-4 flex justify-end gap-2">
        <div className="border-border bg-background pointer-events-auto flex items-center rounded-lg border p-1 shadow-sm">
          <button
            onClick={() => handleModeChange(false)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              !isEditing
                ? 'bg-muted text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>閲覧</span>
          </button>
          <button
            onClick={() => handleModeChange(true)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              isEditing
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit2 className="h-4 w-4" />
            <span>編集</span>
          </button>
        </div>
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        {/* テストケースのヘッダー */}
        <TestCaseHeader
          isEditing={isEditing}
          editedTestCase={isEditing ? (editedTestCase ?? testCase) : testCase}
          setTestCase={setEditedTestCase}
          onBlur={handleAutoSave}
          actions={
            !isEditing ? (
              <button
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive/10 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                title="テストケースを削除"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">削除</span>
              </button>
            ) : undefined
          }
          // presence props
          setPresence={setPresence}
          presenceByField={presenceByField}
          testCaseId={testCaseId}
        />

        {/* テストステップ一覧 */}
        <TestCaseStepList
          projectId={projectId}
          testCaseId={testCaseId}
          isEditing={isEditing}
          steps={testSteps}
          onBlur={handleAutoSave} // presence props
          setPresence={setPresence}
          presenceByField={presenceByField}
        />

        {/* エビデンス一覧 */}
        <TestCaseEvidenceList
          isEditing={isEditing}
          evidences={evidences}
          projectId={projectId}
          testCaseId={testCaseId}
          onChange={(evidences) =>
            setEditedTestCase((prev) => (prev ? { ...prev, evidences } : prev))
          }
          onBlur={handleAutoSave}
        />
      </div>
    </div>
  );
}
