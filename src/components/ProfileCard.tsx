import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, Squad } from '../types';
import UserAvatar from './UserAvatar';
import { Shield, Target, Calendar, Award, Sparkles, Heart } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  squads: Squad[];
  id?: string;
}

export default function ProfileCard({ profile, squads, id }: ProfileCardProps) {
  // Compute user squads & likes
  const userSquads = squads.filter(s => s.userId === profile.id);
  const totalLikes = userSquads.reduce((acc, squad) => acc + (squad.likes || 0), 0);
  
  // Aura is calculated dynamically based on average squad ratings and chemistry
  const averageRating = userSquads.length > 0
    ? Math.round(userSquads.reduce((acc, sq) => acc + (sq.rating || 0), 0) / userSquads.length)
    : 0;
  const averageChem = userSquads.length > 0
    ? Math.round(userSquads.reduce((acc, sq) => acc + (sq.chemistry || 0), 0) / userSquads.length)
    : 0;

  // Final Gaffer Aura Score
  const auraScore = profile.auraScore || (userSquads.length > 0 
    ? Math.round((averageRating * 0.6) + (averageChem * 0.4) + (totalLikes * 5))
    : 45); // Baseline aura score of 45

  const joinDate = profile.createdAt || 'May 2026';

  return (
    <div
      id={id || `profile-card-${profile.id}`}
      className="bg-gradient-to-r from-slate-900 via-[#141225] to-[#08070d] border-2 border-violet-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center select-none w-full"
    >
      {/* Decorative background grids */}
      <div className="absolute inset-0 bg-[#000]/10 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-violet-600/10 to-transparent blur-2xl pointer-events-none" />

      {/* Pulsing Avatar Frame */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-purple-600 to-yellow-500 blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />
        <UserAvatar profile={profile} size="xl" className="border-4 border-slate-900 shadow-2xl relative z-10" />
      </div>

      {/* Main Details and Bios */}
      <div className="flex-1 text-center md:text-left font-sans relative z-10">
        <div className="flex flex-wrap items-center gap-2.5 justify-center md:justify-start">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-gray-400 uppercase tracking-tight">
            @{profile.username}
          </h2>
          <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-1 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-500">
            GAFFER MASTER
          </span>
        </div>

        <p className="text-xs text-gray-400 font-mono mt-1 pr-1 flex items-center justify-center md:justify-start gap-1">
          <span>{profile.email}</span>
          <span className="text-white/25">•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-500" /> Joined {joinDate}
          </span>
        </p>

        <p className="text-xs text-slate-300 font-mono italic mt-4 max-w-md bg-black/25 p-3 rounded-xl border border-white/5 mx-auto md:mx-0 leading-relaxed text-center md:text-left">
          "{profile.bio || 'New Dream XI Gaffer!'}"
        </p>

        {/* Tactical Badges row */}
        <div className="flex flex-wrap gap-2.5 justify-center md:justify-start items-center mt-4.5 font-mono text-[9px] text-gray-400 uppercase tracking-widest leading-none">
          <span className="flex items-center gap-1.5 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-white/5 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-yellow-400" /> CLUB: <strong className="text-white">{profile.favoriteClub || 'Real Madrid'}</strong>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-white/5 shadow-sm">
            <Target className="w-3.5 h-3.5 text-emerald-400" /> STAR: <strong className="text-white">{profile.favoritePlayer || 'Cristiano Ronaldo'}</strong>
          </span>
        </div>
      </div>

      {/* Dynamic Gaffer Bio metrics / Stats Bento widgets */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:grid-cols-4 shrink-0 font-mono text-center w-full md:w-auto mt-4 md:mt-0 relative z-10">
        <div className="bg-[#12111d]/90 border border-white/5 hover:border-emerald-500/20 p-3.5 pb-4 min-w-[125px] rounded-2xl transition duration-300 shadow-lg flex flex-col justify-center items-center">
          <span className="text-[8px] text-gray-400 font-black tracking-wider block mb-1">AURA RATING</span>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 block flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-400 animate-bounce" /> {auraScore}
          </span>
        </div>

        <div className="bg-[#12111d]/90 border border-white/5 hover:border-yellow-400/20 p-3.5 pb-4 min-w-[125px] rounded-2xl transition duration-300 shadow-lg flex flex-col justify-center items-center">
          <span className="text-[8px] text-gray-400 font-black tracking-wider block mb-1">LIKES RECEIVED</span>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 block flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500 animate-pulse fill-red-500" /> {totalLikes}
          </span>
        </div>

        <div className="bg-[#12111d]/90 border border-white/5 hover:border-sky-500/20 p-3.5 pb-4 min-w-[125px] rounded-2xl transition duration-300 shadow-lg flex flex-col justify-center items-center md:hidden lg:flex">
          <span className="text-[8px] text-gray-400 font-black tracking-wider block mb-1">SQUADS CREATED</span>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300 block">
            {userSquads.length}
          </span>
        </div>

        <div className="bg-[#12111d]/90 border border-white/5 hover:border-emerald-500/20 p-3.5 pb-4 min-w-[125px] rounded-2xl transition duration-300 shadow-lg flex flex-col justify-center items-center md:hidden lg:flex">
          <span className="text-[8px] text-gray-400 font-black tracking-wider block mb-1">WIN RATE</span>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 block">
            {profile.winRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
