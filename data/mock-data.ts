import { NestedProject } from '@/types/testcase';

export const mockData: NestedProject[] = [
  /**
   * ==========================================
   * プロジェクト: proj-001
   * ==========================================
   */
  {
    id: 'proj-001',
    name: '次世代Eコマースプラットフォーム開発',
    description: '主要機能の品質保証テストプロジェクト',
    ownerId: 'user-admin-01',
    memberIds: ['user-admin-01', 'user-qa-01', 'user-dev-01'],
    createdAt: new Date('2025-11-01T09:00:00'),
    updatedAt: new Date('2025-12-04T15:00:00'),
    testCases: [
      {
        /**
         * テストケース 1: ログイン正常
         */
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
                createdAt: new Date('2025-12-04T10:30:00'),
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
                createdAt: new Date('2025-12-04T10:31:00'),
              },
            ],
          },
        ],
        evidences: [],
      },
      {
        /**
         * テストケース 2: ログイン異常
         */
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
            actual: 'エラーメッセージが表示されず、白い画面になった',
            status: 'failed',
            createdAt: new Date('2025-12-04T11:00:00'),
            updatedAt: new Date('2025-12-04T11:00:00'),
            evidences: [
              {
                id: 'e-err-1',
                name: 'コンソールエラーログ',
                type: 'text',
                textContent:
                  'TypeError: Cannot read property "status" of undefined at authService.js:89',
                createdAt: new Date('2025-12-04T11:00:10'),
              },
            ],
          },
        ],
        evidences: [],
      },
      {
        /**
         * テストケース 3: ユーザー登録
         */
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
        /**
         * テストケース 4: 商品検索
         */
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
        /**
         * テストケース 5: 決済正常
         */
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
                createdAt: new Date('2025-12-04T14:00:00'),
              },
            ],
          },
        ],
        evidences: [],
      },
    ],
  },
  /**
   * ==========================================
   * プロジェクト: proj-8bb2f1a
   * ==========================================
   */
  {
    id: 'proj-8bb2f1a',
    name: 'テストケース作成支援WEBアプリ開発',
    description: 'テストケースを作成を支援するWEBアプリケーション開発',
    ownerId: 'user-admin-01',
    memberIds: ['user-admin-01', 'user-qa-01'],
    createdAt: new Date('2026-01-10T09:00:00'),
    updatedAt: new Date('2026-01-20T15:00:00'),
    testCases: [
      {
        /**
         * テストケース 1: ログイン
         */
        id: 'tc-a3f9e2b',
        title: 'メールアドレス/パスワードによるログイン',
        description:
          '登録済みのユーザーがシステムにログインできることを確認する',
        category: '認証',
        priority: 'high',
        status: 'passed',
        groupId: 'grp-auth-001',
        createdAt: new Date('2026-01-15T10:00:00'),
        updatedAt: new Date('2026-01-20T11:00:00'),
        steps: [
          {
            id: 'step-f4d5s6a',
            stepNumber: 1,
            action:
              'ログイン画面で正しいメールアドレスと誤ったパスワードを入力して実行',
            expected:
              '「ログインに失敗しました。メールアドレスとパスワードを確認してください。」というエラーが表示され、ログインできないこと',
            actual:
              '期待通りのエラーメッセージが表示され、画面は遷移しなかった',
            status: 'passed',
            createdAt: new Date('2026-01-20T10:45:00'),
            updatedAt: new Date('2026-01-20T10:45:00'),
            evidences: [],
          },
        ],
        evidences: [],
      },
      {
        /**
         * テストケース 2: キーワード検索
         */
        id: 'tc-b4c5d6e',
        title: 'キーワードによるデータ検索',
        description:
          '検索窓に入力した文字列に合致する結果が表示されることを確認する',
        category: '検索',
        priority: 'medium',
        status: 'failed',
        groupId: 'grp-search-002',
        createdAt: new Date('2026-01-15T13:00:00'),
        updatedAt: new Date('2026-01-20T14:30:00'),
        steps: [
          {
            id: 'step-f1g2h3i',
            stepNumber: 1,
            action: '検索窓に任意のキーワードを入力して検索ボタンを押下',
            expected: '該当する一覧が表示される',
            actual:
              '検索結果が0件の場合にエラーメッセージが表示されず、無限読み込みになる',
            status: 'failed',
            createdAt: new Date('2026-01-20T14:00:00'),
            updatedAt: new Date('2026-01-20T14:00:00'),
            evidences: [
              {
                id: 'ev-d9e8f7g',
                name: '読み込み中画面のままフリーズ',
                type: 'screenshot',
                url: '/mock/error-loading.png',
                createdAt: new Date('2026-01-20T14:05:00'),
              },
            ],
          },
        ],
        evidences: [],
      },
      {
        /**
         * テストケース 3: 情報変更
         */
        id: 'tc-e7f8g9h',
        title: 'ユーザープロフィールの更新',
        description:
          'ユーザー名やメールアドレスの変更が保存されることを確認する',
        category: 'ユーザー管理',
        priority: 'medium',
        status: 'in_progress',
        groupId: 'grp-user-003',
        createdAt: new Date('2026-01-16T10:00:00'),
        updatedAt: new Date('2026-01-20T15:00:00'),
        steps: [
          {
            id: 'step-j4k5l6m',
            stepNumber: 1,
            action: '設定画面から名前を変更して保存ボタンを押下',
            expected: '変更が完了し、新しい名前が表示される',
            actual: '',
            status: 'in_progress',
            createdAt: new Date('2026-01-20T15:00:00'),
            updatedAt: new Date('2026-01-20T15:00:00'),
            evidences: [],
          },
        ],
        evidences: [],
      },
      /**
       * 既存のログイン（tc-a3f9e2b）に続くテストケース
       */
      {
        /**
         * テストケース 2: パスワードリセット（認証カテゴリ）
         */
        id: 'tc-f2d4s6a',
        title: 'パスワード再設定機能の確認',
        description:
          '登録済みメールアドレスに再設定用リンクが送信されることを確認する',
        category: '認証',
        priority: 'medium',
        status: 'not_started',
        groupId: 'grp-auth-001',
        createdAt: new Date('2026-01-21T10:00:00'),
        updatedAt: new Date('2026-01-21T10:00:00'),
        steps: [
          {
            id: 'step-m1n2b3v',
            stepNumber: 1,
            action: 'パスワード忘却ページでメールアドレスを入力し送信',
            expected: '送信完了メッセージが表示されること',
            actual: '',
            status: 'not_started',
            createdAt: new Date('2026-01-21T10:00:00'),
            updatedAt: new Date('2026-01-21T10:00:00'),
            evidences: [],
          },
        ],
        evidences: [],
      },
      {
        /**
         * テストケース 3: アカウントロック（認証カテゴリ）
         */
        id: 'tc-k9l8j7h',
        title: '連続ログイン失敗によるアカウントロック',
        description:
          '5回連続で失敗した際にアカウントが一時ロックされることを確認する',
        category: '認証',
        priority: 'high',
        status: 'failed',
        groupId: 'grp-auth-001',
        createdAt: new Date('2026-01-22T09:00:00'),
        updatedAt: new Date('2026-01-22T11:00:00'),
        steps: [
          {
            id: 'step-p5o4i3u',
            stepNumber: 1,
            action: '誤ったパスワードを5回連続で入力する',
            expected:
              '「アカウントがロックされました」というメッセージが表示されること',
            actual: '6回目も入力が可能で、ロックがかからなかった',
            status: 'failed',
            createdAt: new Date('2026-01-22T11:00:00'),
            updatedAt: new Date('2026-01-22T11:00:00'),
            evidences: [],
          },
        ],
        evidences: [],
      },
      {
        /**
         * テストケース 4: 新規ユーザー招待（ユーザー管理カテゴリ）
         */
        id: 'tc-x1y2z3w',
        title: '管理者による新規ユーザー招待',
        description: '管理者が新しいユーザーをメールアドレスで招待できること',
        category: 'ユーザー管理',
        priority: 'medium',
        status: 'passed',
        groupId: 'grp-user-003',
        createdAt: new Date('2026-01-23T14:00:00'),
        updatedAt: new Date('2026-01-24T10:00:00'),
        steps: [
          {
            id: 'step-q8w7e6r',
            stepNumber: 1,
            action: 'ユーザー管理画面で招待メールを送信',
            expected: '招待中ユーザーの一覧に表示されること',
            actual: '正常に表示された',
            status: 'passed',
            createdAt: new Date('2026-01-24T10:00:00'),
            updatedAt: new Date('2026-01-24T10:00:00'),
            evidences: [],
          },
        ],
        evidences: [],
      },
      {
        /**
         * テストケース 5: 権限変更（ユーザー管理カテゴリ）
         */
        id: 'tc-v4b5n6m',
        title: 'ユーザー権限の変更確認',
        description:
          '一般ユーザーを管理者に昇格させた際、管理機能が使えるようになること',
        category: 'ユーザー管理',
        priority: 'high',
        status: 'in_progress',
        groupId: 'grp-user-003',
        createdAt: new Date('2026-01-25T13:00:00'),
        updatedAt: new Date('2026-01-25T15:00:00'),
        steps: [
          {
            id: 'step-t1y2u3i',
            stepNumber: 1,
            action: '編集画面でロールを「管理者」に変更し保存',
            expected: '画面上に「管理者」と反映されること',
            actual: '',
            status: 'in_progress',
            createdAt: new Date('2026-01-25T15:00:00'),
            updatedAt: new Date('2026-01-25T15:00:00'),
            evidences: [],
          },
        ],
        evidences: [],
      },
    ],
  },
  /**
   * ==========================================
   * プロジェクト: proj-002 (勤怠管理)
   * ==========================================
   */
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
  /**
   * ==========================================
   * プロジェクト: proj-003 (UI刷新)
   * ==========================================
   */
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
  /**
   * ==========================================
   * プロジェクト: proj-005 (外部決済)
   * ==========================================
   */
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
  /**
   * ==========================================
   * プロジェクト: proj-006 (パフォーマンス)
   * ==========================================
   */
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
