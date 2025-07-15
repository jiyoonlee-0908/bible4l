import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalAudioProvider } from '@/hooks/useGlobalAudio';
import { GlobalAudioBar } from '@/components/GlobalAudioBar';
import { Storage } from '@/lib/storage';
import { useState, useEffect } from 'react';
import React from 'react';
import Home from "@/pages/home";
import Player from "@/pages/player";
import Bookmarks from "@/pages/bookmarks";
import Progress from "@/pages/progress";
import Settings from "@/pages/settings";
import IconPreview from "@/pages/icon-preview";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/player" component={Player} />
      <Route path="/progress" component={Progress} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/settings" component={Settings} />
      <Route path="/icon-preview" component={IconPreview} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Error Boundary Component
class AppErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">앱에 오류가 발생했습니다</h2>
            <p className="text-slate-600 mb-4">페이지를 새로고침해주세요</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [fontLevel, setFontLevel] = useState(0);

  useEffect(() => {
    // 전역 에러 핸들러
    const handleError = (event: ErrorEvent) => {
      console.error('Global Error:', event.error);
      // 에러를 콘솔에만 기록하고 앱은 계속 실행
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      // 에러를 콘솔에만 기록하고 앱은 계속 실행
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    try {
      const savedSettings = Storage.getSettings();
      const level = savedSettings.fontLevel || 0;
      setFontLevel(level);
    } catch (error) {
      console.error('Settings loading error:', error);
    }
  }, []);

  useEffect(() => {
    try {
      // 폰트 크기 클래스 적용
      const fontScaleClasses = [
        'font-scale-xs',   // -2
        'font-scale-sm',   // -1  
        'font-scale-base', // 0
        'font-scale-lg',   // 1
        'font-scale-xl',   // 2
        'font-scale-2xl'   // 3
      ];

      // 기존 폰트 클래스 제거
      document.body.classList.remove(...fontScaleClasses);
      
      // 새 폰트 클래스 적용
      const scaleIndex = Math.max(0, Math.min(5, fontLevel + 2));
      document.body.classList.add(fontScaleClasses[scaleIndex]);
    } catch (error) {
      console.error('Font scaling error:', error);
    }
  }, [fontLevel]);

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GlobalAudioProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <GlobalAudioBar />
          </TooltipProvider>
        </GlobalAudioProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
