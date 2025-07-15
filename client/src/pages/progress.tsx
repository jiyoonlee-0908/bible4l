import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FontSizeModal } from '@/components/FontSizeModal';
import { BibleGrid } from '@/components/BibleGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Clock, Trophy, BookOpen, Target, CheckCircle, Headphones, Book, Award } from 'lucide-react';
import { Storage } from '@/lib/storage';
import { useReadingPlan } from '@/hooks/useReadingPlan';


interface ListeningStat {
  book: string;
  chapter: number;
  verse: number;
  language: string;
  timestamp: string;
  duration: number; // in minutes
}

export default function ProgressPage() {
  const [location, setLocation] = useLocation();
  const [listeningStats, setListeningStats] = useState<ListeningStat[]>([]);
  const [totalListeningTime, setTotalListeningTime] = useState(0);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontLevel, setFontLevel] = useState(0);
  const { selectedPlan, progress, availablePlans } = useReadingPlan();

  useEffect(() => {
    // Load listening statistics from localStorage
    const savedStats = localStorage.getItem('listeningStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setListeningStats(stats);
      
      // Calculate total listening time
      const total = stats.reduce((sum: number, stat: ListeningStat) => sum + stat.duration, 0);
      setTotalListeningTime(total);
    }
    
    // Load font level
    const savedSettings = Storage.getSettings();
    setFontLevel(savedSettings.fontLevel || 0);
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const getRecentListening = () => {
    const sorted = listeningStats
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return showAllRecent ? sorted : sorted.slice(0, 3);
  };

  const getUniqueBooks = () => {
    const uniqueBooks = Array.from(new Set(listeningStats.map(stat => stat.book)));
    return uniqueBooks.length;
  };

  const getLanguageStats = () => {
    const langStats: { [key: string]: number } = {};
    listeningStats.forEach(stat => {
      langStats[stat.language] = (langStats[stat.language] || 0) + stat.duration;
    });
    return langStats;
  };

  const getLanguageName = (code: string) => {
    const names: { [key: string]: string } = {
      ko: '한국어',
      en: 'English',
      zh: '中文',
      ja: '日本語'
    };
    return names[code] || code;
  };

  const getStreakDays = () => {
    if (listeningStats.length === 0) return 0;
    
    const dates = Array.from(new Set(
      listeningStats.map(stat => new Date(stat.timestamp).toDateString())
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const currentDate = new Date(dates[i-1]);
        const prevDate = new Date(dates[i]);
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-24">
      <Header
        onFontSizeClick={() => setShowFontSizeModal(true)}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Headphones className="h-8 w-8" />
              <h2 className="text-2xl font-bold">나의 청취 진도</h2>
            </div>
            <p className="text-amber-100">하나님의 말씀과 함께한 시간들</p>
          </div>
        </div>

        {/* Overview Stats */}
        {listeningStats.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200 shadow-lg transform hover:scale-105 transition-transform">
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-blue-600 rounded-full w-fit mx-auto mb-3">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    {formatTime(totalListeningTime)}
                  </div>
                  <div className="text-sm font-medium text-blue-700">총 청취 시간</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow-lg transform hover:scale-105 transition-transform">
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-purple-600 rounded-full w-fit mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    {getUniqueBooks()}
                  </div>
                  <div className="text-sm font-medium text-purple-700">청취한 성경책</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-200 shadow-lg transform hover:scale-105 transition-transform">
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-green-600 rounded-full w-fit mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-1">
                    {getStreakDays()}
                  </div>
                  <div className="text-sm font-medium text-green-700">연속 청취일</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-200 shadow-lg transform hover:scale-105 transition-transform">
                <CardContent className="p-4 text-center">
                  <div className="p-3 bg-orange-600 rounded-full w-fit mx-auto mb-3">
                    <Book className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-orange-900 mb-1">
                    {listeningStats.length}
                  </div>
                  <div className="text-sm font-medium text-orange-700">총 청취 횟수</div>
                </CardContent>
              </Card>
            </div>

          </>
        )}

        {/* Language Statistics */}
        {Object.keys(getLanguageStats()).length > 0 && (
          <Card className="bg-white rounded-xl shadow-lg border border-slate-200 mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <CardTitle className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                언어별 청취 시간
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {Object.entries(getLanguageStats()).map(([lang, time], index) => {
                const total = Object.values(getLanguageStats()).reduce((sum, t) => sum + t, 0);
                const percentage = ((time / total) * 100).toFixed(1);
                const colors = [
                  'bg-gradient-to-r from-blue-500 to-blue-600',
                  'bg-gradient-to-r from-purple-500 to-purple-600', 
                  'bg-gradient-to-r from-green-500 to-green-600',
                  'bg-gradient-to-r from-orange-500 to-orange-600'
                ];
                
                return (
                  <div key={lang} className="p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-800">{getLanguageName(lang)}</span>
                      <div className="text-right">
                        <div className="font-bold text-amber-800">{formatTime(time)}</div>
                        <div className="text-xs text-slate-500">{percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Recent Listening */}
        {listeningStats.length > 0 && (
          <Card className="bg-white rounded-xl shadow-lg border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                최근 청취 기록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getRecentListening().map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                      <Book className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">
                        {stat.book} {stat.chapter}:{stat.verse}
                      </div>
                      <div className="text-xs text-slate-500">
                        {getLanguageName(stat.language)} • {formatTime(stat.duration)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(stat.timestamp).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              ))}
              {listeningStats.length > 3 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllRecent(!showAllRecent)}
                    className="text-amber-600 text-sm hover:text-amber-700 font-medium"
                  >
                    {showAllRecent ? '접기' : `더보기 (+${listeningStats.length - 3}개)`}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reading Plan Progress */}
        {selectedPlan && progress && (
          <Card className="bg-white rounded-xl shadow-lg border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                읽기 계획 진행률
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                selectedPlan.type === '365days' 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    selectedPlan.type === '365days' ? 'text-amber-900' : 'text-blue-900'
                  }`}>
                    {selectedPlan.name}
                  </h4>
                  <Badge variant="secondary" className={`${
                    selectedPlan.type === '365days' 
                      ? 'bg-amber-200 text-amber-800' 
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    Day {progress.currentDay}/{selectedPlan.totalDays}
                  </Badge>
                </div>
                <Progress 
                  value={(progress.completedDays.length / selectedPlan.totalDays) * 100} 
                  className="mb-2" 
                />
                <p className={`text-xs ${
                  selectedPlan.type === '365days' ? 'text-amber-700' : 'text-blue-700'
                }`}>
                  완료된 일수: {progress.completedDays.length}일
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Reading Plan Message */}
        {!selectedPlan && (
          <Card className="bg-white rounded-xl shadow-lg border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                읽기 계획 진행률
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="text-slate-500 mb-4">
                <BookOpen className="h-12 w-12 mx-auto mb-2" />
                <p>선택된 읽기 계획이 없습니다</p>
              </div>
              <button
                onClick={() => setLocation('/settings')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                설정에서 계획 선택하기
              </button>
            </CardContent>
          </Card>
        )}

        {/* Bible Grid - 성경전체진도 (기본으로 펼쳐져 있음) */}
        <Card className="bg-white rounded-xl shadow-lg border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-600" />
              성경 전체 진도
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BibleGrid listeningStats={listeningStats} />
          </CardContent>
        </Card>

        {/* Empty State */}
        {listeningStats.length === 0 && (
          <Card className="bg-white rounded-xl shadow-lg border border-slate-200">
            <CardContent className="text-center py-12">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-6 w-fit mx-auto mb-6">
                <Headphones className="h-16 w-16 text-amber-800" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">아직 청취 기록이 없습니다</h3>
              <p className="text-slate-600 mb-6">플레이어에서 성경을 들으면<br />자동으로 진도가 기록됩니다!</p>
              <button 
                onClick={() => setLocation('/player')}
                className="bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-amber-950 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                플레이어로 이동하기
              </button>
            </CardContent>
          </Card>
        )}

      </div>
      
      <BottomNavigation
        currentPath={location}
        onNavigate={setLocation}
      />
      
      <FontSizeModal
        isOpen={showFontSizeModal}
        onClose={() => setShowFontSizeModal(false)}
        currentLevel={fontLevel}
        onLevelChange={setFontLevel}
      />
    </div>
  );
}