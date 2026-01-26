import { Search } from 'lucide-react';

/**
 * ヘッダーコンポーネント（サーバー）
 */
export default async function Header({ projectName }: { projectName: string }) {
  return (
    <header className="border-border bg-background border-b px-8 py-4 shadow-sm">
      <div className="mb-4">
        <h1 className="text-foreground text-2xl">{projectName}</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-4">
          {/* 検索ボックス */}
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
            <input
              type="text"
              placeholder="テストケースを検索..."
              className="bg-background border-border focus:ring-ring w-full rounded-lg border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
