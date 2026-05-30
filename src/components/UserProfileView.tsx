import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Shield, Target, Award, Edit3, Save, Star, CheckCircle, MessageSquare, Sparkles, Flame, Trophy } from 'lucide-react';
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
    { title: '🥇 TACTICIAN MASTER', level: 'Level 10 GOD', desc: 'Mapped advanced perfect chemistry setups in Pitch Builder.', bg: 'from-amber-500/10 via-yellow-600/5 to-transparent', border: 'border-yellow-500/30 text-yellow-500' },
    { title: '🔥 HYMAN AURA INDEXER', level: 'MAX LEVEL', desc: 'Maintained squad combined ratings above 95% across drafts.', bg: 'from-red-500/10 via-pink-600/5 to-transparent', border: 'border-pink-500/30 text-pink-400' },
    { title: '📢 DEBATE CHAMPION', level: 'ULTIMATE GAF', desc: 'Voted top tactician and generated arguments in Battle Arena.', bg: 'from-blue-500/10 via-indigo-600/5 to-transparent', border: 'border-teal-500/30 text-teal-400' }
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
    <div className="w-full max-w-5xl mx-auto p-4 select-none">
      
      {/* 1. Header Hero Panel with premium futuristic background & glowing aura */}
      <div className="bg-gradient-to-r from-slate-900 via-[#141225] to-[#08070d] border-2 border-violet-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center select-none mb-8">
        
        {/* Animated matrix grid & pulsing background lights */}
        <div className="absolute inset-0 bg-[#000]/10 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-violet-600/15 to-transparent blur-2xl pointer-events-none" />

        <div className="relative group">
          {/* Animated Halo Outline ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-500 blur opacity-75 group-hover:opacity-100 transition animate-spin-slow duration-5000" />
          
          <div className="relative w-20 h-20 rounded-full bg-slate-950 border-2 border-yellow-400 flex items-center justify-center text-4xl shadow-xl select-none shrink-0 font-sans">
            👑
          </div>
        </div>

        <div className="flex-1 text-center md:text-left font-sans relative z-10">
          {isEditing ? (
            <div className="flex flex-col gap-2 font-mono text-xs max-w-sm mx-auto md:mx-0">
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
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-gray-400 uppercase tracking-tight">@{profile.username}</h1>
                <button
                  onClick={() => { playFutSound('click'); setIsEditing(true); }}
                  className="p-1 px-1.5 rounded-full bg-black/40 border border-white/10 text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 cursor-pointer active:scale-90 transition"
                  title="Configure profile narrative"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 font-mono italic mt-2.5 max-w-md bg-black/25 p-2 rounded-lg border border-white/5 mx-auto md:mx-0 text-center md:text-left leading-normal">
                "{profile.bio}"
              </p>
              
              <div className="flex gap-3 justify-center md:justify-start items-center mt-3.5 font-mono text-[9px] text-gray-400 uppercase tracking-widest leading-none">
                <span className="flex items-center gap-1 bg-slate-800/40 px-2 py-1 rounded-md border border-white/5">
                  <Shield className="w-3 h-3 text-yellow-400" /> Moniker: GAFFER XI
                </span>
                <span className="flex items-center gap-1 bg-slate-800/40 px-2 py-1 rounded-md border border-white/5">
                  <Target className="w-3 h-3 text-emerald-400" /> POSITION: GOLD GOD
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Total stats counters styled as modern bento items */}
        <div className="grid grid-cols-2 gap-3 shrink-0 font-mono text-center w-full md:w-auto mt-4 md:mt-0 relative z-10 select-none">
          <div className="bg-[#12111d] border border-white/5 hover:border-emerald-500/20 p-4 rounded-xl flex-1 md:min-w-[120px] transition duration-300">
            <span className="text-[8px] text-gray-400 tracking-wider block mb-1">ARENA WIN RATE:</span>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 block">{profile.winRate}%</span>
          </div>
          <div className="bg-[#12111d] border border-white/5 hover:border-yellow-400/20 p-4 rounded-xl flex-1 md:min-w-[120px] transition duration-300">
            <span className="text-[8px] text-gray-400 tracking-wider block mb-1">REGISTERED SQUADS:</span>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 block">{userSquads.length} XI</span>
          </div>
        </div>
      </div>

      {/* Main Grid bento layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Achieved Coach Milestones Badges (Col 1) */}
        <div className="md:col-span-6 bg-[#12111c] border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block border-b border-white/5 pb-2.5 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-yellow-400 inline" />
            UNLOCKED GAFFER ACHIEVEMENTS
          </span>

          <div className="flex flex-col gap-3">
            {coachBadges.map((bad, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${bad.bg} border ${bad.border} p-4 rounded-2xl flex gap-4 items-center transition hover:scale-[1.01]`}>
                <div className="text-3xl shrink-0 select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">🏆</div>
                <div className="leading-tight">
                  <span className="font-sans font-black text-xs text-white block uppercase tracking-tight">{bad.title}</span>
                  <span className="text-[8px] bg-slate-950/40 px-1.5 py-0.5 rounded border border-white/5 font-extrabold text-white mt-1.5 inline-block uppercase tracking-wider">{bad.level}</span>
                  <p className="text-[10px] text-gray-400 leading-normal mt-1.5 font-sans font-bold">{bad.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Created Tactical Squads layout list (Col 2) */}
        <div className="md:col-span-6 bg-[#12111c] border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block border-b border-white/5 pb-2.5">
            📂 MY REGISTERED TACTICAL SQUADS ({userSquads.length})
          </span>

          <div className="flex-1 max-h-[350px] overflow-y-auto flex flex-col gap-3 pr-1.5">
            {userSquads.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-mono text-xs">
                No active squads registered. Use builder tab to draft!
              </div>
            ) : (
              userSquads.map(sq => (
                <div key={sq.id} className="bg-black/30 border-2 border-white/5 hover:border-violet-500/20 p-4 rounded-2xl flex items-center justify-between gap-4 transition duration-300">
                  <div>
                    <span className="font-sans font-black text-xs text-white block uppercase truncate max-w-[180px]">{sq.name}</span>
                    <p className="text-[9px] text-gray-400 uppercase font-mono tracking-widest mt-1.5">
                      OVR: <strong className="text-white">{sq.rating} OVR</strong> • CHEM: <strong className="text-[#10b981]">{sq.chemistry}%</strong>
                    </p>
                  </div>

                  <span className="px-3 py-1.5 rounded-lg bg-emerald-900/20 text-[#10b981] text-[9px] border border-emerald-500/10 uppercase tracking-widest font-black leading-none">
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
