import { Squad } from '../types';
import LeaderboardsView from '../components/LeaderboardsView';

interface RankingsPageProps {
  squadsList: Squad[];
}

export default function RankingsPage({ squadsList }: RankingsPageProps) {
  return (
    <div id="rankings-page-root" className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-outfit">
            🏆 Manager Rankings
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wide">
            Track top-performing squads, check overall tactical depth, and claim the championship throne.
          </p>
        </div>
      </div>

      <LeaderboardsView squadsList={squadsList} />
    </div>
  );
}
