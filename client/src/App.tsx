import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalAudioProvider } from '@/hooks/useGlobalAudio';
import { GlobalAudioBar } from '@/components/GlobalAudioBar';
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
