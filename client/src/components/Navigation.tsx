import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NavigationProps {
  currentChapter: number;
  currentVerse: number;
  onPrevious: () => void;
  onNext: () => void;
  onChapterSelect: () => void;
  onVerseSelect: () => void;
}

export function Navigation({
  currentChapter,
  currentVerse,
  onPrevious,
  onNext,
  onChapterSelect,
  onVerseSelect,
}: NavigationProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onPrevious}
            className="flex items-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">이전</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={onChapterSelect}
              className="px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <span className="text-sm font-medium text-blue-700">{currentChapter}장</span>
            </Button>
            <Button
              variant="ghost"
              onClick={onVerseSelect}
              className="px-4 py-3 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
            >
              <span className="text-sm font-medium text-violet-700">{currentVerse}절</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={onNext}
            className="flex items-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <span className="text-sm font-medium text-slate-700">다음</span>
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
