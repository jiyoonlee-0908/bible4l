import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FontSizeModal } from '@/components/FontSizeModal';
import { VoicePackageButton } from '@/components/VoicePackageGuide';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { ReadingPlanCard } from '@/components/ReadingPlanCard';
import { useBadges } from '@/hooks/useBadges';
import { useReadingPlan } from '@/hooks/useReadingPlan';
import { Storage } from '@/lib/storage';
import { Settings as SettingsType } from '@shared/schema';

export default function Settings() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'audio' | 'plans' | 'badges'>('audio');
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontLevel, setFontLevel] = useState(() => {
    const saved = localStorage.getItem('fontLevel');
    return saved ? parseInt(saved) : 3;
  });
  
  const badges = useBadges();
  const readingPlan = useReadingPlan();
  
  const [settings, setSettings] = useState<SettingsType>(() => {
    const saved = Storage.getSettings();
    if (saved) return saved;
    
    const defaultSettings: SettingsType = {
      selectedLanguage: 'ko',
      displayMode: 'single',
      playbackSpeed: 1.0,
      pitch: 0,
      autoPlay: true,
      totalListeningTime: 0,
      dsp: {
        echo: false,
        reverb: false,
        eq: { low: 0, mid: 0, high: 0 },
      },
    };
    return defaultSettings;
  });

  const updateSettings = (newSettings: Partial<SettingsType>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    Storage.saveSettings(updated);
  };

  const clearAllData = () => {
    const confirmClear = window.confirm(
      '모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
    );
    
    if (confirmClear) {
      localStorage.clear();
      
      const defaultSettings: SettingsType = {
        selectedLanguage: 'ko',
        displayMode: 'single',
        playbackSpeed: 1.0,
        pitch: 0,
        autoPlay: true,
        totalListeningTime: 0,
        dsp: {
          echo: false,
          reverb: false,
          eq: { low: 0, mid: 0, high: 0 },
        },
      };
      setSettings(defaultSettings);
      Storage.saveSettings(defaultSettings);
      
      // Force page reload to ensure all components reset properly
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-32">
      <Header
        onFontSizeClick={() => setShowFontSizeModal(true)}
        onSettingsClick={() => setLocation("/settings")}
      />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Tab Navigation */}
        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <CardContent className="p-2">
            <div className="flex bg-slate-100 rounded-xl p-1">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("audio")}
                className={`flex-1 py-2 px-2 rounded-lg transition-all duration-200 ${
                  activeTab === "audio"
                    ? "bg-amber-800 shadow-sm text-white"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <span className="text-sm font-medium">음성 설정</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("plans")}
                className={`flex-1 py-2 px-2 rounded-lg transition-all duration-200 ${
                  activeTab === "plans"
                    ? "bg-amber-800 shadow-sm text-white"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <span className="text-sm font-medium">통독계획</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("badges")}
                className={`flex-1 py-2 px-2 rounded-lg transition-all duration-200 ${
                  activeTab === "badges"
                    ? "bg-amber-800 shadow-sm text-white"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <span className="text-sm font-medium">배지</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audio Tab */}
        {activeTab === "audio" && (
          <>
            {/* Voice Package Download Guide */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  음성 품질 향상
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoicePackageButton />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  언어팩을 다운로드하면 더 자연스러운 음성을 들을 수 있습니다.
                </p>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  데이터 관리
                </CardTitle>
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
        {activeTab === "plans" && (
          <div className="space-y-4">
            {readingPlan.availablePlans.map((plan) => (
              <ReadingPlanCard
                key={plan.id}
                plan={plan}
                progress={
                  readingPlan.selectedPlan?.id === plan.id
                    ? readingPlan.progress
                    : undefined
                }
                onSelectPlan={() => readingPlan.selectPlan(plan.id as any)}
                onMarkComplete={() => {
                  const todaysReading = readingPlan.getTodaysReading();
                  if (todaysReading) {
                    readingPlan.markDayComplete(todaysReading.day);
                  }
                }}
                todaysReading={
                  readingPlan.selectedPlan?.id === plan.id
                    ? readingPlan.getTodaysReading()
                    : null
                }
              />
            ))}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <BadgeDisplay
            badges={badges.badges}
            title="획득한 배지"
            showLocked={true}
          />
        )}
      </div>

      <BottomNavigation currentPath={location} onNavigate={setLocation} />

      <FontSizeModal
        isOpen={showFontSizeModal}
        onClose={() => setShowFontSizeModal(false)}
        currentLevel={fontLevel}
        onLevelChange={setFontLevel}
      />
    </div>
  );
}