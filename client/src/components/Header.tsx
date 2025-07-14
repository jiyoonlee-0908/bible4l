import { Type, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onFontSizeClick: () => void;
  onSettingsClick: () => void;
}

export function Header({ onFontSizeClick, onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="/bible-icon-option2.svg" alt="성경" className="w-10 h-10 rounded-lg" />
            </div>
            <h1 className="text-lg font-semibold text-card-foreground">BibleAudio 4L</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onFontSizeClick}
              className="w-10 h-10 bg-secondary hover:bg-accent/20 rounded-full"
              title="글자 크기 조절"
            >
              <Type className="h-5 w-5 text-accent-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              className="w-10 h-10 bg-secondary hover:bg-accent/20 rounded-full"
            >
              <Settings className="h-5 w-5 text-accent-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
