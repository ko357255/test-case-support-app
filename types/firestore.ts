import { Timestamp } from 'firebase/firestore';

/**
 * プロジェクト
 * /projects/[projectId]
 */
export interface ProjectDoc {
  /** プロジェクト名 */
  name: string;
  /** プロジェクト概要 */
  description: string;
  /** 作成者（オーナー）のユーザーID */
  ownerId: string;
  /** 閲覧・編集権限を持つユーザーIDの配列 */
  memberIds: string[];
  /** プロジェクト作成日時 */
  createdAt: Timestamp;
  /** プロジェクト情報更新日時 */
  updatedAt: Timestamp;
}

/**
 * テストケース
 * /projects/[projectId]/testCases/[testCaseId]
 */
export interface TestCaseDoc {
  /** テストケース名 */
  title: string;
  /** テストの目的や前提条件 */
  description: string;
  /** 機能分類（例: 認証、決済、検索など） */
  category: string;
  /** 優先度 */
  priority: 'high' | 'medium' | 'low';
  /** テスト実施ステータス */
  status: 'passed' | 'failed' | 'in_progress' | 'not_started';
  /** 関連するグループのID（任意） */
  groupId?: string;
  /** 作成日時 */
  createdAt: Timestamp;
  /** ステータスや内容の最終更新日時 */
  updatedAt: Timestamp;
}

/**
 * テストステップ
 * /projects/[projectId]/testCases/[testCaseId]/testSteps/[testStepId]
 */
export interface TestStepDoc {
  /** 手順の実行順序（1始まり） */
  stepNumber: number;
  /** 操作内容 */
  action: string;
  /** 期待される結果 */
  expected: string;
  /** 実際の実行結果（実行時に記入） */
  actual: string;
  /** ステップごとの合否ステータス */
  status?: 'passed' | 'failed' | 'in_progress' | 'not_started';
  /** 作成日時 */
  createdAt: Timestamp;
  /** 実行結果の最終更新日時 */
  updatedAt: Timestamp;
}

/**
 * エビデンス
 * テストケース全体エビデンス /projects/[projectId]/testCases/[testCaseId]/evidences/[evidenceId]
 * テストステップのエビデンス /projects/[projectId]/testCases/[testCaseId]/testSteps/[testStepId]/evidences/[evidenceId]
 */
export interface EvidenceDoc {
  /** エビデンスの名称（例: エラー画面、疎通ログなど） */
  name: string;
  /** エビデンスの形式 */
  type: 'screenshot' | 'document' | 'video' | 'text';
  /** ファイルの保存先URL（screenshot, document, videoの場合に使用） */
  url?: string;
  /** テキストデータ本体（type: 'text' の場合に使用。ログ出力やメモを想定） */
  textContent?: string;
  /** エビデンスの記録（アップロード）日時 */
  createdAt: Timestamp;
}

/**
 * ユーザー
 * /users/[uid]
 */
export interface UserDoc {
  /** ユーザー名 */
  name: string;
  /** 作成日時 */
  createdAt: Timestamp;
  /** ユーザー情報更新日時 */
  updatedAt: Timestamp;
}

/**
 * presence (Realtime Database)
 * path: /presence/{projectId}/{sessionId}
 */
export interface Presence {
  sessionId: string;
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  color?: string;
  testCaseId?: string;
  fieldId?: string;
  isFocused?: boolean;
  lastActive?: number; // epoch ms
}

export type PresenceDTO = Presence & { id: string };

export type ProjectDTO = Omit<ProjectDoc, 'createdAt' | 'updatedAt'> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export type TestCaseDTO = Omit<TestCaseDoc, 'createdAt' | 'updatedAt'> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export type TestStepDTO = Omit<TestStepDoc, 'createdAt' | 'updatedAt'> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export type EvidenceDTO = Omit<EvidenceDoc, 'createdAt'> & {
  id: string;
  createdAt: number;
};

export type UserDTO = Omit<UserDoc, 'createdAt' | 'updatedAt'> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export interface ProjectWithTestCasesDTO extends ProjectDTO {
  testCases: TestCaseDTO[];
}

export interface TestCaseWithStepsAndEvidencesDTO extends TestCaseDTO {
  steps: TestStepWithEvidencesDTO[];
  evidences: EvidenceDTO[];
}

export interface TestStepWithEvidencesDTO extends TestStepDTO {
  evidences: EvidenceDTO[];
}
