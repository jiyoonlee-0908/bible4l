import { Language, languageConfig } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LanguageToggleProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ selectedLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-700">언어 선택</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(languageConfig) as [Language, typeof languageConfig[Language]][]).map(([code, config]) => {
            const isSelected = selectedLanguage === code;
            return (
              <Button
                key={code}
                variant="ghost"
                onClick={() => onLanguageChange(code)}
                className={`flex items-center space-x-3 p-3 h-auto rounded-xl transition-all duration-200 ${
                  isSelected
                    ? `bg-[${config.color}]/10 border-2 hover:bg-[${config.color}]/20`
                    : 'bg-slate-50 border-2 border-slate-200 hover:bg-slate-100'
                }`}
                style={{
                  backgroundColor: isSelected ? `${config.color}10` : undefined,
                  borderColor: isSelected ? config.color : undefined,
                }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isSelected ? config.color : '#94a3b8' }}
                >
                  <span className="text-white text-xs font-medium">{config.short}</span>
                </div>
                <span 
                  className={`text-sm font-medium ${
                    isSelected ? 'font-semibold' : 'text-slate-600'
                  }`}
                  style={{ color: isSelected ? config.color : undefined }}
                >
                  {config.name}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
