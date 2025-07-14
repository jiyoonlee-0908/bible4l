import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ReadingPlan, Progress as ProgressType } from '@shared/schema';

interface ReadingPlanCardProps {
  plan: ReadingPlan;
  progress?: ProgressType;
  onSelectPlan?: () => void;
  onMarkComplete?: () => void;
  todaysReading?: {
    day: number;
    books: string[];
    chapters: number[];
    description?: string;
  } | null;
}

export function ReadingPlanCard({ 
  plan, 
  progress, 
  onSelectPlan, 
  onMarkComplete,
  todaysReading 
}: ReadingPlanCardProps) {
  const progressPercentage = progress 
    ? (progress.completedDays.length / plan.totalDays) * 100 
    : 0;

  const isSelected = !!progress;
  const isCompletedToday = progress && todaysReading 
    ? progress.completedDays.includes(todaysReading.day)
    : false;

  return (
    <Card className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${
      isSelected ? 'border-blue-300 bg-blue-50' : 'border-slate-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">
            {plan.name}
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>{plan.totalDays}일</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        {isSelected && progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">진행률</span>
              <span className="font-medium text-slate-800">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-slate-800">
                    {progress.streak}
                  </span>
                </div>
                <div className="text-xs text-slate-600">연속 일수</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-slate-800">
                    {progress.completedDays.length}
                  </span>
                </div>
                <div className="text-xs text-slate-600">완료한 날</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-800">
                    {Math.round(progress.totalListeningTime)}
                  </span>
                </div>
                <div className="text-xs text-slate-600">분</div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Reading */}
        {isSelected && todaysReading && (
          <div className="bg-slate-50 rounded-xl p-3">
            <h4 className="text-sm font-medium text-slate-800 mb-2">
              오늘의 읽기 ({todaysReading.day}일차)
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-slate-700">
                <strong>{todaysReading.books.join(', ')}</strong> {todaysReading.chapters.join(', ')}장
              </p>
              {todaysReading.description && (
                <p className="text-xs text-slate-600">{todaysReading.description}</p>
              )}
            </div>
            
            {onMarkComplete && (
              <Button
                onClick={onMarkComplete}
                disabled={isCompletedToday}
                size="sm"
                className={`mt-3 w-full ${
                  isCompletedToday 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isCompletedToday ? '✓ 완료됨' : '오늘 읽기 완료'}
              </Button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {!isSelected && onSelectPlan && (
          <Button
            onClick={onSelectPlan}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            이 계획으로 시작하기
          </Button>
        )}
      </CardContent>
    </Card>
  );
}