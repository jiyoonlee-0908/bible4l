import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings } from '@shared/schema';

interface DSPControlsProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
}

export function DSPControls({ settings, onUpdateSettings }: DSPControlsProps) {
  const updateDSP = (dspSettings: Partial<Settings['dsp']>) => {
    onUpdateSettings({
      dsp: { ...settings.dsp, ...dspSettings }
    });
  };

  const updateEQ = (band: keyof Settings['dsp']['eq'], value: number) => {
    updateDSP({
      eq: { ...settings.dsp.eq, [band]: value }
    });
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">음향 효과 (DSP)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Effects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">에코 효과</label>
            <Switch
              checked={settings.dsp.echo}
              onCheckedChange={(echo) => updateDSP({ echo })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">리버브 효과</label>
            <Switch
              checked={settings.dsp.reverb}
              onCheckedChange={(reverb) => updateDSP({ reverb })}
            />
          </div>
        </div>

        {/* Pitch Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            음성 톤 ({settings.pitch > 0 ? '+' : ''}{settings.pitch} 반음)
          </label>
          <div className="px-2">
            <Slider
              value={[settings.pitch]}
              onValueChange={([value]) => onUpdateSettings({ pitch: value })}
              min={-4}
              max={4}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>낮음 (-4)</span>
            <span>기본 (0)</span>
            <span>높음 (+4)</span>
          </div>
        </div>

        {/* EQ Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-700">이퀄라이저 (3-Band EQ)</h4>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-600">
              저음 ({settings.dsp.eq.low > 0 ? '+' : ''}{settings.dsp.eq.low}dB)
            </label>
            <Slider
              value={[settings.dsp.eq.low]}
              onValueChange={([value]) => updateEQ('low', value)}
              min={-10}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-600">
              중음 ({settings.dsp.eq.mid > 0 ? '+' : ''}{settings.dsp.eq.mid}dB)
            </label>
            <Slider
              value={[settings.dsp.eq.mid]}
              onValueChange={([value]) => updateEQ('mid', value)}
              min={-10}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-600">
              고음 ({settings.dsp.eq.high > 0 ? '+' : ''}{settings.dsp.eq.high}dB)
            </label>
            <Slider
              value={[settings.dsp.eq.high]}
              onValueChange={([value]) => updateEQ('high', value)}
              min={-10}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500">
            <span>-10dB</span>
            <span>0dB</span>
            <span>+10dB</span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            onUpdateSettings({
              pitch: 0,
              dsp: {
                echo: false,
                reverb: false,
                eq: { low: 0, mid: 0, high: 0 }
              }
            });
          }}
          className="w-full text-sm text-slate-600 hover:text-slate-800 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          모든 효과 초기화
        </button>
      </CardContent>
    </Card>
  );
}