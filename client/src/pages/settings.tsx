import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FontSizeModal } from '@/components/FontSizeModal';
import { DSPControls } from '@/components/DSPControls';
import { ReadingPlanCard } from '@/components/ReadingPlanCard';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Storage } from '@/lib/storage';
import { Settings as SettingsType } from '@shared/schema';
import { useSpeech } from '@/hooks/useSpeech';
import { useReadingPlan } from '@/hooks/useReadingPlan';
import { useBadges } from '@/hooks/useBadges';
import { useSubscription } from '@/hooks/useSubscription';
import { AdFitBanner } from '@/components/AdFitBanner';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [location, setLocation] = useLocation();
  const [settings, setSettings] = useState<SettingsType>(Storage.getSettings());
  const [activeTab, setActiveTab] = useState<'audio' | 'plans' | 'badges' | 'subscription'>('audio');
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontLevel, setFontLevel] = useState(0);
  const { voices } = useSpeech();
  const { toast } = useToast();
  const readingPlan = useReadingPlan();
  const badges = useBadges();
  const { subscription, activateSubscription, cancelSubscription, getRemainingDays, isSubscribed } = useSubscription();

  useEffect(() => {
    const savedSettings = Storage.getSettings();
    setSettings(savedSettings);
    setFontLevel(savedSettings.fontLevel || 0);
  }, []);

  const updateSettings = (newSettings: Partial<SettingsType>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    Storage.saveSettings(updated);
    
    toast({
      title: '설정이 저장되었습니다',
      description: '변경사항이 적용되었습니다.',
    });
  };

  const clearAllData = () => {
    if (confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.clear();
      toast({
        title: '데이터 삭제 완료',
        description: '모든 설정과 북마크가 삭제되었습니다.',
      });
      
      // Reset to default settings
      const defaultSettings: SettingsType = {
        selectedLanguage: 'ko',
        displayMode: 'single',
        playbackSpeed: 1.0,
        pitch: 0,
        autoPlay: false,
        dsp: {
          echo: false,
          reverb: false,
          eq: { low: 0, mid: 0, high: 0 }
        }
      };
      setSettings(defaultSettings);
      Storage.saveSettings(defaultSettings);
    }
  };

  const getVoicesByLanguage = (lang: string) => {
    return voices.filter(voice => 
      voice.lang.startsWith(lang) || 
      voice.name.toLowerCase().includes(lang)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        onFontSizeClick={() => setShowFontSizeModal(true)}
        onSettingsClick={() => setLocation('/settings')}
      />
      
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Tab Navigation */}
        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <CardContent className="p-2">
            <div className="flex bg-slate-100 rounded-xl p-1">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('audio')}
                className={`flex-1 py-2 px-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'audio'
                    ? 'bg-amber-800 shadow-sm text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="text-sm font-medium">오디오</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('plans')}
                className={`flex-1 py-2 px-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'plans'
                    ? 'bg-amber-800 shadow-sm text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="text-sm font-medium">통독계획</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('badges')}
                className={`flex-1 py-2 px-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'badges'
                    ? 'bg-amber-800 shadow-sm text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="text-sm font-medium">배지</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('subscription')}
                className={`flex-1 py-2 px-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'subscription'
                    ? 'bg-amber-800 shadow-sm text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="text-sm font-medium">구독</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audio Tab */}
        {activeTab === 'audio' && (
          <>
            {/* Basic Audio Settings */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">기본 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">재생 속도</label>
                  <div className="px-2">
                    <Slider
                      value={[settings.playbackSpeed]}
                      onValueChange={([value]) => updateSettings({ playbackSpeed: value })}
                      min={0.8}
                      max={1.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0.8x</span>
                    <span className="font-medium">{settings.playbackSpeed.toFixed(1)}x</span>
                    <span>1.5x</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">자동 재생</label>
                  <Switch
                    checked={settings.autoPlay}
                    onCheckedChange={(autoPlay) => updateSettings({ autoPlay })}
                  />
                </div>

                {voices.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">음성 선택</label>
                    <Select
                      value={settings.voice || 'default'}
                      onValueChange={(voice) => updateSettings({ voice: voice === 'default' ? undefined : voice })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="기본 음성" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">기본 음성</SelectItem>
                        {voices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">기본 언어</label>
                  <Select
                    value={settings.selectedLanguage}
                    onValueChange={(selectedLanguage: any) => updateSettings({ selectedLanguage })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">표시 모드</label>
                  <Select
                    value={settings.displayMode}
                    onValueChange={(displayMode: any) => updateSettings({ displayMode })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">단일 모드</SelectItem>
                      <SelectItem value="double">교차 모드</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* DSP Controls */}
            <DSPControls
              settings={settings}
              onUpdateSettings={updateSettings}
            />

            {/* Data Management */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">데이터 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={clearAllData}
                  className="w-full"
                >
                  모든 데이터 삭제
                </Button>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  설정, 북마크 등 모든 데이터가 삭제됩니다.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Reading Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            {readingPlan.availablePlans.map((plan) => (
              <ReadingPlanCard
                key={plan.id}
                plan={plan}
                progress={readingPlan.selectedPlan?.id === plan.id ? readingPlan.progress : undefined}
                onSelectPlan={() => readingPlan.selectPlan(plan.id as any)}
                onMarkComplete={() => {
                  const todaysReading = readingPlan.getTodaysReading();
                  if (todaysReading) {
                    readingPlan.markDayComplete(todaysReading.day);
                  }
                }}
                todaysReading={readingPlan.selectedPlan?.id === plan.id ? readingPlan.getTodaysReading() : null}
              />
            ))}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <BadgeDisplay
            badges={badges.badges}
            title="획득한 배지"
            showLocked={true}
          />
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <>
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  {isSubscribed ? '프리미엄 구독' : '광고 제거 구독'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSubscribed ? (
                  <>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-green-800 font-semibold mb-2">✓ 프리미엄 구독 중</div>
                      <div className="text-sm text-green-600">
                        남은 기간: {getRemainingDays()}일
                      </div>
                      <div className="text-xs text-green-500 mt-1">
                        만료일: {subscription.expiryDate?.toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-slate-700">프리미엄 혜택</h4>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div>• 모든 광고 제거</div>
                        <div>• 끊김 없는 오디오 경험</div>
                        <div>• 전체 기능 이용</div>
                      </div>
                    </div>

                    <Button
                      onClick={cancelSubscription}
                      variant="outline"
                      className="w-full"
                    >
                      구독 해지 (테스트용)
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-amber-800 font-semibold mb-2">무료 버전 사용 중</div>
                      <div className="text-sm text-amber-600">
                        광고가 표시됩니다
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-700">프리미엄 구독 혜택</h4>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          모든 광고 제거
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          끊김 없는 오디오 체험
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          전체 기능 무제한 이용
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-slate-800">월 990원</div>
                      <div className="text-sm text-slate-600">첫 달 무료 체험</div>
                    </div>

                    <Button
                      onClick={() => activateSubscription(1)}
                      className="w-full bg-amber-800 hover:bg-amber-900"
                    >
                      프리미엄 구독하기 (테스트용)
                    </Button>

                    <div className="text-xs text-slate-500 text-center">
                      실제 앱스토어/플레이스토어에서는 인앱 결제로 처리됩니다
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* 설정 페이지 광고 */}
            <AdFitBanner
              adUnit="DAN-your-settings-unit"
              adWidth={300}
              adHeight={250}
              isSubscribed={isSubscribed}
              className="settings-ad"
            />
          </>
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
