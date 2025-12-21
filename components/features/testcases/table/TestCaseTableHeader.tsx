export default function TestCaseTableHeader() {
  return (
    <thead>
      <tr className="border-border bg-muted border-b">
        {[
          'ステータス',
          'タイトル',
          'カテゴリ',
          '優先度',
          'ステップ数',
          'エビデンス',
          '更新日時',
        ].map((label) => (
          <th
            key={label}
            className="text-muted-foreground px-6 py-3 text-left text-xs tracking-wider uppercase"
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
