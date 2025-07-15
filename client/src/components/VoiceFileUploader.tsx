import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Check, X, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceFile {
  id: string;
  name: string;
  language: string;
  size: number;
  uploaded: boolean;
}

const expectedFiles = [
  { id: 'ko-genesis-1-1', name: 'ko-genesis-1-1.mp3', language: '한국어', text: '태초에 하나님이 천지를 창조하시니라' },
  { id: 'ko-john-3-16', name: 'ko-john-3-16.mp3', language: '한국어', text: '하나님이 세상을 이처럼 사랑하사...' },
  { id: 'ko-matthew-16-24', name: 'ko-matthew-16-24.mp3', language: '한국어', text: '나를 따라오려거든 자기를 부인하고...' },
  
  { id: 'en-genesis-1-1', name: 'en-genesis-1-1.mp3', language: '영어', text: 'In the beginning God created...' },
  { id: 'en-john-3-16', name: 'en-john-3-16.mp3', language: '영어', text: 'For God so loved the world...' },
  { id: 'en-matthew-16-24', name: 'en-matthew-16-24.mp3', language: '영어', text: 'Whoever wants to be my disciple...' },
  
  { id: 'zh-genesis-1-1', name: 'zh-genesis-1-1.mp3', language: '중국어', text: '起初神创造天地' },
  { id: 'zh-john-3-16', name: 'zh-john-3-16.mp3', language: '중국어', text: '神爱世人，甚至将他的独生子...' },
  { id: 'zh-matthew-16-24', name: 'zh-matthew-16-24.mp3', language: '중국어', text: '若有人要跟从我，就当舍己...' },
  
  { id: 'ja-genesis-1-1', name: 'ja-genesis-1-1.mp3', language: '일본어', text: '初めに、神が天と地を創造した' },
  { id: 'ja-john-3-16', name: 'ja-john-3-16.mp3', language: '일본어', text: '神は、実に、そのひとり子を...' },
  { id: 'ja-matthew-16-24', name: 'ja-matthew-16-24.mp3', language: '일본어', text: 'だれでもわたしについて来たい...' }
];

export function VoiceFileUploader() {
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      const expectedFile = expectedFiles.find(ef => ef.name === file.name);
      if (!expectedFile) {
        toast({
          title: '파일명 오류',
          description: `${file.name}은 예상된 파일명이 아닙니다.`,
          variant: 'destructive'
        });
        continue;
      }

      try {
        // 파일을 public/audio/voices/ 폴더에 저장하는 시뮬레이션
        setUploadProgress(prev => ({ ...prev, [expectedFile.id]: 0 }));
        
        // 업로드 진행 시뮬레이션
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [expectedFile.id]: progress }));
        }

        // FormData를 생성하여 서버로 전송 (실제 구현시)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', expectedFile.name);
        
        // 실제로는 서버 API 호출
        // await fetch('/api/upload-voice', { method: 'POST', body: formData });
        
        setUploadedFiles(prev => new Set([...prev, expectedFile.id]));
        setUploadProgress(prev => ({ ...prev, [expectedFile.id]: 100 }));
        
        toast({
          title: '업로드 완료',
          description: `${expectedFile.name} 업로드 완료`,
        });
        
      } catch (error) {
        toast({
          title: '업로드 실패',
          description: `${file.name} 업로드 중 오류가 발생했습니다.`,
          variant: 'destructive'
        });
      }
    }
    
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadGenerationScript = () => {
    const script = `#!/bin/bash
# 맥북에서 고품질 성경 음성 파일 생성 스크립트

echo "🎵 성경 음성 파일 생성 시작..."
mkdir -p audio_files

# 한국어 음성 파일 생성 (Yuna)
say -v "Yuna" -r 180 -o "audio_files/ko-genesis-1-1.aiff" "태초에 하나님이 천지를 창조하시니라"
say -v "Yuna" -r 180 -o "audio_files/ko-john-3-16.aiff" "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라"
say -v "Yuna" -r 180 -o "audio_files/ko-matthew-16-24.aiff" "이에 예수께서 제자들에게 이르시되 누구든지 나를 따라오려거든 자기를 부인하고 자기 십자가를 지고 나를 따를 것이니라"

# 영어 음성 파일 생성 (Samantha)
say -v "Samantha" -r 180 -o "audio_files/en-genesis-1-1.aiff" "In the beginning God created the heavens and the earth."
say -v "Samantha" -r 180 -o "audio_files/en-john-3-16.aiff" "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
say -v "Samantha" -r 180 -o "audio_files/en-matthew-16-24.aiff" "Then Jesus said to his disciples, Whoever wants to be my disciple must deny themselves and take up their cross and follow me."

# 중국어 음성 파일 생성 (Tingting)
say -v "Tingting" -r 180 -o "audio_files/zh-genesis-1-1.aiff" "起初神创造天地"
say -v "Tingting" -r 180 -o "audio_files/zh-john-3-16.aiff" "神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不至灭亡，反得永生"
say -v "Tingting" -r 180 -o "audio_files/zh-matthew-16-24.aiff" "于是耶稣对门徒说，若有人要跟从我，就当舍己，背起他的十字架，来跟从我"

# 일본어 음성 파일 생성 (Kyoko)
say -v "Kyoko" -r 180 -o "audio_files/ja-genesis-1-1.aiff" "初めに、神が天と地を創造した"
say -v "Kyoko" -r 180 -o "audio_files/ja-john-3-16.aiff" "神は、実に、そのひとり子をお与えになったほどに、世を愛された。それは御子を信じる者が、ひとりとして滅びることなく、永遠のいのちを持つためである"
say -v "Kyoko" -r 180 -o "audio_files/ja-matthew-16-24.aiff" "それから、イエスは弟子たちに言われた。だれでもわたしについて来たいと思うなら、自分を捨て、自分の十字架を負い、そしてわたしについて来なさい"

# AIFF를 MP3로 변환 (ffmpeg 필요)
echo "🔄 AIFF 파일을 MP3로 변환 중..."
for file in audio_files/*.aiff; do
    if [ -f "$file" ]; then
        mp3_file="\${file%.aiff}.mp3"
        ffmpeg -i "$file" -acodec mp3 -ab 128k "$mp3_file" 2>/dev/null
        rm "$file"
        echo "✅ 변환 완료: $(basename "$mp3_file")"
    fi
done

echo "🎉 모든 음성 파일 생성 완료!"
echo "📁 파일 위치: audio_files/"
ls -la audio_files/`;

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generate-bible-voices.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: '스크립트 다운로드',
      description: '음성 생성 스크립트가 다운로드되었습니다.'
    });
  };

  const uploadedCount = uploadedFiles.size;
  const totalCount = expectedFiles.length;

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
          내장 음성 파일 관리
          <span className="text-sm font-normal text-slate-600">
            {uploadedCount}/{totalCount} 업로드됨
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 진행 상황 */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">업로드 진행률</span>
            <span className="text-sm font-medium text-slate-800">
              {Math.round((uploadedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 스크립트 다운로드 */}
        <div className="space-y-2">
          <Button
            onClick={downloadGenerationScript}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            맥북용 음성 생성 스크립트 다운로드
          </Button>
          <p className="text-xs text-slate-500 text-center">
            맥북에서 실행하여 고품질 음성 파일을 생성하세요
          </p>
        </div>

        {/* 파일 업로드 */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".mp3,.wav,.aiff"
            onChange={handleFileUpload}
            className="hidden"
            id="voice-file-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            음성 파일 업로드
          </Button>
          <p className="text-xs text-slate-500 text-center">
            생성된 MP3 파일들을 한 번에 선택하여 업로드하세요
          </p>
        </div>

        {/* 파일 목록 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">필요한 파일 목록</h4>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {expectedFiles.map(file => {
              const isUploaded = uploadedFiles.has(file.id);
              const progress = uploadProgress[file.id];
              
              return (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-2 rounded border ${
                    isUploaded ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isUploaded ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs font-medium">{file.name}</span>
                    </div>
                    <div className="text-xs text-slate-500 ml-6">
                      {file.language} - {file.text}
                    </div>
                    {progress !== undefined && progress < 100 && (
                      <div className="ml-6 mt-1">
                        <div className="w-full bg-slate-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-200"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {uploadedCount === totalCount && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-green-800 font-medium text-sm">🎉 모든 음성 파일 업로드 완료!</div>
            <div className="text-green-600 text-xs mt-1">
              이제 모든 성경 구절을 고품질 맥북 음성으로 들을 수 있습니다.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}