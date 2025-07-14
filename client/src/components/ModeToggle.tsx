import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ModeToggleProps {
  mode: 'single' | 'double';
  onModeChange: (mode: 'single' | 'double') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <CardContent className="p-3">
        <div className="mb-2">
          <h3 className="text-xs font-medium text-slate-600">표시 모드</h3>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={() => onModeChange('single')}
            variant={mode === 'single' ? 'default' : 'outline'}
            size="sm"
            className={`flex-1 h-7 text-xs transition-colors ${
              mode === 'single'
                ? 'bg-amber-800 text-amber-50 hover:bg-amber-900'
                : 'bg-white text-amber-800 hover:bg-amber-50'
            }`}
          >
            1줄
          </Button>
          <Button
            onClick={() => onModeChange('double')}
            variant={mode === 'double' ? 'default' : 'outline'}
            size="sm"
            className={`flex-1 h-7 text-xs transition-colors ${
              mode === 'double'
                ? 'bg-amber-800 text-amber-50 hover:bg-amber-900'
                : 'bg-white text-amber-800 hover:bg-amber-50'
            }`}
          >
            교차
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
