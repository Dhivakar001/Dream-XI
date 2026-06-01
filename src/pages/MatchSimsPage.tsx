import { Squad } from '../types';
import MatchSimulator from '../components/MatchSimulator';

interface MatchSimsPageProps {
  userSquad: Squad | null;
  savedSquads: Squad[];
}

export default function MatchSimsPage({ userSquad, savedSquads }: MatchSimsPageProps) {
  return (
    <div id="match-sims-page-root" className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-outfit">
            🤖 Match Simulator
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wide">
            Run instant simulations of your squad against server squads to calculate expected performance.
          </p>
        </div>
      </div>

      <MatchSimulator
        userSquad={userSquad}
        savedSquads={savedSquads}
      />
    </div>
  );
}
