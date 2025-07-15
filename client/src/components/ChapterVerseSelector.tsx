import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChapterVerseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (chapter: number, verse: number) => void;
  currentChapter: number;
  currentVerse: number;
  maxChapters?: number;
}

export function ChapterVerseSelector({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentChapter, 
  currentVerse,
  maxChapters = 150 
}: ChapterVerseSelectorProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>(currentChapter.toString());
  const [selectedVerse, setSelectedVerse] = useState<string>(currentVerse.toString());

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedChapter && selectedVerse) {
      onSelect(parseInt(selectedChapter), parseInt(selectedVerse));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <CardHeader className="relative">
          <CardTitle className="text-lg font-semibold text-slate-800 text-center">
            장과 절 선택
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 w-8 h-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">장</label>
            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger>
                <SelectValue placeholder="장을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxChapters }, (_, i) => i + 1).map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()}>
                    {chapter}장
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">절</label>
            <Select value={selectedVerse} onValueChange={setSelectedVerse}>
              <SelectTrigger>
                <SelectValue placeholder="절을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((verse) => (
                  <SelectItem key={verse} value={verse.toString()}>
                    {verse}절
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 mt-6">
            <Button onClick={onClose} variant="outline" className="flex-1">
              취소
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              이동하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}