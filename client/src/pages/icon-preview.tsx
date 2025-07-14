import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';

export default function IconPreview() {
  const [, setLocation] = useLocation();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const icons = [
    { id: 'bible-icon-1', name: '아이콘 1', description: '상단 4개 국기 배치' },
    { id: 'bible-icon-2', name: '아이콘 2', description: '모서리 국기 배치' },
    { id: 'bible-icon-3', name: '아이콘 3', description: '가로 스트립 국기 배치' },
    { id: 'bible-icon-4', name: '아이콘 4', description: '헤드폰 + 가로 국기 배치' },
    { id: 'bible-icon-5', name: '아이콘 5', description: '큰 헤드폰 + 격자 국기 배치' },
  ];

  const handleSelectIcon = (iconId: string) => {
    setSelectedIcon(iconId);
    // Here you would update the app to use this icon
    console.log('Selected icon:', iconId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800">아이콘 선택</h1>
        </div>

        <div className="space-y-4">
          {icons.map((icon) => (
            <Card 
              key={icon.id} 
              className={`cursor-pointer transition-all ${
                selectedIcon === icon.id 
                  ? 'ring-2 ring-amber-500 bg-amber-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSelectIcon(icon.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{icon.name}</CardTitle>
                  {selectedIcon === icon.id && (
                    <Check className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <p className="text-sm text-slate-600">{icon.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-center">
                  <img 
                    src={`/${icon.id}.svg`} 
                    alt={icon.name}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedIcon && (
          <div className="mt-6">
            <Button 
              className="w-full bg-amber-800 hover:bg-amber-900"
              onClick={() => {
                // Apply the selected icon
                setLocation('/');
              }}
            >
              이 아이콘 사용하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}