import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalAudioProvider } from '@/hooks/useGlobalAudio';
import { GlobalAudioBar } from '@/components/GlobalAudioBar';
import { Storage } from '@/lib/storage';
import React, { useState, useEffect } from 'react';
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

function App() {
  const [fontLevel, setFontLevel] = useState(0);

  useEffect(() => {
    const savedSettings = Storage.getSettings();
    const level = savedSettings.fontLevel || 0;
    setFontLevel(level);
  }, []);

  useEffect(() => {
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
  }, [fontLevel]);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalAudioProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <GlobalAudioBar />
        </TooltipProvider>
      </GlobalAudioProvider>
    </QueryClientProvider>
  );
}

export default App;
