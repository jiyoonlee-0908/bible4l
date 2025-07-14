import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ModeToggleProps {
  mode: 'single' | 'double';
  onModeChange: (mode: 'single' | 'double') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-700">표시 모드</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex bg-slate-100 rounded-xl p-1">
          <Button
            variant="ghost"
            onClick={() => onModeChange('single')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all duration-200 ${
              mode === 'single'
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span className="text-sm font-medium">단일 모드</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => onModeChange('double')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all duration-200 ${
              mode === 'double'
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span className="text-sm font-medium">2줄 모드</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
