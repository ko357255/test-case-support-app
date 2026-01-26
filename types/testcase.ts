/**
 * プロジェクト
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * エビデンス
 */
export interface Evidence {
  /** エビデンスID */
  id: string;

  /** エビデンスの表示名 */
  name: string;

  /**
   * エビデンスの種類
   * - screenshot: 画像
   * - document:   PDFやテキストなどの資料
   * - video:      動画など
   */
  type: 'screenshot' | 'document' | 'video';

  /** エビデンスファイルのURL*/
  url: string;

  /** エビデンスのアップロード日時 */
  uploadedAt: string;

  /** 補足情報（任意） */
  note?: string;
}

/**
 * テストケースのステップ
 */
export interface TestStep {
  /** ステップID */
  id: string;

  /** テストケースID */
  testCaseId: string;

  /** ステップ番号 */
  stepNumber: number;

  /** 実施するアクション */
  action: string;

  /** 期待結果 */
  expected: string;

  /** 実際の結果 未実施の場合は undefined */
  actual?: string;

  /**
   * ステップの進捗状況
   * - passed       : 成功
   * - failed       : 失敗
   * - in_progress  : 実施中
   * - not_started  : 未実施
   */
  status?: 'passed' | 'failed' | 'in_progress' | 'not_started';

  /** エビデンスの配列 無い場合は undefined */
  evidences?: Evidence[];
}

/**
 * テストケース
 */
export interface TestCase {
  /** テストケースID */
  id: string;

  /** プロジェクトID */
  projectId: string;

  /** テストケースのタイトル */
  title: string;

  /** 説明 */
  description: string;

  /** カテゴリ */
  category: string;

  /** 優先度（high / medium / low） */
  priority: 'high' | 'medium' | 'low';

  /**
   * テストケース全体の進捗状況
   * - passed       : 成功
   * - failed       : 失敗
   * - in_progress  : 実施中
   * - not_started  : 未実施
   */
  status: 'passed' | 'failed' | 'in_progress' | 'not_started';

  /** テストステップの配列 */
  steps: TestStep[];

  /** テストケース全体のエビデンス */
  evidences: Evidence[];

  /** 作成日時 */
  createdAt: string;

  /** 更新日時 */
  updatedAt: string;

  /**
   * テストケースの分類用グループID (任意)
   */
  groupId?: string;
}
