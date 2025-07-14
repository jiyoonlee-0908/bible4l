import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@shared/schema';

interface BadgeDisplayProps {
  badges: Badge[];
  title: string;
  showLocked?: boolean;
}

export function BadgeDisplay({ badges, title, showLocked = true }: BadgeDisplayProps) {
  const unlockedBadges = badges.filter(badge => badge.unlockedAt);
  const lockedBadges = badges.filter(badge => !badge.unlockedAt);

  const getBadgeIcon = (iconType: Badge['iconType'], metallic: boolean, unlocked: boolean) => {
    const icons = {
      streak: unlocked ? '🔥' : '⚫',
      time: unlocked ? '⏰' : '⚫', 
      completion: unlocked ? '🎯' : '⚫',
      special: unlocked ? '⭐' : '⚫',
    };

    const icon = icons[iconType];
    return metallic && unlocked ? `✨${icon}✨` : icon;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-slate-600">
            {unlockedBadges.length}/{badges.length}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {/* Unlocked Badges */}
          {unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                badge.metallic
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-300 shadow-md'
                  : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {getBadgeIcon(badge.iconType, badge.metallic, true)}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-600 mb-1">
                  {badge.description}
                </p>
                {badge.unlockedAt && (
                  <p className="text-xs text-slate-500">
                    {formatDate(badge.unlockedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Locked Badges */}
          {showLocked && lockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-3 rounded-xl border-2 border-slate-200 bg-slate-50 opacity-60"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {getBadgeIcon(badge.iconType, badge.metallic, false)}
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-1">
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {unlockedBadges.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              첫 배지를 획득해보세요!
            </h3>
            <p className="text-sm text-slate-600">
              성경을 듣고, 통독 계획을 진행하며 다양한 배지를 모아보세요.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}