import { Trash2, User2 } from 'lucide-react';
import { stepStatusConfig } from '@/config/testcase';
import StepEvidenceList from './StepEvidenceList';
import { EvidenceDoc, EvidenceDTO, TestStepDTO } from '@/types/firestore';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Presence } from '@/types/firestore';

type Props = {
  /** プロジェクトID */
  projectId: string;
  /** テストケースID */
  testCaseId: string;
  /** テストステップ */
  step: TestStepDTO;
  /** 編集モードかどうか */
  isEditing: boolean;
  /** テストステップ変更時のコールバック */
  onChange?: (step: TestStepDTO) => void;
  /** テストステップ削除時のコールバック */
  onDelete?: (id: string) => void;
  /** フォーカスが外れた時のコールバック（自動保存用） */
  onBlur?: () => void;
  setPresence?: (p: Partial<Presence>) => void;
  presenceByField?: Record<string, Presence[]>;
};

export default function TestStepItem({
  projectId,
  testCaseId,
  step,
  isEditing,
  onChange,
  onDelete,
  onBlur,
  setPresence,
  presenceByField,
}: Props) {
  const [evidences, setEvidences] = useState<EvidenceDTO[]>([]);
  const [localStep, setLocalStep] = useState<TestStepDTO>(step);

  useEffect(() => {
    setLocalStep(step);
  }, [step]);

  const handleChange = (field: keyof TestStepDTO, value: unknown) => {
    const next = { ...localStep, [field]: value } as TestStepDTO;
    setLocalStep(next);
  };

  const handleFieldBlur = () => {
    // Only notify parent when there is an actual change
    if (!onChange) {
      onBlur?.();
      return;
    }

    const changed = JSON.stringify(localStep) !== JSON.stringify(step);
    if (changed) {
      onChange(localStep);
    }
    onBlur?.();
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(
        db,
        'projects',
        projectId,
        'testCases',
        testCaseId,
        'testSteps',
        step.id,
        'evidences',
      ),
      (snap) => {
        console.log('onSnapshot: evidence');
        setEvidences(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as EvidenceDoc),
            createdAt: doc.data().createdAt.toMillis(),
          })),
        );
      },
      (err) => {
        if ((err as { code?: string })?.code === 'permission-denied') {
          console.warn('Snapshot listener permission-denied on step evidences');
          return;
        }
        console.error('Snapshot listener error (step evidences):', err);
      },
    );
    return () => unsub();
  }, [projectId, testCaseId, step.id]);

  return (
    <div className="border-border bg-muted/50 rounded-lg border p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* ステップ番号 */}
          <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            {step.stepNumber}
          </div>
          {/* ステップステータス */}
          {step.status && (
            <span
              className={`rounded border px-2 py-1 text-sm ${stepStatusConfig[step.status].color} ${stepStatusConfig[step.status].bgColor} ${stepStatusConfig[step.status].borderColor}`}
            >
              {stepStatusConfig[step.status].label}
            </span>
          )}
        </div>
        {isEditing && (
          <button
            onClick={() => onDelete?.(step.id)}
            className="text-destructive hover:bg-destructive/10 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3">
        {/* 操作 */}
        <div>
          <label className="text-muted-foreground mb-1 block text-sm">
            操作
          </label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={localStep.action}
                onChange={(e) => handleChange('action', e.target.value)}
                onBlur={() => {
                  handleFieldBlur();
                  setPresence?.({
                    testCaseId,
                    fieldId: `step:${step.id}:action`,
                    isFocused: false,
                  });
                }}
                onFocus={() =>
                  setPresence?.({
                    testCaseId,
                    fieldId: `step:${step.id}:action`,
                    isFocused: true,
                  })
                }
                className="border-input bg-background placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              />
              {presenceByField?.[`step:${step.id}:action`]?.length ? (
                <div className="flex -space-x-2">
                  {presenceByField[`step:${step.id}:action`]
                    .slice(0, 3)
                    .map((p) => (
                      <div
                        key={p.sessionId}
                        className="group relative"
                        title={p.displayName}
                      >
                        <div
                          className="border-background h-5 w-5 shrink-0 rounded-full border-2"
                          style={{
                            backgroundColor: p.avatarUrl ? undefined : p.color,
                          }}
                        >
                          {p.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.avatarUrl}
                              alt={p.displayName}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                          ) : (
                            <User2 className="m-auto h-3.5 w-3.5 text-white" />
                          )}
                        </div>
                        <span className="bg-muted/90 text-foreground pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                          {p.displayName}
                        </span>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-foreground text-sm">{step.action}</p>
          )}
        </div>
        {/* 期待結果 */}
        <div>
          <label className="text-muted-foreground mb-1 block text-sm">
            期待結果
          </label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={localStep.expected}
                onChange={(e) => handleChange('expected', e.target.value)}
                onBlur={() => {
                  handleFieldBlur();
                  setPresence?.({
                    testCaseId,
                    fieldId: `step:${step.id}:expected`,
                    isFocused: false,
                  });
                }}
                onFocus={() =>
                  setPresence?.({
                    testCaseId,
                    fieldId: `step:${step.id}:expected`,
                    isFocused: true,
                  })
                }
                className="border-input bg-background placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              />
              {presenceByField?.[`step:${step.id}:expected`]?.length ? (
                <div className="flex -space-x-2">
                  {presenceByField[`step:${step.id}:expected`]
                    .slice(0, 3)
                    .map((p) => (
                      <div
                        key={p.sessionId}
                        className="group relative"
                        title={p.displayName}
                      >
                        <div
                          className="border-background h-5 w-5 shrink-0 rounded-full border-2"
                          style={{
                            backgroundColor: p.avatarUrl ? undefined : p.color,
                          }}
                        >
                          {p.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.avatarUrl}
                              alt={p.displayName}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                          ) : (
                            <User2 className="m-auto h-3.5 w-3.5 text-white" />
                          )}
                        </div>
                        <span className="bg-muted/90 text-foreground pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                          {p.displayName}
                        </span>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-foreground text-sm">{step.expected}</p>
          )}
        </div>
        {/* 実行結果 */}
        <div>
          <label className="text-muted-foreground mb-1 block text-sm">
            実行結果
          </label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={localStep.actual ?? ''}
                onChange={(e) => handleChange('actual', e.target.value)}
                onBlur={() => {
                  handleFieldBlur();
                  setPresence?.({
                    testCaseId,
                    fieldId: `step:${step.id}:actual`,
                    isFocused: false,
                  });
                }}
                onFocus={() =>
                  setPresence?.({
                    testCaseId,
                    fieldId: `step:${step.id}:actual`,
                    isFocused: true,
                  })
                }
                className="border-input bg-background placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              />
              {presenceByField?.[`step:${step.id}:actual`]?.length ? (
                <div className="flex -space-x-2">
                  {presenceByField[`step:${step.id}:actual`]
                    .slice(0, 3)
                    .map((p) => (
                      <div
                        key={p.sessionId}
                        className="group relative"
                        title={p.displayName}
                      >
                        <div
                          className="border-background h-5 w-5 shrink-0 rounded-full border-2"
                          style={{
                            backgroundColor: p.avatarUrl ? undefined : p.color,
                          }}
                        >
                          {p.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.avatarUrl}
                              alt={p.displayName}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                          ) : (
                            <User2 className="m-auto h-3.5 w-3.5 text-white" />
                          )}
                        </div>
                        <span className="bg-muted/90 text-foreground pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                          {p.displayName}
                        </span>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-foreground text-sm">{step.actual}</p>
          )}
        </div>
        {isEditing && (
          <div>
            <label className="text-muted-foreground mb-1 block text-sm">
              ステップステータス
            </label>
            <div className="flex items-center gap-2">
              <select
                value={localStep.status || ''}
                onChange={(e) =>
                  handleChange(
                    'status',
                    e.target.value as TestStepDTO['status'],
                  )
                }
                onBlur={() => {
                  handleFieldBlur();
                  setPresence?.({
                    testCaseId,
                    fieldId: `step:${step.id}:status`,
                    isFocused: false,
                  });
                }}
                onFocus={() =>
                  setPresence?.({
                    testCaseId,
                    fieldId: `step:${step.id}:status`,
                    isFocused: true,
                  })
                }
                className="border-input bg-background flex h-9 rounded-md border px-3 py-2 text-sm focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:outline-none"
              >
                <option value="not_started">未実施</option>
                <option value="in_progress">実施中</option>
                <option value="passed">成功</option>
                <option value="failed">失敗</option>
              </select>

              {presenceByField?.[`step:${step.id}:status`]?.length ? (
                <div className="flex -space-x-2">
                  {presenceByField[`step:${step.id}:status`]
                    .slice(0, 3)
                    .map((p) => (
                      <div
                        key={p.sessionId}
                        className="group relative"
                        title={p.displayName}
                      >
                        <div
                          className="border-background h-5 w-5 shrink-0 rounded-full border-2"
                          style={{
                            backgroundColor: p.avatarUrl ? undefined : p.color,
                          }}
                        >
                          {p.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.avatarUrl}
                              alt={p.displayName}
                              className="h-5 w-5 rounded-full object-cover"
                            />
                          ) : (
                            <User2 className="m-auto h-3.5 w-3.5 text-white" />
                          )}
                        </div>
                        <span className="bg-muted/90 text-foreground pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                          {p.displayName}
                        </span>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* 全体エビデンス */}
      <StepEvidenceList
        evidences={evidences}
        isEditing={isEditing}
        projectId={projectId}
        testCaseId={testCaseId}
        stepId={step.id}
        // onChange={(evidences) => handleChange('evidences', evidences)}
        onBlur={onBlur}
      />
    </div>
  );
}
