import { Battle, Squad } from '../types';
import BattleArena from '../components/BattleArena';
import { useTranslation } from '../lib/LanguageContext';

interface LiveDebatesPageProps {
  userId: string;
  userName: string;
  battles: Battle[];
  squadsList: Squad[];
  onRefreshBattles: () => Promise<void>;
}

export default function LiveDebatesPage({
  userId,
  userName,
  battles,
  squadsList,
  onRefreshBattles,
}: LiveDebatesPageProps) {
  const { t } = useTranslation();
  return (
    <div id="live-debates-page-root" className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-outfit">
            {t("⚔️ Live Debates")}
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wide">
            {t("Vote and debate real-world match predictions, and earn valuable manager rankings.")}
          </p>
        </div>
      </div>

      <BattleArena
        userId={userId}
        userName={userName}
        battles={battles}
        squadsList={squadsList}
        onRefreshBattles={onRefreshBattles}
      />
    </div>
  );
}
