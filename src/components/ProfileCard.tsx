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
      className="bg-black border-2 border-black p-6 md:p-8 rounded-3xl shadow-[8px_8px_0px_#FBE116] relative overflow-hidden flex flex-col md:flex-row gap-6 items-center select-none w-full text-left"
    >
      {/* Decorative background grids */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#009E49]/5 via-black to-[#002776]/5 pointer-events-none opacity-50" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#FBE116]/10 to-transparent blur-2xl pointer-events-none" />

      {/* Pulsing Avatar Frame */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#FBE116] via-[#009E49] to-[#002776] blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />
        <UserAvatar profile={profile} size="xl" className="border-4 border-black shadow-2xl relative z-10" />
      </div>

      {/* Main Details and Bios */}
      <div className="flex-1 text-center md:text-left font-sans relative z-10">
        <div className="flex flex-wrap items-center gap-2.5 justify-center md:justify-start">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic font-outfit">
            @{profile.username}
          </h2>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded bg-[#009E49] text-white border border-black shadow-[2px_2px_0px_#000]">
            🏆 MASTER GAFFER
          </span>
        </div>

        <p className="text-xs text-slate-350 font-mono mt-1 pr-1 flex items-center justify-center md:justify-start gap-1">
          <span>{profile.email}</span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-gray-500" /> Joined {joinDate}
          </span>
        </p>

        <p className="text-sm text-slate-250 font-sans italic mt-4 max-w-md bg-zinc-950 p-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.4)] mx-auto md:mx-0 leading-relaxed text-center md:text-left">
          "{profile.bio || 'New Ultimate Dream XI Gaffer!'}"
        </p>

        {/* Tactical Badges row */}
        <div className="flex flex-wrap gap-2.5 justify-center md:justify-start items-center mt-4.5 font-mono text-[9px] text-gray-400 uppercase tracking-widest leading-none">
          <span className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border-2 border-black shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#FBE116]" /> FAV CLUB: <strong className="text-white">{profile.favoriteClub || 'Real Madrid'}</strong>
          </span>
          <span className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border-2 border-black shadow-sm">
            <Target className="w-3.5 h-3.5 text-[#009E49]" /> LEGEND: <strong className="text-white">{profile.favoritePlayer || 'Cristiano Ronaldo'}</strong>
          </span>
        </div>
      </div>

      {/* Dynamic Gaffer Bio metrics / Stats Bento widgets */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:grid-cols-4 shrink-0 font-mono text-center w-full md:w-auto mt-4 md:mt-0 relative z-10">
        <div className="bg-zinc-950 border-2 border-black px-4 py-3.5 min-w-[125px] rounded-xl transition duration-300 shadow-[3px_3px_0px_#002776] flex flex-col justify-center items-center">
          <span className="text-[8px] text-gray-400 font-black tracking-wider block mb-1">TOTAL AURA</span>
          <span className="text-2xl font-black text-[#FBE116] block flex items-center gap-1 font-graffiti">
            <Sparkles className="w-4 h-4 text-[#FBE116] animate-bounce" /> {auraScore}
          </span>
        </div>

        <div className="bg-zinc-950 border-2 border-black px-4 py-3.5 min-w-[125px] rounded-xl transition duration-300 shadow-[3px_3px_0px_#009E49] flex flex-col justify-center items-center">
          <span className="text-[8px] text-gray-400 font-black tracking-wider block mb-1">LIKES EARNED</span>
          <span className="text-2xl font-black text-[#009E49] block flex items-center gap-1 font-graffiti">
            <Heart className="w-4 h-4 text-red-500 animate-pulse fill-red-500" /> {totalLikes}
          </span>
        </div>

        <div className="bg-zinc-950 border-2 border-black px-4 py-3.5 min-w-[125px] rounded-xl transition duration-300 shadow-[3px_3px_0px_#FBE116] flex flex-col justify-center items-center md:hidden lg:flex">
          <span className="text-[8px] text-gray-400 font-black tracking-wider block mb-1">SQUADS LOCK</span>
          <span className="text-2xl font-black text-slate-100 block font-graffiti">
            {userSquads.length}
          </span>
        </div>

        <div className="bg-zinc-950 border-2 border-black px-4 py-3.5 min-w-[125px] rounded-xl transition duration-300 shadow-[3px_3px_0px_#020b08] flex flex-col justify-center items-center md:hidden lg:flex">
          <span className="text-[8px] text-gray-400 font-black tracking-wider block mb-1">WIN RATE</span>
          <span className="text-2xl font-black text-cyan-400 block font-graffiti">
            {profile.winRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
