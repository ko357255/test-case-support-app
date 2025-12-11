export default function TestCaseTableHeader() {
  return (
    <thead>
      <tr className="border-b border-gray-300 bg-gray-50">
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
            className="px-6 py-3 text-left text-xs tracking-wider text-gray-500 uppercase"
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
