'use client';

import {
  evidenceTypeConfig,
  statusConfig,
  stepStatusConfig,
} from '@/config/testcase';
import { TestCase } from '@/types/testcase';
import {
  ArrowLeft,
  Edit2,
  Paperclip,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  testCase: TestCase;
};

export default function TestCaseDetail({ testCase }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTestCase, settestCase] = useState(testCase);

  const StatusIcon = statusConfig[editedTestCase.status].icon;

  const router = useRouter();
  return (
    <div className="p-8">
      <div className="mb-6">
        <button
          onClick={router.back}
          className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          テストケース一覧に戻る
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-8 py-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTestCase.title}
                  onChange={(e) =>
                    settestCase({ ...editedTestCase, title: e.target.value })
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 text-2xl text-gray-900"
                />
              ) : (
                <h2 className="text-2xl text-gray-900">
                  {editedTestCase.title}
                </h2>
              )}
            </div>
            <div className="ml-4 flex gap-2">
              {isEditing ? (
                <>
                  <button
                    // onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    保存
                  </button>
                  <button
                    onClick={() => {
                      settestCase(editedTestCase);
                      setIsEditing(false);
                    }}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    キャンセル
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <Edit2 className="h-4 w-4" />
                  編集
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={editedTestCase.description}
              onChange={(e) =>
                settestCase({ ...editedTestCase, description: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-600"
              rows={2}
            />
          ) : (
            <p className="text-gray-600">{editedTestCase.description}</p>
          )}

          <div className="mt-4 flex gap-4">
            <div className="flex">
              <span className="text-gray-500">ステータス:</span>
              {isEditing ? (
                <select
                  value={editedTestCase.status}
                  onChange={(e) =>
                    settestCase({
                      ...editedTestCase,
                      status: e.target.value as TestCase['status'],
                    })
                  }
                  className="ml-2 rounded border border-gray-300 px-2 py-1"
                >
                  <option value="not_started">未実施</option>
                  <option value="in_progress">実施中</option>
                  <option value="passed">成功</option>
                  <option value="failed">失敗</option>
                </select>
              ) : (
                <span
                  className={`ml-2 inline-flex items-center gap-1 ${statusConfig[editedTestCase.status].color}`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {statusConfig[editedTestCase.status].label}
                </span>
              )}
            </div>
            <div className="flex">
              <span className="text-gray-500">カテゴリ:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTestCase.category}
                  onChange={(e) =>
                    settestCase({ ...editedTestCase, category: e.target.value })
                  }
                  className="ml-2 w-32 rounded border border-gray-300 px-2 py-1 text-sm"
                />
              ) : (
                <span className="ml-2 text-gray-900">
                  {editedTestCase.category}
                </span>
              )}
            </div>
            <div className="flex">
              <span className="text-gray-500">優先度:</span>
              {isEditing ? (
                <select
                  value={editedTestCase.priority}
                  onChange={(e) =>
                    settestCase({
                      ...editedTestCase,
                      priority: e.target.value as TestCase['priority'],
                    })
                  }
                  className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              ) : (
                <span className="ml-2 text-gray-900">
                  {editedTestCase.priority === 'high'
                    ? '高'
                    : editedTestCase.priority === 'medium'
                      ? '中'
                      : '低'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Test Steps */}
        <div className="border-b border-gray-200 px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg text-gray-900">テストステップ</h3>
            {isEditing && (
              <button
                // onClick={handleAddStep}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                ステップ追加
              </button>
            )}
          </div>

          <div className="space-y-4">
            {editedTestCase.steps.map((step) => (
              <div
                key={step.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      {step.stepNumber}
                    </div>
                    {step.status && (
                      <span
                        className={`rounded px-2 py-1 text-xs text-white ${
                          stepStatusConfig[step.status].color
                        }`}
                      >
                        {stepStatusConfig[step.status].label}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      // onClick={() => handleDeleteStep(step.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mb-3 grid grid-cols-1 gap-3">
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">
                      操作
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={step.action}
                        // onChange={(e) =>
                        //   handleUpdateStep(step.id, 'action', e.target.value)
                        // }
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        placeholder="実行する操作を入力"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{step.action}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">
                      期待結果
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={step.expected}
                        // onChange={(e) =>
                        //   handleUpdateStep(step.id, 'expected', e.target.value)
                        // }
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        placeholder="期待される結果を入力"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{step.expected}</p>
                    )}
                  </div>
                  {step.actual && (
                    <div>
                      <label className="mb-1 block text-sm text-gray-700">
                        実行結果
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={step.actual}
                          // onChange={(e) =>
                          //   handleUpdateStep(step.id, 'actual', e.target.value)
                          // }
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                          placeholder="実際の結果を入力"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{step.actual}</p>
                      )}
                    </div>
                  )}
                  {isEditing && (
                    <div>
                      <label className="mb-1 block text-sm text-gray-700">
                        ステップステータス
                      </label>
                      <select
                        value={step.status || ''}
                        // onChange={(e) =>
                        //   handleUpdateStep(
                        //     step.id,
                        //     'status',
                        //     e.target.value as 'passed' | 'failed' | 'skipped',
                        //   )
                        // }
                        className="rounded border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">未設定</option>
                        <option value="passed">成功</option>
                        <option value="failed">失敗</option>
                        <option value="skipped">スキップ</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Step Evidences */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        エビデンス ({step.evidences?.length || 0})
                      </span>
                    </div>
                    {isEditing && (
                      <button
                        // onClick={() => handleAddStepEvidence(step.id)}
                        className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-300"
                      >
                        <Upload className="h-3 w-3" />
                        追加
                      </button>
                    )}
                  </div>

                  {step.evidences && step.evidences.length > 0 ? (
                    <div className="space-y-2">
                      {step.evidences.map((evidence) => {
                        const EvidenceIcon =
                          evidenceTypeConfig[evidence.type].icon;
                        return (
                          <div
                            key={evidence.id}
                            className="rounded border border-gray-200 bg-white p-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex flex-1 items-start gap-2">
                                <EvidenceIcon
                                  className={`mt-0.5 h-4 w-4 shrink-0 ${evidenceTypeConfig[evidence.type].color}`}
                                />
                                <div className="min-w-0 flex-1">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={evidence.name}
                                      // onChange={(e) =>
                                      //   handleUpdateStepEvidence(
                                      //     step.id,
                                      //     evidence.id,
                                      //     'name',
                                      //     e.target.value,
                                      //   )
                                      // }
                                      className="mb-1 w-full rounded border border-gray-300 px-2 py-1 text-sm text-gray-900"
                                    />
                                  ) : (
                                    <div className="mb-1 text-sm text-gray-900">
                                      {evidence.name}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500">
                                    {new Date(
                                      evidence.uploadedAt,
                                    ).toLocaleString('ja-JP')}
                                  </div>
                                  {evidence.note && (
                                    <div className="mt-1 text-xs text-gray-600">
                                      {evidence.note}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {isEditing && (
                                <button
                                  // onClick={() =>
                                  //   handleDeleteStepEvidence(
                                  //     step.id,
                                  //     evidence.id,
                                  //   )
                                  // }
                                  className="ml-2 shrink-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-3 text-center text-sm text-gray-400">
                      エビデンスなし
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Test Case Evidences */}
        <div className="px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg text-gray-900">全体エビデンス</h3>
            {isEditing && (
              <button
                // onClick={handleAddEvidence}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white transition-colors hover:bg-blue-700"
              >
                <Upload className="h-4 w-4" />
                エビデンス追加
              </button>
            )}
          </div>

          {editedTestCase.evidences.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              全体エビデンスがありません
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {editedTestCase.evidences.map((evidence) => {
                const EvidenceIcon = evidenceTypeConfig[evidence.type].icon;
                return (
                  <div
                    key={evidence.id}
                    className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <EvidenceIcon
                          className={`h-5 w-5 ${evidenceTypeConfig[evidence.type].color}`}
                        />
                        <span className="text-sm text-gray-900">
                          {evidence.name}
                        </span>
                      </div>
                      {isEditing && (
                        <button
                          // onClick={() => handleDeleteEvidence(evidence.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="mb-2 text-xs text-gray-500">
                      {new Date(evidence.uploadedAt).toLocaleString('ja-JP')}
                    </div>
                    {evidence.note && (
                      <p className="mt-2 text-sm text-gray-600">
                        {evidence.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
