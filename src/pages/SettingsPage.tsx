import { UserProfile, Squad } from '../types';
import UserProfileView from '../components/UserProfileView';

interface SettingsPageProps {
  profile: UserProfile;
  squadsList: Squad[];
  onUpdateProfile: (p: UserProfile) => void;
  onLoadSquad: (sq: Squad) => void;
  onDeleteSquad: () => void;
}

export default function SettingsPage({
  profile,
  squadsList,
  onUpdateProfile,
  onLoadSquad,
  onDeleteSquad,
}: SettingsPageProps) {
  return (
    <div id="settings-page-root" className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-outfit">
            ⚙️ Account Settings
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wide">
            Update your Gaffer username, select custom profile badges, and refine your favorite legends.
          </p>
        </div>
      </div>

      <UserProfileView
        profile={profile}
        squadsList={squadsList}
        onUpdateProfile={onUpdateProfile}
        onLoadSquad={onLoadSquad}
        onDeleteSquad={onDeleteSquad}
        initialEditing={true}
      />
    </div>
  );
}
