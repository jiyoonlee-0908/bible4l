import React, { useState, useEffect } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalAudioProvider } from '@/hooks/useGlobalAudio';
import { GlobalAudioBar } from '@/components/GlobalAudioBar';
import { Storage } from '@/lib/storage';
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
    const fontScaleClasses = [
      'font-scale-xs',   // -2
      'font-scale-sm',   // -1  
      'font-scale-base', // 0
      'font-scale-lg',   // 1
      'font-scale-xl',   // 2
      'font-scale-2xl'   // 3
    ];
    
    fontScaleClasses.forEach(cls => document.body.classList.remove(cls));
    const targetClass = fontScaleClasses[fontLevel + 2] || 'font-scale-base';
    document.body.classList.add(targetClass);
  }, [fontLevel]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GlobalAudioProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Router />
            <GlobalAudioBar />
          </div>
          <Toaster />
        </GlobalAudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;