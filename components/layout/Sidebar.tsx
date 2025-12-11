export default function Sidebar() {
  return (
    // 縦に並べる
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      サイドバー
      <div className="border-b border-gray-200 p-6">見出し</div>
      {/* 縦に並べる 縦方向をスクロール可 */}
      <div className="flex-1 overflow-y-auto p-6">
        コンテンツ
        <div className="mb-6">
          <div className="mb-2 text-gray-700">条件名</div>
          <div className="ml-3">
            <div className="py-1 text-gray-700">条件</div>
            <div className="py-1 text-gray-700">条件</div>
            <div className="py-1 text-gray-700">条件</div>
            <div className="py-1 text-gray-700">条件</div>
          </div>
        </div>
        <div className="mb-6">
          <div className="mb-2 text-gray-700">条件名</div>
          <div className="ml-3">
            <div className="py-1 text-gray-700">条件</div>
            <div className="py-1 text-gray-700">条件</div>
            <div className="py-1 text-gray-700">条件</div>
            <div className="py-1 text-gray-700">条件</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
