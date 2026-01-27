import { NestedProject } from '@/types/testcase'; // パスは適宜調整してください

export const mockData: NestedProject[] = [
  {
    // ==========================================
    // プロジェクト: proj-001
    // ==========================================
    id: 'proj-001',
    name: '次世代Eコマースプラットフォーム開発',
    description: '主要機能の品質保証テストプロジェクト',
    ownerId: 'user-admin-01',
    memberIds: ['user-admin-01', 'user-qa-01', 'user-dev-01'],
    createdAt: new Date('2025-11-01T09:00:00'),
    updatedAt: new Date('2025-12-04T15:00:00'),

    testCases: [
      {
        // ------------------------------------------
        // テストケース 1: tc-1 (ログイン正常)
        // ------------------------------------------
        id: 'tc-1',
        title: 'ログイン機能の正常系テスト',
        description:
          '正しいメールアドレスとパスワードでログインできることを確認する',
        category: '認証',
        priority: 'high',
        status: 'passed',
        groupId: 'group1',
        createdAt: new Date('2025-12-01T09:00:00'),
        updatedAt: new Date('2025-12-04T10:30:00'),
        steps: [
          {
            id: 's1',
            stepNumber: 1,
            action: 'ログインページにアクセス',
            expected: 'ログインフォームが表示される',
            actual: 'ログインフォームが正常に表示された',
            status: 'passed',
            createdAt: new Date('2025-12-04T10:00:00'),
            updatedAt: new Date('2025-12-04T10:00:00'),
            evidences: [
              {
                id: 'e1',
                name: 'ログイン画面初期表示',
                type: 'screenshot',
                url: '/placeholder-screenshot.png',
                note: 'ログインフォームの表示確認',
                createdAt: new Date('2025-12-04T10:30:00'),
                updatedAt: new Date('2025-12-04T10:30:00'),
              },
            ],
          },
          {
            id: 's2',
            stepNumber: 2,
            action: '有効なメールアドレスとパスワードを入力',
            expected: 'エラーなく入力できる',
            actual: '正常に入力できた',
            status: 'passed',
            createdAt: new Date('2025-12-04T10:05:00'),
            updatedAt: new Date('2025-12-04T10:05:00'),
            evidences: [],
          },
          {
            id: 's3',
            stepNumber: 3,
            action: 'ログインボタンをクリック',
            expected: 'ダッシュボードにリダイレクトされる',
            actual: 'ダッシュボードに遷移した',
            status: 'passed',
            createdAt: new Date('2025-12-04T10:10:00'),
            updatedAt: new Date('2025-12-04T10:10:00'),
            evidences: [
              {
                id: 'e1-2',
                name: 'ダッシュボード遷移後',
                type: 'screenshot',
                url: '/placeholder-screenshot.png',
                note: 'ログイン成功後の画面',
                createdAt: new Date('2025-12-04T10:31:00'),
                updatedAt: new Date('2025-12-04T10:31:00'),
              },
            ],
          },
        ],
        evidences: [],
      },
      {
        // ------------------------------------------
        // テストケース 2: tc-2 (ログイン異常)
        // ------------------------------------------
        id: 'tc-2',
        title: 'ログイン機能の異常系テスト - 無効なパスワード',
        description:
          '無効なパスワードでログインした場合、適切なエラーメッセージが表示されることを確認',
        category: '認証',
        priority: 'high',
        status: 'failed',
        groupId: 'group1',
        createdAt: new Date('2025-12-01T09:15:00'),
        updatedAt: new Date('2025-12-04T11:00:00'),
        steps: [
          {
            id: 's4',
            stepNumber: 1,
            action: '有効なメールアドレスと無効なパスワードを入力',
            expected: 'エラーなく入力できる',
            actual: '正常に入力できた',
            status: 'passed',
            createdAt: new Date('2025-12-04T10:45:00'),
            updatedAt: new Date('2025-12-04T10:45:00'),
            evidences: [],
          },
          {
            id: 's5',
            stepNumber: 2,
            action: 'ログインボタンをクリック',
            expected:
              'エラーメッセージ「パスワードが正しくありません」が表示される',
            actual: 'エラーメッセージが表示されなかった',
            status: 'failed',
            createdAt: new Date('2025-12-04T11:00:00'),
            updatedAt: new Date('2025-12-04T11:00:00'),
            evidences: [],
          },
        ],
        evidences: [],
      },
      {
        // ------------------------------------------
        // テストケース 3: tc-3 (ユーザー登録)
        // ------------------------------------------
        id: 'tc-3',
        title: 'ユーザー登録機能テスト',
        description: '新規ユーザーが登録できることを確認する',
        category: '認証',
        priority: 'medium',
        status: 'in_progress',
        groupId: 'group2',
        createdAt: new Date('2025-12-02T14:00:00'),
        updatedAt: new Date('2025-12-04T09:00:00'),
        steps: [
          {
            id: 's6',
            stepNumber: 1,
            action: '登録ページにアクセス',
            expected: '登録フォームが表示される',
            actual: '',
            status: 'in_progress',
            createdAt: new Date('2025-12-04T09:00:00'),
            updatedAt: new Date('2025-12-04T09:00:00'),
            evidences: [],
          },
        ],
        evidences: [],
      },
      {
        // ------------------------------------------
        // テストケース 4: tc-4 (商品検索)
        // ------------------------------------------
        id: 'tc-4',
        title: '商品検索機能テスト',
        description: 'キーワードで商品を検索できることを確認する',
        category: '検索',
        priority: 'low',
        status: 'not_started',
        groupId: 'group2',
        createdAt: new Date('2025-12-03T10:00:00'),
        updatedAt: new Date('2025-12-03T10:00:00'),
        steps: [],
        evidences: [],
      },
      {
        // ------------------------------------------
        // テストケース 5: tc-5 (決済正常)
        // ------------------------------------------
        id: 'tc-5',
        title: '決済機能の正常系テスト',
        description: 'クレジットカードで決済できることを確認する',
        category: '決済',
        priority: 'high',
        status: 'passed',
        groupId: 'group1',
        createdAt: new Date('2025-12-02T11:00:00'),
        updatedAt: new Date('2025-12-04T14:00:00'),
        steps: [
          {
            id: 's11',
            stepNumber: 1,
            action: 'カート画面で決済ボタンをクリック',
            expected: '決済画面に遷移する',
            actual: '決済画面が表示された',
            status: 'passed',
            createdAt: new Date('2025-12-04T13:45:00'),
            updatedAt: new Date('2025-12-04T13:45:00'),
            evidences: [
              {
                id: 'e2',
                name: '決済完了通知',
                type: 'screenshot',
                url: '/placeholder-screenshot.png',
                note: '決済完了メッセージの表示確認',
                createdAt: new Date('2025-12-04T14:00:00'),
                updatedAt: new Date('2025-12-04T14:00:00'),
              },
            ],
          },
        ],
        evidences: [],
      },
    ],
  },
  // ==========================================
  // プロジェクト: proj-002
  // ==========================================
  {
    id: 'proj-002',
    name: '社内勤怠管理システム',
    description: '勤怠打刻・申請機能のテスト',
    ownerId: 'user-admin-01',
    memberIds: ['user-admin-01'],
    createdAt: new Date('2025-10-10T10:00:00'),
    updatedAt: new Date('2025-11-01T09:00:00'),
    testCases: [],
  },

  // ==========================================
  // プロジェクト: proj-003
  // ==========================================
  {
    id: 'proj-003',
    name: 'モバイルアプリUI刷新',
    description: 'デザイン変更に伴う回帰テスト',
    ownerId: 'user-admin-01',
    memberIds: ['user-admin-01', 'user-designer-01'],
    createdAt: new Date('2025-09-20T13:00:00'),
    updatedAt: new Date('2025-10-05T18:00:00'),
    testCases: [],
  },

  // ==========================================
  // プロジェクト: proj-004
  // ==========================================
  {
    id: 'proj-004',
    name: 'API基盤リプレイス',
    description: 'バックエンドAPIの結合テスト',
    ownerId: 'user-admin-01',
    memberIds: ['user-admin-01', 'user-dev-02'],
    createdAt: new Date('2025-08-01T09:00:00'),
    updatedAt: new Date('2025-09-15T17:00:00'),
    testCases: [],
  },

  // ==========================================
  // プロジェクト: proj-005
  // ==========================================
  {
    id: 'proj-005',
    name: '外部決済サービス連携',
    description: '決済プロバイダ切替に伴う検証',
    ownerId: 'user-admin-01',
    memberIds: ['user-admin-01', 'user-qa-02'],
    createdAt: new Date('2025-07-12T11:00:00'),
    updatedAt: new Date('2025-07-30T16:00:00'),
    testCases: [],
  },

  // ==========================================
  // プロジェクト: proj-006
  // ==========================================
  {
    id: 'proj-006',
    name: '管理画面パフォーマンス改善',
    description: '表示速度改善後の確認テスト',
    ownerId: 'user-admin-01',
    memberIds: ['user-admin-01'],
    createdAt: new Date('2025-06-05T10:00:00'),
    updatedAt: new Date('2025-06-20T14:00:00'),
    testCases: [],
  },
];
