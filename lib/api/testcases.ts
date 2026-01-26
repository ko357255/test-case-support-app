'use server';

import { mockData } from '@/data/mock-data';
import {
  NestedProject,
  NestedTestCase,
  NestedTestStep,
  NestedEvidence,
} from '@/types/testcase'; // パスは適宜調整してください

/**
 * モックデータを取得（NestedProject[] 型として扱う）
 */
const getProjects = (): NestedProject[] => mockData as NestedProject[];

/* ==========================================================================
  API関数
========================================================================== */

export async function getProject(
  id: string,
): Promise<NestedProject | undefined> {
  return getProjects().find((p) => p.id === id);
}

export async function getMyProjects(userId: string): Promise<NestedProject[]> {
  return getProjects().filter((p) => p.memberIds.includes(userId));
}

export async function getTestCase(
  id: string,
): Promise<NestedTestCase | undefined> {
  for (const project of getProjects()) {
    const target = project.testCases.find((tc) => tc.id === id);
    if (target) return target;
  }
  return undefined;
}

export async function getTestCases(
  projectId: string,
): Promise<NestedTestCase[]> {
  const p = await getProject(projectId);
  return p ? p.testCases : [];
}

export async function getTestCasesByGroup(
  groupId: string,
): Promise<NestedTestCase[]> {
  return getProjects().flatMap((p) =>
    p.testCases.filter((tc) => tc.groupId === groupId),
  );
}

export async function getStep(id: string): Promise<NestedTestStep | undefined> {
  for (const project of getProjects()) {
    for (const tc of project.testCases) {
      const step = tc.steps.find((s) => s.id === id);
      if (step) return step;
    }
  }
  return undefined;
}

export async function getSteps(testCaseId: string): Promise<NestedTestStep[]> {
  const tc = await getTestCase(testCaseId);
  return tc ? tc.steps : [];
}

export async function getEvidence(
  id: string,
): Promise<NestedEvidence | undefined> {
  for (const project of getProjects()) {
    for (const tc of project.testCases) {
      // ステップ内のエビデンスを検索
      const fromStep = tc.steps
        .flatMap((s) => s.evidences)
        .find((e) => e.id === id);
      if (fromStep) return fromStep;
      // ケース直下のエビデンスを検索
      const fromCase = tc.evidences.find((e) => e.id === id);
      if (fromCase) return fromCase;
    }
  }
  return undefined;
}

export async function getEvidencesByTestCase(
  testCaseId: string,
): Promise<NestedEvidence[]> {
  const tc = await getTestCase(testCaseId);
  if (!tc) return [];
  return [...tc.evidences, ...tc.steps.flatMap((s) => s.evidences)];
}

export async function getEvidencesByStep(
  stepId: string,
): Promise<NestedEvidence[]> {
  const s = await getStep(stepId);
  return s ? s.evidences : [];
}

export async function getEvidencesByProject(
  projectId: string,
): Promise<NestedEvidence[]> {
  const p = await getProject(projectId);
  if (!p) return [];
  return p.testCases.flatMap((tc) => [
    ...tc.evidences,
    ...tc.steps.flatMap((s) => s.evidences),
  ]);
}
