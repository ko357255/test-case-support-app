export default function Home() {
  return (
    <div className="px-8 py-4">
      メインコンテンツ
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr className="border-b border-gray-300 text-left">
            <th className="px-6 py-2">ステータス</th>
            <th className="px-6 py-2">タイトル</th>
            <th className="px-6 py-2">カテゴリ</th>
            <th className="px-6 py-2">優先度</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-300">
          <tr>
            <td className="px-6 py-3">未完了</td>
            <td className="px-6 py-3">HTMLの描画</td>
            <td className="px-6 py-3">HTML</td>
            <td className="px-6 py-3">高</td>
          </tr>
          <tr>
            <td className="px-6 py-3">成功</td>
            <td className="px-6 py-3">tailwindの反映</td>
            <td className="px-6 py-3">CSS</td>
            <td className="px-6 py-3">高</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
