import { SocialPost, Squad } from '../types';
import SocialFeed from '../components/SocialFeed';
import { useTranslation } from '../lib/LanguageContext';

interface TrenchFeedPageProps {
  userId: string;
  userName: string;
  userBio: string;
  feedPosts: SocialPost[];
  onSetSquad: (squad: Squad) => void;
  onRefreshFeed: () => Promise<void>;
  onSwitchTab: (tab: string) => void;
}

export default function TrenchFeedPage({
  userId,
  userName,
  userBio,
  feedPosts,
  onSetSquad,
  onRefreshFeed,
  onSwitchTab,
}: TrenchFeedPageProps) {
  const { t } = useTranslation();
  return (
    <div id="trench-feed-page-root" className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-outfit">
            {t("📢 Trench Feed")}
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wide">
            {t("Interact with other gaffers, like their squads, and build your manager clout.")}
          </p>
        </div>
      </div>

      <SocialFeed
        userId={userId}
        userName={userName}
        userBio={userBio}
        feedPosts={feedPosts}
        onSetSquad={onSetSquad}
        onRefreshFeed={onRefreshFeed}
        onSwitchTab={onSwitchTab}
      />
    </div>
  );
}
