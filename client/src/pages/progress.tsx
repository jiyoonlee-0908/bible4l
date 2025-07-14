import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';
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
          <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <BookOpen className="h-8 w-8" />
              <h2 className="text-2xl font-bold">성경 통독 진도</h2>
            </div>
            <p className="text-amber-100">하나님의 말씀과 함께하는 영적 여정</p>
          </div>
        </div>

        {/* Reading Plans Selection */}
        <Card className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
            <CardTitle className="text-lg font-semibold text-amber-900 flex items-center gap-2">
              <Target className="h-5 w-5" />
              통독 계획 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plans && plans.length > 0 ? plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const planProg = progress[plan.id];
              const completionRate = planProg ? (planProg.completedDays / plan.totalDays) * 100 : 0;
              
              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-[1.02] ${
                    isSelected
                      ? 'border-amber-800 bg-gradient-to-r from-amber-50 to-amber-100 shadow-md'
                      : 'border-slate-200 hover:border-amber-300 hover:bg-amber-25 hover:shadow-sm'
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
            }) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">통독 계획을 불러오는 중...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Progress */}
        {selectedPlan && planProgress && (
          <Card className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
              <CardTitle className="text-lg font-semibold text-emerald-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                현재 진도
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl shadow-inner">
                  <div className="text-3xl font-bold text-amber-900 mb-1">{planProgress.currentDay}</div>
                  <div className="text-sm font-medium text-amber-700">현재 일차</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-inner">
                  <div className="text-3xl font-bold text-orange-900 mb-1">{planProgress.streak}</div>
                  <div className="text-sm font-medium text-orange-700">연속 일수</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-inner">
                  <div className="text-2xl font-bold text-emerald-900 mb-1">{planProgress.completedDays}</div>
                  <div className="text-sm font-medium text-emerald-700">완료한 일수</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-inner">
                  <div className="text-xl font-bold text-blue-900 mb-1">{formatTime(planProgress.totalListeningTime)}</div>
                  <div className="text-sm font-medium text-blue-700">총 청취 시간</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Reading */}
        {todaysReading && (
          <Card className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
              <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                오늘의 말씀
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-purple-800 text-purple-50 shadow-sm">
                    {todaysReading.day}일차
                  </Badge>
                </div>
                <div className="space-y-2">
                  {todaysReading.books.map((book, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                      <BookOpen className="h-4 w-4 text-purple-800 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">{book}</span>
                      <span className="text-purple-700 font-medium">{todaysReading.chapters[index]}장</span>
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
                className={`w-full transition-all transform hover:scale-105 shadow-lg ${
                  planProgress?.completedDays >= todaysReading.day 
                    ? 'bg-green-700 hover:bg-green-800 text-white'
                    : 'bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white'
                }`}
                disabled={planProgress?.completedDays >= todaysReading.day}
              >
                {planProgress?.completedDays >= todaysReading.day ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    오늘 읽기 완료됨
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    오늘 읽기 완료하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Achievement Summary */}
        {planProgress && (
          <Card className="bg-white rounded-xl shadow-lg border border-yellow-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200">
              <CardTitle className="text-lg font-semibold text-yellow-900 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                성취 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-inner border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-full">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-800">완주율</span>
                  </div>
                  <span className="text-xl font-bold text-green-900">
                    {((planProgress.completedDays / selectedPlan!.totalDays) * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-inner border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-full">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-blue-800">평균 청취시간</span>
                  </div>
                  <span className="text-lg font-bold text-blue-900">
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