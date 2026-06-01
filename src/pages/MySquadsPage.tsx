import { Squad } from '../types';
import MySquadsView from '../components/MySquadsView';

interface MySquadsPageProps {
  userId: string;
  squadsList: Squad[];
  onLoadSquad: (sq: Squad) => void;
  onDeleteSquad: () => void;
  onGoToBuilder: () => void;
}

export default function MySquadsPage({
  userId,
  squadsList,
  onLoadSquad,
  onDeleteSquad,
  onGoToBuilder,
}: MySquadsPageProps) {
  return (
    <div id="my-squads-page-root" className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-outfit">
            📂 Saved Squads
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wide">
            Browse and manage all lineups you have developed and saved either in cloud or offline local memory.
          </p>
        </div>
      </div>

      <MySquadsView
        userId={userId}
        squadsList={squadsList}
        onLoadSquad={onLoadSquad}
        onDeleteSquad={onDeleteSquad}
        onGoToBuilder={onGoToBuilder}
      />
    </div>
  );
}
