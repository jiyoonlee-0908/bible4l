import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Trophy, BookOpen, Target, CheckCircle } from 'lucide-react';
import { useReadingPlan } from '@/hooks/useReadingPlan';
import { ReadingPlan, Progress as ProgressType } from '@shared/schema';

export default function ProgressPage() {
  const [location, setLocation] = useLocation();
  const { plans, progress, selectPlan, markDayComplete, selectedPlanId } = useReadingPlan();
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [planProgress, setPlanProgress] = useState<ProgressType | null>(null);

  useEffect(() => {
    if (selectedPlanId) {
      const plan = plans.find(p => p.id === selectedPlanId);
      const prog = progress[selectedPlanId];
      setSelectedPlan(plan || null);
      setPlanProgress(prog || null);
    }
  }, [selectedPlanId, plans, progress]);

  const handleSelectPlan = (planId: string) => {
    selectPlan(planId);
  };

  const handleMarkComplete = () => {
    if (selectedPlanId && planProgress) {
      markDayComplete(selectedPlanId);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const getTodaysReading = () => {
    if (!selectedPlan || !planProgress) return null;
    
    const currentDay = planProgress.currentDay;
    if (currentDay <= selectedPlan.totalDays && selectedPlan.schedule[currentDay - 1]) {
      return {
        day: currentDay,
        ...selectedPlan.schedule[currentDay - 1]
      };
    }
    return null;
  };

  const todaysReading = getTodaysReading();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      <Header
        onBookmarksClick={() => setLocation('/bookmarks')}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">성경 통독 진도</h2>
          <p className="text-slate-600">하나님의 말씀과 함께하는 여정</p>
        </div>

        {/* Reading Plans Selection */}
        <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-800" />
              통독 계획 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const planProg = progress[plan.id];
              const completionRate = planProg ? (planProg.completedDays / plan.totalDays) * 100 : 0;
              
              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-800 bg-amber-50'
                      : 'border-slate-200 hover:border-amber-200 hover:bg-amber-25'
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-800">{plan.name}</h3>
                    <Badge variant={isSelected ? 'default' : 'secondary'} className={
                      isSelected ? 'bg-amber-800 hover:bg-amber-900' : ''
                    }>
                      {plan.totalDays}일
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{plan.description}</p>
                  
                  {planProg && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">진행률</span>
                        <span className="font-medium text-amber-800">{completionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{planProg.completedDays}일 완료</span>
                        <span>{plan.totalDays - planProg.completedDays}일 남음</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Current Progress */}
        {selectedPlan && planProgress && (
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-800" />
                현재 진도
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-800">{planProgress.currentDay}</div>
                  <div className="text-sm text-amber-600">현재 일차</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-800">{planProgress.streak}</div>
                  <div className="text-sm text-amber-600">연속 일수</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-800">{planProgress.completedDays}</div>
                  <div className="text-sm text-slate-600">완료한 일수</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-800">{formatTime(planProgress.totalListeningTime)}</div>
                  <div className="text-sm text-slate-600">총 청취 시간</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Reading */}
        {todaysReading && (
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-800" />
                오늘의 말씀
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-amber-800 text-amber-50">
                    {todaysReading.day}일차
                  </Badge>
                </div>
                <div className="space-y-2">
                  {todaysReading.books.map((book, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-amber-800" />
                      <span className="font-medium text-slate-800">{book}</span>
                      <span className="text-slate-600">{todaysReading.chapters[index]}장</span>
                    </div>
                  ))}
                </div>
                {todaysReading.description && (
                  <p className="text-sm text-slate-600 mt-3 italic">
                    {todaysReading.description}
                  </p>
                )}
              </div>

              <Button
                onClick={handleMarkComplete}
                className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50"
                disabled={planProgress?.completedDays >= todaysReading.day}
              >
                {planProgress?.completedDays >= todaysReading.day ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    완료됨
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    오늘 읽기 완료
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Achievement Summary */}
        {planProgress && (
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-800" />
                성취 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">완주율</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {((planProgress.completedDays / selectedPlan!.totalDays) * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">평균 청취시간</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {planProgress.completedDays > 0 
                      ? formatTime(Math.round(planProgress.totalListeningTime / planProgress.completedDays))
                      : '0분'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <BottomNavigation
        currentPath={location}
        onNavigate={setLocation}
      />
    </div>
  );
}