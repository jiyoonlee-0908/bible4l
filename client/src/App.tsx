import { useState, useEffect } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { GlobalAudioProvider } from "@/hooks/useGlobalAudio";

import Home from "./pages/home";
import Player from "./pages/player";
import Bookmarks from "./pages/bookmarks";
import Settings from "./pages/settings";
import Progress from "./pages/progress";
import NotFound from "./pages/not-found";
import IconPreview from "./pages/icon-preview";

import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { FontSizeModal } from "@/components/FontSizeModal";
import { GlobalAudioBar } from "@/components/GlobalAudioBar";
import { Storage } from "@/lib/storage";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [fontLevel, setFontLevel] = useState(2);

  useEffect(() => {
    const savedFontLevel = localStorage.getItem('fontLevel');
    if (savedFontLevel) {
      const level = parseInt(savedFontLevel, 10);
      setFontLevel(level);
      document.documentElement.style.setProperty('--font-scale', `${0.8 + (level * 0.1)}`);
    }
  }, []);

  const handleFontLevelChange = (level: number) => {
    setFontLevel(level);
    localStorage.setItem('fontLevel', level.toString());
    document.documentElement.style.setProperty('--font-scale', `${0.8 + (level * 0.1)}`);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalAudioProvider>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950">
          <Header 
            onFontSizeClick={() => setShowFontSizeModal(true)}
            onSettingsClick={() => handleNavigate('/settings')}
          />
          
          <main className="container mx-auto px-4 py-4 pb-20">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/player" component={Player} />
              <Route path="/bookmarks" component={Bookmarks} />
              <Route path="/settings" component={Settings} />
              <Route path="/progress" component={Progress} />
              <Route path="/icon-preview" component={IconPreview} />
              <Route component={NotFound} />
            </Switch>
          </main>

          <GlobalAudioBar />
          
          <BottomNavigation 
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />

          <FontSizeModal
            isOpen={showFontSizeModal}
            onClose={() => setShowFontSizeModal(false)}
            currentLevel={fontLevel}
            onLevelChange={handleFontLevelChange}
          />

          <Toaster />
        </div>
      </GlobalAudioProvider>
    </QueryClientProvider>
  );
}

export default App;