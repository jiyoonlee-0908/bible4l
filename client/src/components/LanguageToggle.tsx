import { Language, languageConfig } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LanguageToggleProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  displayMode: 'single' | 'double';
  onModeChange: (mode: 'single' | 'double') => void;
}

export function LanguageToggle({ selectedLanguage, onLanguageChange, displayMode, onModeChange }: LanguageToggleProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-slate-700">언어 선택</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(Object.entries(languageConfig) as [Language, typeof languageConfig[Language]][]).map(([code, config]) => {
            const isSelected = selectedLanguage === code;
            const flagEmoji = code === 'ko' ? '🇰🇷' : 
                             code === 'en' ? '🇺🇸' : 
                             code === 'zh' ? '🇨🇳' : '🇯🇵';
            return (
              <Button
                key={code}
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => onLanguageChange(code)}
                size="sm"
                className={`h-10 text-sm transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-base">{flagEmoji}</span>
                {config.name}
              </Button>
            );
          })}
        </div>
        
        {/* Display Mode Toggle */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-600">표시 모드</label>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <Button
              onClick={() => onModeChange('single')}
              variant="ghost"
              size="sm"
              className={`flex-1 h-8 text-sm rounded-md transition-all ${
                displayMode === 'single'
                  ? 'bg-white shadow-md text-slate-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              단일언어
            </Button>
            <Button
              onClick={() => onModeChange('double')}
              variant="ghost"
              size="sm"
              className={`flex-1 h-8 text-sm rounded-md transition-all ${
                displayMode === 'double'
                  ? 'bg-white shadow-md text-slate-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              교차모드
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
