import { Home, Play, Bookmark, Settings, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BottomNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function BottomNavigation({ currentPath, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/player', icon: Play, label: '플레이어' },
    { path: '/progress', icon: TrendingUp, label: '통독진도' },
    { path: '/bookmarks', icon: Bookmark, label: '북마크' },
    { path: '/settings', icon: Settings, label: '설정' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = currentPath === path;
            return (
              <Button
                key={path}
                variant="ghost"
                onClick={() => onNavigate(path)}
                className={`flex flex-col items-center py-3 px-3 rounded-xl transition-all transform hover:scale-105 ${
                  isActive
                    ? 'bg-amber-50 hover:bg-amber-100 shadow-sm'
                    : 'hover:bg-slate-50'
                }`}
              >
                <Icon 
                  className={`text-lg h-5 w-5 ${
                    isActive ? 'text-amber-800' : 'text-slate-500'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium mt-1 ${
                    isActive ? 'text-amber-800' : 'text-slate-600'
                  }`}
                >
                  {label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
