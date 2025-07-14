import { Language, languageConfig } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LanguageToggleProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ selectedLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-slate-700">언어 선택</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(languageConfig) as [Language, typeof languageConfig[Language]][]).map(([code, config]) => {
            const isSelected = selectedLanguage === code;
            return (
              <Button
                key={code}
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => onLanguageChange(code)}
                size="sm"
                className={`h-10 text-sm transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {config.name}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
