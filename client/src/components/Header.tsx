import { Bookmark, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onBookmarksClick: () => void;
  onSettingsClick: () => void;
}

export function Header({ onBookmarksClick, onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-800 rounded-lg flex items-center justify-center">
              <span className="text-amber-50 text-sm font-semibold">📖</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-800">BibleAudio 4L</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBookmarksClick}
              className="w-10 h-10 bg-amber-50 hover:bg-amber-100 rounded-full"
            >
              <Bookmark className="h-5 w-5 text-amber-800" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="w-10 h-10 bg-amber-50 hover:bg-amber-100 rounded-full"
            >
              <Settings className="h-5 w-5 text-amber-800" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
