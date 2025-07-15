import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Storage } from '@/lib/storage';

interface FontSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  onLevelChange: (level: number) => void;
}

export function FontSizeModal({ isOpen, onClose, currentLevel, onLevelChange }: FontSizeModalProps) {
  const getFontLevelName = (level: number) => {
    const names = ['매우 작게', '작게', '기본', '크게', '매우 크게', '최대 크게'];
    return names[level + 2] || '기본';
  };

  const handleLevelChange = (newLevel: number) => {
    onLevelChange(newLevel);
    
    // 설정 저장
    const currentSettings = Storage.getSettings();
    const newSettings = { ...currentSettings, fontLevel: newLevel };
    Storage.saveSettings(newSettings);
    
    // 전역 폰트 크기 적용
    const fontScaleClasses = [
      'font-scale-xs',   // -2
      'font-scale-sm',   // -1  
      'font-scale-base', // 0
      'font-scale-lg',   // 1
      'font-scale-xl',   // 2
      'font-scale-2xl'   // 3
    ];
    
    document.body.classList.remove(...fontScaleClasses);
    const scaleIndex = Math.max(0, Math.min(5, newLevel + 2));
    document.body.classList.add(fontScaleClasses[scaleIndex]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>글자 크기 조절</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            모든 텍스트의 크기를 조절합니다
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[-2, -1, 0, 1, 2, 3].map((level) => (
              <Button
                key={level}
                variant={currentLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => handleLevelChange(level)}
                className="text-xs"
              >
                {getFontLevelName(level)}
              </Button>
            ))}
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-base">
              미리보기: 하나님이 세상을 이처럼 사랑하사
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full">
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}