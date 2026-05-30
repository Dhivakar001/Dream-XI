import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Squad } from '../types';
import { playFutSound } from '../utils';
import { deleteSquadFromCloud } from '../lib/supabaseDb';
import { Trash2, Edit, Eye, Trophy, Sparkles, ChevronRight, Share2, Layers } from 'lucide-react';

interface MySquadsViewProps {
  userId: string;
  squadsList: Squad[];
  onLoadSquad: (squad: Squad) => void;
  onDeleteSquad: (squadId: string) => void;
  onGoToBuilder: () => void;
  id?: string;
}

export default function MySquadsView({
  userId,
  squadsList,
  onLoadSquad,
  onDeleteSquad,
  onGoToBuilder,
  id,
}: MySquadsViewProps) {
  const [selectedPreviewSquad, setSelectedPreviewSquad] = useState<Squad | null>(null);

  // Filter only squads belonging to the logged-in user
  const mySquads = squadsList.filter(s => s.userId === userId);

  return (
    <div id={id || "my-squads-view-root"} className="w-full max-w-5xl mx-auto p-4 select-none font-mono text-xs">
      {/* Header section with metrics */}
      <div className="flex justify-between items-center mb-8 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-base font-black text-white uppercase flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" /> My Tactical Locker Room
          </h2>
          <p className="text-[9px] text-gray-400 uppercase mt-1 tracking-widest">
            PERSISTENT CLOUD COACH ARCHIVES • {mySquads.length} SQUADS DRAFTED
          </p>
        </div>
        
        {mySquads.length > 0 && (
          <button
            onClick={onGoToBuilder}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-sans font-black text-[10px] uppercase rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
          >
            + Draft New XI
          </button>
        )}
      </div>

      {/* Main layout grid */}
      {mySquads.length === 0 ? (
        <div className="text-center py-20 bg-[#0B0B0F]/60 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-3xl mb-4 font-sans">
            📂
          </div>
          <h3 className="font-sans font-black text-white text-sm uppercase">Locker Room Empty</h3>
          <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-wide max-w-xs leading-relaxed">
            You haven't locked in any tactical lineups yet. Get over to the Tactical Pitch and formulate your first masterpiece!
          </p>
          <button
            onClick={onGoToBuilder}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-sans font-black text-[10px] uppercase rounded-xl hover:scale-105 transition cursor-pointer"
          >
            📋 Head to Builder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Squad list sidebar (Col 1) */}
          <div className={`md:col-span-${selectedPreviewSquad ? '7' : '12'} flex flex-col gap-4`}>
            {mySquads.map((sq) => {
              const activeCount = sq.slots.filter(p => p.player).length;
              return (
                <div
                  key={sq.id}
                  className={`border-2 p-5 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${selectedPreviewSquad?.id === sq.id ? 'border-purple-500 bg-purple-950/20' : 'border-white/5 bg-black/30 hover:border-white/15'}`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-extrabold text-sm text-white uppercase tracking-tight">{sq.name}</span>
                      <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-extrabold leading-none uppercase">
                        {sq.formation}
                      </span>
                    </div>
                    {sq.description && (
                      <p className="text-gray-400 text-[11px] font-sans truncate max-w-[320px] italic">
                        "{sq.description}"
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 font-mono text-[9px] uppercase tracking-widest text-gray-400">
                      <span>RATING: <strong className="text-yellow-400">{sq.rating} OVR</strong></span>
                      <span>CHEMISTRY: <strong className="text-[#10b981]">{sq.chemistry}%</strong></span>
                      <span>COOKED: <strong className="text-purple-400">{activeCount}/11 STARS</strong></span>
                    </div>
                  </div>

                  {/* Actions segment */}
                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
                    <button
                      onClick={() => {
                        playFutSound('click');
                        setSelectedPreviewSquad(sq);
                      }}
                      className="p-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 hover:text-cyan-400 border border-white/5 transition flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold cursor-pointer text-gray-300"
                      title="Quick Preview Squad"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    
                    <button
                      onClick={() => {
                        playFutSound('success');
                        onLoadSquad(sq);
                      }}
                      className="p-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 border border-purple-500/20 transition flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold cursor-pointer"
                      title="Load into Active Tactical Pitch"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={async () => {
                        if (!confirm(`Confirm benching squad: '${sq.name}' permanent-wise?`)) return;
                        playFutSound('click');
                        const ok = await deleteSquadFromCloud(sq.id);
                        try {
                          await fetch(`/api/squads/${sq.id}`, { method: 'DELETE' });
                        } catch (e) {}
                        onDeleteSquad(sq.id);
                        if (selectedPreviewSquad?.id === sq.id) {
                          setSelectedPreviewSquad(null);
                        }
                      }}
                      className="p-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/10 transition flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold cursor-pointer"
                      title="Bench and Scrap Squad"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Bench
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Squad Details Preview Panel (Col 2 - Contextual) */}
          {selectedPreviewSquad && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-5 bg-[#0e0d16] border border-white/10 rounded-2xl p-5 select-none relative flex flex-col gap-5 self-start"
            >
              {/* Backing stadium layout */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-400" /> SQUAD SPECIFICATIONS
                </span>
                <button
                  onClick={() => setSelectedPreviewSquad(null)}
                  className="text-gray-400 hover:text-white font-black text-xs uppercase"
                >
                  Close
                </button>
              </div>

              <div>
                <h3 className="font-sans font-black text-white text-base uppercase leading-none">{selectedPreviewSquad.name}</h3>
                <span className="text-[9px] text-[#10b981] uppercase font-bold mt-2 inline-block">
                  AURA RATING: ⭐ {selectedPreviewSquad.auraScore} pts
                </span>
                {selectedPreviewSquad.description && (
                  <p className="text-gray-400 text-[11px] font-sans italic mt-2.5 bg-black/40 p-2.5 rounded-lg border border-white/5">
                    "{selectedPreviewSquad.description}"
                  </p>
                )}
              </div>

              {/* Player lineup summary list */}
              <div className="flex flex-col gap-2">
                <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Squad Starter XI Positions</span>
                <div className="flex flex-col gap-1.5 max-h-[250px] overflow-y-auto pr-1">
                  {selectedPreviewSquad.slots.map((sl, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[9px] font-mono text-purple-400 font-bold w-10 uppercase border-r border-white/5 pr-1.5 mr-1.5">{sl.positionId}</span>
                      {sl.player ? (
                        <div className="flex-1 flex items-center justify-between text-white font-sans text-xs">
                          <span className="font-bold truncate max-w-[140px] uppercase flex items-center gap-1">
                            <span>{sl.player.nationFlag}</span> {sl.player.name}
                          </span>
                          <span className="font-mono text-[10px] text-yellow-400 font-black">{sl.player.rating} OVR</span>
                        </div>
                      ) : (
                        <span className="flex-1 text-gray-600 uppercase text-[9px] tracking-wider italic">VANCANT slot</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  playFutSound('success');
                  onLoadSquad(selectedPreviewSquad);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-sans font-black uppercase text-center rounded-xl tracking-wider hover:scale-105 transition cursor-pointer"
              >
                📋 Load Into Tactical Pitch
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
