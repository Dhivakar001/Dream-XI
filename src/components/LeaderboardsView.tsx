import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Shield, Flame, Swords, Compass, Sparkles } from 'lucide-react';
import { Squad } from '../types';
import { playFutSound } from '../utils';

interface LeaderboardsViewProps {
  squadsList: Squad[];
}

export default function LeaderboardsView({ squadsList }: LeaderboardsViewProps) {
  // Mock high ranking profiles
  const topManagers = [
    { rank: 1, name: 'Gaffer_XI', wins: 24, loss: 2, points: 280, title: 'Tactical Overload', icon: '👑', color: 'from-yellow-400 via-amber-300 to-yellow-500', height: 'h-40', glow: 'shadow-[0_0_25px_rgba(250,204,21,0.25)]' },
    { rank: 2, name: 'Samba_Coach', wins: 19, loss: 4, points: 210, title: 'Chemistry Scholar', icon: '🥈', color: 'from-slate-300 via-slate-100 to-slate-400', height: 'h-32', glow: 'shadow-[0_0_20px_rgba(226,232,240,0.2)]' },
    { rank: 3, name: 'Zlatan_Disciple', wins: 17, loss: 5, points: 190, title: 'Aura Overload', icon: '🥉', color: 'from-amber-600 via-amber-500 to-amber-750', height: 'h-28', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' }
  ];

  const offPodiumManagers = [
    { rank: 4, name: 'Fifa_Vet_2026', wins: 15, loss: 8, points: 160, title: 'Squad Pro', icon: '👤' },
    { rank: 5, name: 'Dream_Tactics', wins: 12, loss: 9, points: 130, title: 'Analyst', icon: '👤' }
  ];

  // Sort squads by likes or ratings desc
  const rankedSquads = [...squadsList]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 select-none">
      
      {/* Dynamic 3D Podium Layout for Top 3 */}
      <div className="bg-[#12111c] border-2 border-violet-500/15 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4">
          <Sparkles className="w-5 h-5 text-yellow-400/25 animate-pulse" />
        </div>
        
        <div className="text-center mb-8">
          <span className="text-[10px] font-black tracking-widest text-[#10b981] bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-500/20 uppercase">
            ⚡ WORLD TACTICKER ARENA ⚡
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-3">
            LEADERBOARD LEGENDS
          </h2>
          <p className="text-gray-400 text-xs font-mono mt-1">
            Gaffers with the highest rating setups and absolute visual aura
          </p>
        </div>

        {/* 3D Pillars */}
        <div className="flex items-end justify-center gap-4 max-w-md mx-auto pt-6 border-b border-white/5 pb-2">
          
          {/* Rank 2 - Left */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl mb-1">{topManagers[1].icon}</span>
            <span className="font-extrabold text-white text-[11px] truncate max-w-[90px] text-center">@{topManagers[1].name}</span>
            <span className="text-[9px] text-[#10b981] font-bold block mb-3">{topManagers[1].points} PTS</span>
            <div className={`w-full ${topManagers[1].height} bg-gradient-to-b ${topManagers[1].color} rounded-t-2xl flex flex-col items-center justify-end pb-3 text-black font-black text-sm select-none shadow-xl ${topManagers[1].glow}`}>
              #2
            </div>
          </div>

          {/* Rank 1 - Center Pill */}
          <div className="flex flex-col items-center flex-1 z-10">
            <span className="text-3xl mb-1 animate-bounce">{topManagers[0].icon}</span>
            <span className="font-extrabold text-yellow-300 text-xs truncate max-w-[100px] text-center">@{topManagers[0].name}</span>
            <span className="text-[10px] text-yellow-400 font-black block mb-3">{topManagers[0].points} PTS</span>
            <div className={`w-full ${topManagers[0].height} bg-gradient-to-b ${topManagers[0].color} rounded-t-2xl flex flex-col items-center justify-end pb-4 text-black font-black text-lg select-none shadow-2xl ${topManagers[0].glow}`}>
              #1
            </div>
          </div>

          {/* Rank 3 - Right */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl mb-1">{topManagers[2].icon}</span>
            <span className="font-extrabold text-white text-[11px] truncate max-w-[90px] text-center">@{topManagers[2].name}</span>
            <span className="text-[9px] text-[#10b981] font-bold block mb-3">{topManagers[2].points} PTS</span>
            <div className={`w-full ${topManagers[2].height} bg-gradient-to-b ${topManagers[2].color} rounded-t-2xl flex flex-col items-center justify-end pb-2 text-black font-black text-sm select-none shadow-xl ${topManagers[2].glow}`}>
              #3
            </div>
          </div>

        </div>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Remaining top positions */}
        <div className="md:col-span-6 bg-[#12111c] border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block border-b border-white/5 pb-2.5">
            <Trophy className="w-4 h-4 text-yellow-400 inline mr-1 mb-0.5" />
            OUTSTANDING RUNNERS
          </span>

          <div className="flex flex-col gap-3">
            {offPodiumManagers.map((man) => (
              <div
                key={man.rank}
                className="bg-black/40 border border-white/5 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:border-violet-500/20 transition leading-tight"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-black text-gray-500 w-5 select-none font-sans">#{man.rank}</span>
                  <div className="min-w-0 font-sans">
                    <span className="font-sans font-black text-xs text-white block truncate uppercase hover:text-yellow-400 cursor-pointer">@{man.name}</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block mt-1">STATUS: {man.title}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-black text-emerald-400 block">{man.points} PTS</span>
                  <span className="text-[8px] text-gray-500 uppercase font-mono mt-1 block">W: {man.wins} / L: {man.loss}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Valued Squad layouts */}
        <div className="md:col-span-6 bg-[#12111c] border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block border-b border-white/5 pb-2.5">
            <Flame className="w-4 h-4 text-fuchsia-400 inline mr-1 mb-0.5 animate-pulse" />
            MOST VALUED TEAM BUILDS
          </span>

          <div className="flex flex-col gap-3">
            {rankedSquads.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-mono text-xs">
                No active squads compiled in database indices.
              </div>
            ) : (
              rankedSquads.map((sq, idx) => (
                <div
                  key={sq.id}
                  className="bg-black/40 border-2 border-white/5 hover:border-fuchsia-500/20 p-3.5 rounded-xl flex items-center justify-between gap-4 transition leading-tight"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-tr from-pink-500 to-indigo-500 w-5 select-none">#{idx + 1}</span>
                    <div className="min-w-0 leading-tight">
                      <span className="font-sans font-black text-xs text-white block truncate uppercase">{sq.name}</span>
                      <span className="text-[9px] text-gray-500 font-mono tracking-wider block mt-1 uppercase">GAFFER: @{sq.userName}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-yellow-400 block uppercase tracking-wider">{sq.rating} OVR</span>
                    <span className="text-[9px] text-[#10b981] font-bold uppercase font-mono mt-1 block">{sq.chemistry}% CHEM LINK</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
