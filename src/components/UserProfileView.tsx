import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Shield, Target, Award, Edit3, Save, Star, CheckCircle, MessageSquare } from 'lucide-react';
import { UserProfile, Squad } from '../types';
import { playFutSound } from '../utils';

interface UserProfileViewProps {
  profile: UserProfile;
  squadsList: Squad[];
  onUpdateProfile: (newProfile: UserProfile) => void;
}

export default function UserProfileView({
  profile,
  squadsList,
  onUpdateProfile,
}: UserProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [updating, setUpdating] = useState(false);

  // Unlocked coach milestones based on metrics
  const coachBadges = [
    { title: 'TACTICIAN MASTER', level: 'Level 4 Expert', desc: 'Mapped advanced 4-3-3 chemistry setups.', icon: '🛡️' },
    { title: 'HYMAN AURA INDEXER', level: 'Level 5 Lord', desc: 'Maintained squad aura combined ratings above 93%.', icon: '🔥' },
    { title: 'DEBATE CHAMPION', level: 'Level 2 Talker', desc: 'Garnered over 50 combat arena votes.', icon: '📢' }
  ];

  const handleUpdate = async () => {
    if (!userName.trim()) return;

    setUpdating(true);
    playFutSound('success');
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, bio }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        onUpdateProfile({
          ...profile,
          username: userName,
          bio,
        });
      }
    } catch (err) {
      console.error('Failed to update user telemetry profile', err);
    } finally {
      setUpdating(false);
    }
  };

  const userSquads = squadsList.filter(s => s.userId === profile.id);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 select-none">
      
      {/* 1. Header Hero Panel with glass overlay */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0e215c]/60 border border-white/5 p-6 rounded-3xl backdrop-blur shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center select-none mb-6">
        {/* Animated grid effects */}
        <div className="absolute inset-0 bg-radial from-[#10b981]/5 to-transparent pointer-events-none select-none" />

        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-yellow-400 flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(234,179,8,0.25)] select-none shrink-0">
          👑
        </div>

        <div className="flex-1 text-center md:text-left font-sans">
          {isEditing ? (
            <div className="flex flex-col gap-2 font-mono text-xs max-w-md">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Edit tactician moniker..."
                className="bg-black border border-white/10 text-white rounded-lg p-2 focus:outline-none focus:border-yellow-400 text-xs font-bold w-full"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Edit tactical bio..."
                className="bg-black border border-white/10 text-white rounded-lg p-2 focus:outline-none focus:border-yellow-400 text-xs w-full"
              />
              <div className="flex gap-2 justify-end mt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-slate-800 text-white rounded uppercase text-[10px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="px-3 py-1 bg-yellow-400 text-black font-black rounded uppercase text-[10px]"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-xl font-black text-white uppercase tracking-tight">@{profile.username}</h1>
                <button
                  onClick={() => { playFutSound('click'); setIsEditing(true); }}
                  className="p-1 rounded bg-black/30 border border-white/5 text-gray-400 hover:text-yellow-400 cursor-pointer"
                  title="Configure profile narrative"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 font-mono italic mt-1.5 truncate max-w-md">
                "{profile.bio}"
              </p>
              
              <div className="flex gap-4 justify-center md:justify-start items-center mt-3 font-mono text-[10px] text-gray-400 uppercase">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-yellow-400" /> Moniker: GAFFER XI
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-emerald-400" /> RANKING: BRONZE II
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Total stats counters */}
        <div className="grid grid-cols-2 gap-3 shrink-0 font-mono text-center">
          <div className="bg-black/40 border border-white/5 p-3 rounded-xl min-w-[100px]">
            <span className="text-[9px] text-gray-500 tracking-wider block mb-1">WIN RATE:</span>
            <span className="text-lg font-black text-[#10b981]">{profile.winRate}%</span>
          </div>
          <div className="bg-black/40 border border-white/5 p-3 rounded-xl min-w-[100px]">
            <span className="text-[9px] text-gray-500 tracking-wider block mb-1">TOTAL LOCKS:</span>
            <span className="text-lg font-black text-yellow-400">{userSquads.length} XI</span>
          </div>
        </div>
      </div>

      {/* Main Grid bento layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Achieved Coach Milestones Badges (Col 1) */}
        <div className="md:col-span-6 bg-slate-900/80 border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block border-b border-white/5 pb-2">
            <Award className="w-4 h-4 text-yellow-400 inline mr-1 mb-0.5" />
            UNLOCKED COOPERATIVE GAFFER BADGES
          </span>

          <div className="flex flex-col gap-3">
            {coachBadges.map((bad, idx) => (
              <div key={idx} className="bg-black/40 border border-white/5 hover:border-[#ffe58f]/10 p-3.5 rounded-xl flex gap-3.5 items-center transition">
                <div className="text-3xl shrink-0 select-none">{bad.icon}</div>
                <div className="leading-tight">
                  <span className="font-sans font-black text-xs text-white block uppercase tracking-tight">{bad.title}</span>
                  <span className="text-[9px] text-yellow-500 mt-1 block uppercase tracking-wider">{bad.level}</span>
                  <p className="text-[10px] text-gray-400 leading-normal mt-1 font-sans font-bold">{bad.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Created Tactical Squads layout list (Col 2) */}
        <div className="md:col-span-6 bg-slate-900/80 border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block border-b border-white/5 pb-2">
            📂 MY REGISTERED TACTICAL SQUADS ({userSquads.length})
          </span>

          <div className="flex-1 max-h-[350px] overflow-y-auto flex flex-col gap-3">
            {userSquads.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-mono text-xs">
                No active squads registered. Use builder tab to draft!
              </div>
            ) : (
              userSquads.map(sq => (
                <div key={sq.id} className="bg-black/30 border border-white/5 hover:border-white/10 p-4 rounded-xl flex items-center justify-between gap-4 transition">
                  <div>
                    <span className="font-sans font-black text-xs text-white block uppercase truncate max-w-[180px]">{sq.name}</span>
                    <p className="text-[9px] text-gray-500 uppercase font-mono tracking-widest mt-1">
                      OVR: <strong className="text-white">{sq.rating} OVR</strong> • CHEM: <strong className="text-[#10b981]">{sq.chemistry}%</strong>
                    </p>
                  </div>

                  <span className="px-3 py-1.5 rounded-lg bg-emerald-900/20 text-[#10b981] text-[9px] border border-emerald-500/10 uppercase tracking-widest leading-none">
                    LOCKED
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
