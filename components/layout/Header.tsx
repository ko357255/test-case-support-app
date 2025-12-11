import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl text-gray-900">プロジェクト名</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="テストケースを検索..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
