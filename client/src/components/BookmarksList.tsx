import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, Language } from '@shared/schema';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onRemoveBookmark: (verseId: string, language: Language) => void;
  onSelectBookmark: (bookmark: Bookmark) => void;
}

export function BookmarksList({ bookmarks, onRemoveBookmark, onSelectBookmark }: BookmarksListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (bookmarks.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <CardContent className="p-8 text-center">
          <div className="text-slate-400 text-lg mb-2">📚</div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">저장된 북마크가 없습니다</h3>
          <p className="text-sm text-slate-600">
            마음에 드는 구절을 별표로 표시해서 북마크에 저장해보세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardHeader className="px-6 py-4 border-b border-slate-200">
        <CardTitle className="text-lg font-semibold text-slate-800">북마크</CardTitle>
        <p className="text-sm text-slate-600">저장된 구절 {bookmarks.length}개</p>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-slate-200">
          {bookmarks.map((bookmark) => (
            <div
              key={`${bookmark.verseId}-${bookmark.language}`}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onSelectBookmark(bookmark)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-800">{bookmark.reference}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{bookmark.text}</p>
                  <span className="text-xs text-slate-500 mt-2 block">
                    {formatDate(bookmark.createdAt)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(bookmark.verseId, bookmark.language);
                  }}
                  className="ml-3 p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
