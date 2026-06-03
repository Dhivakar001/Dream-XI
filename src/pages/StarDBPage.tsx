import { Squad } from '../types';
import LegendsDatabase from '../components/LegendsDatabase';
import { useTranslation } from '../lib/LanguageContext';

interface StarDBPageProps {
  onSetSquad: (squad: Squad) => void;
}

export default function StarDBPage({ onSetSquad }: StarDBPageProps) {
  const { t } = useTranslation();
  return (
    <div id="star-db-page-root" className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-outfit">
            {t("🔍 Star database")}
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wide">
            {t("Explore world-class legends, check card ratings, and build squads around tactical pillars.")}
          </p>
        </div>
      </div>

      <LegendsDatabase onSetSquad={onSetSquad} />
    </div>
  );
}
