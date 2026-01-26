'use server';

import {
  mockProjects,
  mockTestCases,
  mockTestSteps,
  mockEvidences,
} from '@/data/mockData';
import {
  ProjectDoc,
  TestCaseDoc,
  TestStepDoc,
  EvidenceDoc,
} from '@/types/firebase';

/* ==========================================================================
  Project 関連
========================================================================== */

/** プロジェクト単体取得 */
export async function getProject(id: string): Promise<ProjectDoc | undefined> {
  return mockProjects.find((p) => p.id === id);
}

/** 自分がメンバーに含まれるプロジェクト一覧を取得 */
export async function getMyProjects(userId: string): Promise<ProjectDoc[]> {
  return mockProjects.filter((p) => p.memberIds.includes(userId));
}

/* ==========================================================================
  TestCase 関連
========================================================================== */

/** テストケース単体取得 */
export async function getTestCase(
  id: string,
): Promise<TestCaseDoc | undefined> {
  return mockTestCases.find((tc) => tc.id === id);
}

/** プロジェクト内の全テストケース取得 */
export async function getTestCases(projectId: string): Promise<TestCaseDoc[]> {
  return mockTestCases.filter((tc) => tc.projectId === projectId);
}

/** 特定のグループに属するテストケース取得 */
export async function getTestCasesByGroup(
  groupId: string,
): Promise<TestCaseDoc[]> {
  return mockTestCases.filter((tc) => tc.groupId === groupId);
}

/* ==========================================================================
  TestStep 関連
========================================================================== */

/** ステップ単体取得 */
export async function getStep(id: string): Promise<TestStepDoc | undefined> {
  return mockTestSteps.find((s) => s.id === id);
}

/** テストケースに紐づくステップ一覧（番号順） */
export async function getSteps(testCaseId: string): Promise<TestStepDoc[]> {
  return mockTestSteps
    .filter((step) => step.testCaseId === testCaseId)
    .sort((a, b) => a.stepNumber - b.stepNumber);
}

/* ==========================================================================
  Evidence 関連
========================================================================== */

/** エビデンス単体取得 */
export async function getEvidence(
  id: string,
): Promise<EvidenceDoc | undefined> {
  return mockEvidences.find((e) => e.id === id);
}

/** テストケース全体に紐づくエビデンス一覧 */
export async function getEvidencesByTestCase(
  testCaseId: string,
): Promise<EvidenceDoc[]> {
  return mockEvidences.filter((ev) => ev.testCaseId === testCaseId);
}

/** 特定のステップに紐づくエビデンス一覧 */
export async function getEvidencesByStep(
  stepId: string,
): Promise<EvidenceDoc[]> {
  return mockEvidences.filter((ev) => ev.stepId === stepId);
}

/** プロジェクト内の全エビデンス一覧（メディアギャラリー用など） */
export async function getEvidencesByProject(
  projectId: string,
): Promise<EvidenceDoc[]> {
  return mockEvidences.filter((ev) => ev.projectId === projectId);
}
