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
    <nav className="max-w-md mx-auto px-4 pb-4 sticky bottom-4">
      <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <CardContent className="p-2">
          <div className="flex items-center justify-around">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = currentPath === path;
              return (
                <Button
                  key={path}
                  variant="ghost"
                  onClick={() => onNavigate(path)}
                  className={`flex flex-col items-center py-3 px-4 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-amber-50 hover:bg-amber-100'
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
        </CardContent>
      </Card>
    </nav>
  );
}
