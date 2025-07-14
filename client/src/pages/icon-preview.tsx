import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';

export default function IconPreview() {
  const [, setLocation] = useLocation();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const icons = [
    { id: 'bible-icon-new1', name: '아이콘 1', description: '정확한 국기, 균등한 성경듣기 텍스트' },
    { id: 'bible-icon-new2', name: '아이콘 2', description: '십자가 장식, 진한 우드톤' },
    { id: 'bible-icon-new3', name: '아이콘 3', description: '고급 그림자, 최고 가독성' },
  ];

  const handleSelectIcon = (iconId: string) => {
    setSelectedIcon(iconId);
    // Update the main app icon
    updateAppIcon(iconId);
    console.log('Selected icon:', iconId);
  };

  const updateAppIcon = (iconId: string) => {
    // Update all icon references to use the selected icon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    const shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
    
    if (favicon) favicon.href = `/${iconId}.svg`;
    if (appleTouchIcon) appleTouchIcon.href = `/${iconId}.svg`;
    if (shortcutIcon) shortcutIcon.href = `/${iconId}.svg`;
    
    // Save selection to localStorage
    localStorage.setItem('selectedIcon', iconId);
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