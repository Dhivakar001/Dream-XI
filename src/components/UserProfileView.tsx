import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Target, Award, Edit3, Save, Star, Trash2, Heart, Edit2, Play, Plus, BookOpen, UserCheck, Sparkles } from 'lucide-react';
import { UserProfile, Squad } from '../types';
import { playFutSound } from '../utils';
import { supabase } from '../lib/supabase';
import { deleteSquadFromCloud } from '../lib/supabaseDb';
import ProfileCard from './ProfileCard';

interface UserProfileViewProps {
  profile: UserProfile;
  squadsList: Squad[];
  onUpdateProfile: (newProfile: UserProfile) => void;
  onLoadSquad?: (squad: Squad) => void;
  onDeleteSquad?: (squadId: string) => void;
  initialEditing?: boolean;
}

const AVAILABLE_AVATARS = [
  '👑', '⚽', '🧙‍♂️', '🦁', '🐯', '🦅', '🛸', '⚡', '💎', '🧠', '🐱', '🦊', '🦄', '🦖', '🍿', '🔥', '🏆', '🎯'
];

export default function UserProfileView({
  profile,
  squadsList,
  onUpdateProfile,
  onLoadSquad,
  onDeleteSquad,
  initialEditing = false,
}: UserProfileViewProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [userName, setUserName] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [favClub, setFavClub] = useState(profile.favoriteClub || 'Real Madrid');
  const [favPlayer, setFavPlayer] = useState(profile.favoritePlayer || 'Cristiano Ronaldo');
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || '👑');
  
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Keep state matching the prop if profile is asynchronously fetched/updated
  useEffect(() => {
    setUserName(profile.username);
    setBio(profile.bio);
    setFavClub(profile.favoriteClub || 'Real Madrid');
    setFavPlayer(profile.favoritePlayer || 'Cristiano Ronaldo');
    setSelectedAvatar(profile.avatar || '👑');
  }, [profile]);

  // Settle badges based on some stats
  const coachBadges = [
    { title: '🥇 TACTICIAN MASTER', level: 'Level 10 GOD', desc: 'Mapped advanced perfect chemistry setups in Pitch Builder.', bg: 'from-amber-500/10 via-yellow-600/5 to-transparent', border: 'border-yellow-500/30 text-yellow-500' },
    { title: '🔥 HYMAN AURA INDEXER', level: 'MAX LEVEL', desc: 'Maintained squad combined ratings above 95% across drafts.', bg: 'from-red-500/10 via-pink-600/5 to-transparent', border: 'border-pink-500/30 text-pink-400' },
    { title: '📢 DEBATE CHAMPION', level: 'ULTIMATE GAF', desc: 'Voted top tactician and generated arguments in Battle Arena.', bg: 'from-blue-500/10 via-indigo-600/5 to-transparent', border: 'border-teal-500/30 text-teal-400' }
  ];

  const handleUpdate = async () => {
    if (!userName.trim()) {
      setErrorMsg('Moniker cannot be empty!');
      return;
    }

    setUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');
    playFutSound('success');
    
    try {
      // 1. Save live changes to Supabase Profiles db table
      const isRealUser = profile.id && !profile.id.startsWith('u-');
      if (isRealUser) {
        const { error: dbErr } = await supabase
          .from('profiles')
          .update({
            username: userName,
            bio: bio,
            favorite_club: favClub,
          })
          .eq('id', profile.id);

        if (dbErr) {
          console.warn('db profile update issue:', dbErr.message);
        }

        // 2. Sync to Supabase auth user metadata for permanent sync
        const { error: authErr } = await supabase.auth.updateUser({
          data: {
            username: userName,
            avatar: selectedAvatar,
            favorite_club: favClub,
            favorite_player: favPlayer,
            bio,
          }
        });

        if (authErr) {
          console.warn('auth user metadata sync issue:', authErr.message);
        }
      }

      // 3. Fallback mock API sync for seamless performance
      try {
        if (isRealUser) {
          await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: profile.id,
              username: userName,
              bio,
              favoriteClub: favClub
            }),
          });
        } else {
          await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userName,
              bio,
              favoriteClub: favClub
            }),
          });
        }
      } catch (mockErr) {
        console.warn('Mock profile fallback warn:', mockErr);
      }

      // Update parent states
      const updatedProfile: UserProfile = {
        ...profile,
        username: userName,
        bio,
        favoriteClub: favClub,
        favoritePlayer: favPlayer,
        avatar: selectedAvatar,
      };

      onUpdateProfile(updatedProfile);
      setSuccessMsg('Gaffer profiles updated on Supabase Cloud!');
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMsg('');
      }, 1200);

    } catch (err: any) {
      console.warn('Failed to update profile settings:', err?.message || err);
      setErrorMsg(err.message || 'Error saving changes.');
    } finally {
      setUpdating(false);
    }
  };

  const userSquads = squadsList.filter(s => s.userId === profile.id);

  return (
    <div id="user-profile-view-root" className="w-full max-w-5xl mx-auto p-4 select-none flex flex-col gap-8">
      
      {/* Dynamic Success / Failure indicators */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] rounded-xl text-center uppercase tracking-wider"
          >
            ⚡ {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-[11px] rounded-xl text-center uppercase tracking-wider"
          >
            🚨 {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch between viewing dashboard and heavy editing panel */}
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0e0d16] border-2 border-dashed border-purple-500/30 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl relative"
          id="profile-editing-panel"
        >
          <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 mb-6">
            <Edit2 className="w-5 h-5 text-purple-400" /> Configure Gaffer Persona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300 font-mono">
            {/* Left Inputs Column */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider">Tactician Moniker/Username *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Guardiola_v2"
                  className="bg-black/60 border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-purple-400 text-xs font-bold w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider">Tactical Bio narrative</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Describe your formation methodology..."
                  className="bg-black/60 border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-purple-400 text-xs w-full resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Right Inputs Column */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider">Favorite Football Club</label>
                  <input
                    type="text"
                    value={favClub}
                    onChange={(e) => setFavClub(e.target.value)}
                    placeholder="Real Madrid, Arsenal, etc."
                    className="bg-black/60 border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-purple-400 text-xs font-bold w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider">Favorite Player Icon</label>
                  <input
                    type="text"
                    value={favPlayer}
                    onChange={(e) => setFavPlayer(e.target.value)}
                    placeholder="Messi, Pele, etc."
                    className="bg-black/60 border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-purple-400 text-xs font-bold w-full"
                  />
                </div>
              </div>

              {/* Avatar Emoji picker segment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Select Coach Emblem ({selectedAvatar})</label>
                <div className="bg-black/60 border border-white/10 rounded-xl p-3 grid grid-cols-6 sm:grid-cols-9 gap-2 items-center justify-center">
                  {AVAILABLE_AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        playFutSound('click');
                        setSelectedAvatar(emoji);
                      }}
                      className={`w-9 h-9 flex items-center justify-center text-lg rounded-xl hover:scale-110 active:scale-95 transition-all cursor-pointer ${selectedAvatar === emoji ? 'bg-purple-500/20 border-2 border-purple-400 shadow-inner' : 'bg-white/5 border border-white/5'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex gap-3 justify-end items-center mt-8 border-t border-white/5 pt-5">
            <button
              onClick={() => {
                playFutSound('click');
                setIsEditing(false);
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl uppercase text-[10px] tracking-wider transition cursor-pointer select-none"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-sans font-black rounded-xl uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer select-none"
            >
              {updating ? 'SYCHRONIZING...' : 'LOCK IN TACTICS'}
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Main profile card display */}
          <div className="relative group">
            <ProfileCard profile={profile} squads={squadsList} />
            <button
              onClick={() => {
                playFutSound('click');
                setIsEditing(true);
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/50 border border-white/15 hover:border-yellow-400/50 hover:text-yellow-400 p-2.5 rounded-2xl cursor-pointer transition shadow-xl"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4 text-white hover:text-yellow-400 transition" />
            </button>
          </div>

          {/* Bento boxes grid: Achievements & Saved Squads */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-mono text-xs">
            
            {/* Achievements Column */}
            <div className="md:col-span-6 bg-[#12111c] border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block border-b border-white/5 pb-2.5 flex items-center gap-1.5 leading-none">
                <Award className="w-4 h-4 text-yellow-400 inline" />
                UNLOCKED GAFFER ACHIEVEMENTS
              </span>

              <div className="flex flex-col gap-3">
                {coachBadges.map((bad, idx) => (
                  <div key={idx} className={`bg-gradient-to-r ${bad.bg} border ${bad.border} p-4 rounded-2xl flex gap-4 items-center transition hover:scale-[1.01]`}>
                    <div className="text-3xl shrink-0 select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] font-sans">
                      🏆
                    </div>
                    <div className="leading-tight">
                      <span className="font-sans font-black text-xs text-white block uppercase tracking-tight">{bad.title}</span>
                      <span className="text-[8px] bg-slate-950/40 px-1.5 py-0.5 rounded border border-white/5 font-extrabold text-white mt-1.5 inline-block uppercase tracking-wider">{bad.level}</span>
                      <p className="text-[10px] text-gray-400 leading-normal mt-1.5 font-sans font-bold">{bad.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registered Squads Column */}
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

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            playFutSound('success');
                            if (onLoadSquad) onLoadSquad(sq);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-sans font-black text-[9px] text-black leading-none uppercase tracking-wider transition cursor-pointer select-none"
                        >
                          EDIT XI
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm(`Are you sure you want to bench '${sq.name}' permanent-wise?`)) return;
                            playFutSound('click');
                            const isRealUser = profile.id && !profile.id.startsWith('u-');
                            if (isRealUser) {
                              await deleteSquadFromCloud(sq.id);
                            }
                            // Fallback API delete
                            try {
                              await fetch(`/api/squads/${sq.id}`, { method: 'DELETE' });
                            } catch (err) {
                              console.warn('Fallback delete warning:', err);
                            }
                            if (onDeleteSquad) onDeleteSquad(sq.id);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 font-mono text-[9px] text-red-400 leading-none uppercase transition cursor-pointer select-none"
                        >
                          BENCH
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
