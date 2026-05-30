import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Shield, Flame, Swords, Compass } from 'lucide-react';
import { Squad } from '../types';
import { playFutSound } from '../utils';

interface LeaderboardsViewProps {
  squadsList: Squad[];
}

export default function LeaderboardsView({ squadsList }: LeaderboardsViewProps) {
  // Mock high ranking profiles
  const topManagers = [
    { rank: 1, name: 'Gaffer_XI', wins: 24, loss: 2, points: 280, title: 'Tactical Overload', icon: '🥇' },
    { rank: 2, name: 'Samba_Coach', wins: 19, loss: 4, points: 210, title: 'Chemistry Scholar', icon: '🥈' },
    { rank: 3, name: 'Zlatan_Disciple', wins: 17, loss: 5, points: 190, title: 'Aura Overload', icon: '🥉' },
    { rank: 4, name: 'Fifa_Vet_2026', wins: 15, loss: 8, points: 160, title: 'Squad Builder Pro', icon: '👤' },
    { rank: 5, name: 'Dream_Tactics', wins: 12, loss: 9, points: 130, title: 'Formation Analyst', icon: '👤' }
  ];

  // Sort squads by likes or ratings desc
  const rankedSquads = [...squadsList]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 select-none">
      
      {/* bento main grids */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Top Tacticians List (Col 1) */}
        <div className="md:col-span-6 bg-slate-900/80 border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block border-b border-white/5 pb-2 select-none">
            <Trophy className="w-4 h-4 text-yellow-400 inline mr-1 mb-0.5 animate-bounce" />
            TOP COMPREHENSIVE TACTICIANS
          </span>

          <div className="flex flex-col gap-3.5">
            {topManagers.map((man) => (
              <div
                key={man.rank}
                className="bg-black/40 border border-white/5 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:border-white/10 transition leading-tight select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl font-bold font-mono text-yellow-500 w-6 select-none">{man.icon}</span>
                  <div className="min-w-0 font-sans">
                    <span className="font-sans font-black text-xs text-white block truncate uppercase hover:text-yellow-400 cursor-pointer">@{man.name}</span>
                    <span className="text-[9px] text-[#22c55e] uppercase tracking-wider font-mono block mt-1">STATUS: {man.title}</span>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <span className="text-[11px] font-black text-white block">{man.points} PTS</span>
                  <span className="text-[9px] text-gray-500 uppercase font-mono mt-1 block">W: {man.wins} / L: {man.loss}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Valued Squad layouts (Col 2) */}
        <div className="md:col-span-6 bg-slate-900/80 border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col gap-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block border-b border-white/5 pb-2 select-none">
            <Flame className="w-4 h-4 text-emerald-400 inline mr-1 mb-0.5" />
            MOST VALUED TEAM BUILDS
          </span>

          <div className="flex flex-col gap-3.5">
            {rankedSquads.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-mono text-xs">
                No active squads compiled in database indices.
              </div>
            ) : (
              rankedSquads.map((sq, idx) => (
                <div
                  key={sq.id}
                  className="bg-black/40 border border-white/5 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:border-white/10 transition leading-tight select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-black text-gray-400 w-5 select-none font-mono">#{idx + 1}</span>
                    <div className="min-w-0 leading-tight">
                      <span className="font-sans font-black text-xs text-white block truncate uppercase">{sq.name}</span>
                      <span className="text-[9px] text-gray-500 font-mono tracking-wider block mt-1 uppercase">GAFFER: @{sq.userName}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#10b981] block uppercase tracking-wider">{sq.rating} OVR</span>
                    <span className="text-[9px] text-gray-500 uppercase font-mono mt-1 block">{sq.chemistry}% CHEM LINK</span>
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
