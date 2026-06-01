import { Player, Squad } from '../types';
import PitchBuilder from '../components/PitchBuilder';
import AIAnalysis from '../components/AIAnalysis';

interface TacticalPitchPageProps {
  userId: string;
  userName: string;
  availablePlayers: Player[];
  activeSquad?: Squad;
  squadForAnalysis: Squad | null;
  onSetSquad: (squad: Squad) => void;
  onAnalyzeSquad: (squad: Squad) => void;
}

export default function TacticalPitchPage({
  userId,
  userName,
  availablePlayers,
  activeSquad,
  squadForAnalysis,
  onSetSquad,
  onAnalyzeSquad,
}: TacticalPitchPageProps) {
  return (
    <div id="tactical-pitch-page-root" className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-outfit">
            📋 Tactical Pitch Builder
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wide">
            Draft your Ultimate Dream XI, customize formations, and get real-time tactical overview.
          </p>
        </div>
      </div>

      {/* Main Pitch Construction Arena */}
      <PitchBuilder
        userId={userId}
        userName={userName}
        availablePlayers={availablePlayers}
        activeSquad={activeSquad}
        onSetSquad={onSetSquad}
        onAnalyzeSquad={onAnalyzeSquad}
      />

      {/* Embedded dynamic commentary */}
      <AIAnalysis squad={squadForAnalysis} />
    </div>
  );
}
