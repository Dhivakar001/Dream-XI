import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, RotateCcw, Save, ShieldAlert, Cpu, Sparkles, Filter, Check, X, Users, Dumbbell } from 'lucide-react';
import { FormationName, Squad, SquadSlot, Player } from '../types';
import { FORMATIONS } from '../formations';
import { calculateSquadChemistry, calculateSquadRating, calculateSquadAura, playFutSound } from '../utils';
import HolographicCard from './HolographicCard';

interface PitchBuilderProps {
  userId: string;
  userName: string;
  onSetSquad: (squad: Squad) => void;
  onAnalyzeSquad: (squad: Squad) => void;
  availablePlayers: Player[];
  activeSquad?: Squad;
}

export default function PitchBuilder({
  userId,
  userName,
  onSetSquad,
  onAnalyzeSquad,
  availablePlayers,
  activeSquad,
}: PitchBuilderProps) {
  // Config state
  const [formationName, setFormationName] = useState<FormationName>('4-3-3');
  const [squadName, setSquadName] = useState('My Dream XI');
  const [squadDesc, setSquadDesc] = useState('Tactical breakdown of my ultimate XI.');
  const [isPublic, setIsPublic] = useState(true);
  
  // Tactical Slots on pitch
  const [slots, setSlots] = useState<SquadSlot[]>([]);
  
  // Dialog controls
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  // Search & Filters inside Selector
  const [searchTerm, setSearchTerm] = useState('');
  const [posFilter, setPosFilter] = useState('ALL');
  const [eraFilter, setEraFilter] = useState('ALL');
  const [rarityFilter, setRarityFilter] = useState('ALL');
  const [auraFilter, setAuraFilter] = useState(false);

  // Initializing or Syncing slots from ActiveSquad/Formation
  useEffect(() => {
    if (activeSquad) {
      setSlots(activeSquad.slots);
      setFormationName(activeSquad.formation);
      setSquadName(activeSquad.name);
      setSquadDesc(activeSquad.description);
      setIsPublic(activeSquad.isPublic);
    } else {
      initializeSlots('4-3-3');
    }
  }, [activeSquad]);

  const initializeSlots = (fname: FormationName) => {
    const formation = FORMATIONS[fname];
    const newSlots: SquadSlot[] = formation.positions.map(p => ({
      positionId: p.id,
      player: null,
    }));
    setSlots(newSlots);
  };

  const handleFormationChange = (name: string) => {
    playFutSound('click');
    setFormationName(name as FormationName);
    initializeSlots(name as FormationName);
  };

  // Metrics (Live calculations)
  const chemistryResult = calculateSquadChemistry(slots);
  const teamRating = calculateSquadRating(slots);
  const teamAura = calculateSquadAura(slots);

  // Draft Auto-fill Algorithm! Evaluates high synergy and ratings
  const triggerAutoDraft = () => {
    playFutSound('success');
    // For each slot, find a player in our DB who matching position category, is not already on pitch, and has maximum rating
    const draftSlots = slots.map(slot => {
      const posDetails = FORMATIONS[formationName].positions.find(p => p.id === slot.positionId);
      const category = posDetails?.category;

      let validCandidates = availablePlayers.filter((p: Player) => {
        // Prevent doubling player id on pitch
        const onPitch = slots.some(s => s.player?.id === p.id);
        if (onPitch) return false;

        // Group matcher
        if (category === 'GK') return p.position === 'GK';
        if (category === 'DEF') return ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position);
        if (category === 'MID') return ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.position);
        if (category === 'ST') return ['ST', 'CF', 'LW', 'RW'].includes(p.position);
        return false;
      });

      // Sort by rating desc
      validCandidates.sort((a, b) => b.rating - a.rating);
      const picked = validCandidates[0] || null;
      
      // Temporarily mark so they aren't duplicates
      if (picked) {
        // Simple trick: mutation is fine for this block
        (picked as any)._draftAssigned = true;
      }

      return {
        positionId: slot.positionId,
        player: picked,
      };
    });

    // Cleanup temporary variable
    availablePlayers.forEach(p => delete (p as any)._draftAssigned);

    setSlots(draftSlots);
  };

  const clearPitch = () => {
    playFutSound('click');
    initializeSlots(formationName);
  };

  const openSlotSelector = (pId: string) => {
    playFutSound('click');
    setActiveSlotId(pId);
    
    // Auto-prefilter search queries with relevant position slots to simplify
    const slotDetails = FORMATIONS[formationName].positions.find(p => p.id === pId);
    setPosFilter(slotDetails?.label || 'ALL');
    setShowSelector(true);
  };

  const assignPlayerToSlot = (player: Player) => {
    // Check if player already drafted elsewhere, remove from previous slot to swap
    const cleanSlots = slots.map(s => {
      if (s.player?.id === player.id) {
        return { positionId: s.positionId, player: null };
      }
      return s;
    });

    // Assign to active
    const newSlots = cleanSlots.map(s => {
      if (s.positionId === activeSlotId) {
        return { positionId: s.positionId, player };
      }
      return s;
    });

    setSlots(newSlots);
    setShowSelector(false);
    setActiveSlotId(null);
    playFutSound('success');
  };

  const removePlayerFromSlot = (pId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSlots = slots.map(s => {
      if (s.positionId === pId) {
        return { positionId: s.positionId, player: null };
      }
      return s;
    });
    setSlots(newSlots);
    playFutSound('click');
  };

  // Safe search criteria query
  const filteredPlayers = availablePlayers.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term) || p.club.toLowerCase().includes(term) || p.nation.toLowerCase().includes(term);
    
    let posMatch = true;
    if (posFilter !== 'ALL') {
      if (posFilter === 'DEF') posMatch = ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position);
      else if (posFilter === 'MID') posMatch = ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.position);
      else if (posFilter === 'ST') posMatch = ['ST', 'CF', 'LW', 'RW'].includes(p.position);
      else posMatch = p.position === posFilter;
    }

    const eraMatch = eraFilter === 'ALL' || p.era === eraFilter;
    const rarityMatch = rarityFilter === 'ALL' || p.cardType === rarityFilter;
    const auraMatch = !auraFilter || p.auraRating >= 95;

    return nameMatch && posMatch && eraMatch && rarityMatch && auraMatch;
  });

  // Calculate coordinates and build direct pathways for tactical linkages overlay in SVG!
  const getPitchConnections = () => {
    const activePositions = FORMATIONS[formationName].positions;
    const connections: { id: string; x1: number; y1: number; x2: number; y2: number; hasPlayer: boolean }[] = [];
    
    // Direct maps defining which positions coordinates line up under classical links
    const matches: Record<string, string[]> = {
      'GK': ['CB', 'LCB', 'RCB'],
      'LB': ['LCB', 'LCM', 'LM'],
      'RB': ['RCB', 'RCM', 'RM'],
      'LCB': ['RCB', 'LCM', 'GK', 'CB'],
      'RCB': ['LCB', 'RCM', 'GK', 'CB'],
      'CB': ['LCB', 'RCB', 'GK', 'CM', 'LCM', 'RCM'],
      'LCM': ['RCM', 'CAM', 'LW', 'LM', 'LCDM'],
      'RCM': ['LCM', 'CAM', 'RW', 'RM', 'RCDM'],
      'CAM': ['ST', 'ST1', 'ST2', 'LW', 'RW'],
      'LCDM': ['RCDM', 'LCM', 'LCB', 'LM'],
      'RCDM': ['LCDM', 'RCM', 'RCB', 'RM'],
      'LM': ['LCM', 'LW', 'ST', 'ST1'],
      'RM': ['RCM', 'RW', 'ST', 'ST2'],
      'LW': ['ST', 'CAM', 'ST1'],
      'RW': ['ST', 'CAM', 'ST2'],
    };

    activePositions.forEach(p1 => {
      const links = matches[p1.id] || [];
      links.forEach(lId => {
        const p2 = activePositions.find(pos => pos.id === lId);
        if (p2) {
          // Prevent duplicates by sorting values
          const key = [p1.id, p2.id].sort().join('-');
          const alreadyLinked = connections.some(c => c.id === key);
          
          if (!alreadyLinked) {
            // Check if BOTH are occupied
            const slot1 = slots.find(s => s.positionId === p1.id);
            const slot2 = slots.find(s => s.positionId === p2.id);
            const hasBoth = !!(slot1?.player && slot2?.player);
            
            // Check if they share chemistry trait
            let shareChem = false;
            if (hasBoth) {
              const pA = slot1!.player!;
              const pB = slot2!.player!;
              shareChem = pA.club === pB.club || pA.nation === pB.nation || pA.league === pB.league;
            }

            connections.push({
              id: key,
              x1: p1.x,
              y1: p1.y,
              x2: p2.x,
              y2: p2.y,
              hasPlayer: hasBoth && shareChem
            });
          }
        }
      });
    });

    return connections;
  };

  // Submit squad to backend
  const handleSaveSquad = async () => {
    if (!squadName.trim()) {
      alert('Please configure a valid squad name!');
      return;
    }
    
    setIsSaving(true);
    playFutSound('click');
    
    const finalSquad: Squad = {
      id: activeSquad?.id || 's-' + Math.random().toString(36).substring(2, 9),
      name: squadName,
      userId: userId || 'u-user',
      userName: userName || 'Gaffer_XI',
      formation: formationName,
      slots: slots,
      chemistry: chemistryResult.total,
      rating: teamRating,
      auraScore: teamAura,
      isPublic: isPublic,
      description: squadDesc,
      likes: activeSquad?.likes || 0,
      likedBy: activeSquad?.likedBy || [],
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/squads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalSquad),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaving(false);
        setShowSaveModal(false);
        onSetSquad(finalSquad);
        playFutSound('success');
      }
    } catch (e) {
      console.error('Failed to preserve squad', e);
      setIsSaving(false);
    }
  };

  const handleAIAnalyze = () => {
    playFutSound('click');
    const mockSquad: Squad = {
      id: 'active',
      name: squadName,
      userId,
      userName,
      formation: formationName,
      slots,
      chemistry: chemistryResult.total,
      rating: teamRating,
      auraScore: teamAura,
      isPublic,
      description: squadDesc,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString()
    };
    onAnalyzeSquad(mockSquad);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 p-4">
      {/* 1. Tactical Soccer Pitch (Left Column) */}
      <div className="flex-1 flex flex-col items-center">
        {/* Pitch Toolbar header */}
        <div className="w-full max-w-3xl flex flex-wrap gap-3 items-center justify-between mb-4 bg-slate-900/80 border border-white/5 p-3 rounded-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">TACTICS:</span>
            <div className="flex gap-1.5 flex-wrap">
              {(Object.keys(FORMATIONS) as FormationName[]).map(fname => (
                <button
                  key={fname}
                  onClick={() => handleFormationChange(fname)}
                  className={`px-3 py-1.5 rounded-lg font-black text-xs transition duration-200 ${
                    formationName === fname
                      ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  {fname}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerAutoDraft}
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-400 text-black px-3.5 py-1.5 rounded-lg text-xs font-black shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:opacity-90 transition"
              title="Draft high chemistry elite squad automatically!"
            >
              <Users className="w-3.5 h-3.5" />
              AUTO-DRAFT
            </button>
            <button
              onClick={clearPitch}
              className="flex items-center gap-1 bg-slate-800 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
              title="Clear current squad slots"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET XI
            </button>
          </div>
        </div>

        {/* Dynamic Stadium Soccer Pitch */}
        <div className="w-full max-w-3xl bg-radial from-[#132c1b] via-[#09170e] to-black aspect-[3/4] relative rounded-3xl overflow-hidden border border-emerald-500/25 shadow-[0_0_40px_rgba(16,185,129,0.15)] select-none">
          {/* Pitch Lines */}
          <div className="absolute inset-0 p-4 pointer-events-none select-none">
            <div className="w-full h-full border border-white/10 rounded-2xl relative select-none">
              {/* Midfield line index */}
              <div className="w-full h-px bg-white/10 absolute top-1/2 left-0 select-none text-transparent" />
              <div className="w-24 h-24 border border-white/10 rounded-full absolute top-1/2 left-1/2 -ml-12 -mt-12 select-none" />
              <div className="w-4 h-4 rounded-full bg-white/10 absolute top-1/2 left-1/2 -ml-2 -mt-2 select-none" />
              
              {/* Penalty Boxes */}
              {/* Goal top */}
              <div className="w-48 h-20 border border-white/10 absolute top-0 left-1/2 -ml-24 rounded-b select-none" />
              <div className="w-20 h-8 border border-white/10 absolute top-0 left-1/2 -ml-10 rounded-b select-none" />
              {/* Goal bottom */}
              <div className="w-48 h-20 border border-white/10 absolute bottom-0 left-1/2 -ml-24 rounded-t select-none" />
              <div className="w-20 h-8 border border-white/10 absolute bottom-0 left-1/2 -ml-10 rounded-t select-none" />
            </div>
          </div>

          {/* SVG Animated Chemistry Links Canvas */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {getPitchConnections().map(conn => (
              <line
                key={conn.id}
                x1={`${conn.x1}%`}
                y1={`${conn.y1}%`}
                x2={`${conn.x2}%`}
                y2={`${conn.y2}%`}
                stroke={conn.hasPlayer ? '#10b981' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={conn.hasPlayer ? '3' : '1.5'}
                strokeDasharray={conn.hasPlayer ? '5,5' : 'none'}
                className={conn.hasPlayer ? 'animate-[dash_10s_linear_infinite] filter drop-shadow-[0_0_5px_#10b981]' : ''}
              />
            ))}
          </svg>

          {/* Dynamic Active Slots on Soccer Pitch */}
          {slots.map(slot => {
            const posDetails = FORMATIONS[formationName].positions.find(pos => pos.id === slot.positionId);
            if (!posDetails) return null;

            const isOccupied = slot.player !== null;

            return (
              <div
                key={slot.positionId}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 bg-transparent"
                style={{
                  left: `${posDetails.x}%`,
                  top: `${posDetails.y}%`,
                  zIndex: isOccupied ? 10 : 5
                }}
              >
                {isOccupied ? (
                  /* Mini Card display or Hover preview on pitch slot */
                  <div className="relative group flex flex-col items-center">
                    <HolographicCard
                      player={slot.player!}
                      size="sm"
                      onClick={() => openSlotSelector(slot.positionId)}
                      showStats={false}
                    />
                    {/* Delete handle */}
                    <button
                      onClick={(e) => removePlayerFromSlot(slot.positionId, e)}
                      className="absolute -top-1.5 -right-1.5 bg-black/90 text-red-400 hover:text-red-300 border border-white/10 rounded-full p-1 shadow-lg cursor-pointer transform hover:scale-110 opacity-0 group-hover:opacity-100 transition z-20"
                      title="Bench Player"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {/* Compact label overlay */}
                    <span className="mt-1 bg-slate-900/95 border border-white/10 text-[9px] font-black px-1.5 py-0.5 rounded leading-none text-yellow-400 select-none uppercase shadow-md">
                      {posDetails.label}
                    </span>
                  </div>
                ) : (
                  /* Empty Slot Indicator with glowing neon border */
                  <button
                    onClick={() => openSlotSelector(slot.positionId)}
                    className="w-14 h-20 border-2 border-dashed border-emerald-500/20 hover:border-emerald-400 bg-emerald-950/20 rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer transition duration-300 hover:scale-105 group"
                  >
                    <span className="text-[10px] font-black text-emerald-400 group-hover:text-emerald-300 tracking-tighter select-none">
                      {posDetails.label}
                    </span>
                    <span className="text-[20px] font-bold text-emerald-500/50 group-hover:text-emerald-300 leading-none mt-1 select-none">
                      +
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Tactical Controller Panel (Right Column) */}
      <div className="w-full lg:w-96 flex flex-col gap-5">
        {/* Core Metrics Bento box */}
        <div className="bg-slate-900/90 border border-white/5 rounded-2xl p-5 backdrop-blur shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 select-none">
            <Sparkles className="w-5 h-5 text-yellow-400/20 animate-pulse" />
          </div>

          <h3 className="font-black text-sm tracking-wide text-white uppercase mb-4 pb-2 border-b border-white/5">
            TEAM STATISTICS
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Rating Metric */}
            <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3 text-center">
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase block mb-1">TEAM RATING:</span>
              <div className="inline-flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{teamRating}</span>
                <span className="text-yellow-400 font-extrabold text-xs">OVR</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2.5">
                <div className="bg-yellow-400 h-1 rounded-full" style={{ width: `${teamRating}%` }} />
              </div>
            </div>

            {/* Chemistry Metric */}
            <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3 text-center">
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase block mb-1">CHEMISTRY:</span>
              <div className="inline-flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-400">{chemistryResult.total}</span>
                <span className="text-emerald-500 text-xs font-bold">/100</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2.5">
                <div className="bg-[#10b981] h-1 rounded-full filter drop-shadow-[0_0_2px_#10b981]" style={{ width: `${chemistryResult.total}%` }} />
              </div>
            </div>
          </div>

          {/* Aura Score Metric */}
          <div className="w-full bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-emerald-500/10 rounded-xl p-3 mt-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase block">COMBINED SQUAD AURA:</span>
              <span className="text-lg font-black text-white">
                {teamAura > 0 ? `${teamAura}% AURA` : '0% AURA'}
              </span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-900/30 text-[#10b981] text-[10px] font-mono border border-emerald-500/20 uppercase tracking-widest leading-none">
              🔥 LIVELY
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mt-4 leading-relaxed font-mono">
            💡 Chemistry yields crucial precision. Pair up players from the same <b>clubs</b> (e.g., Real Madrid), <b>countries</b> (e.g., Brazil), or <b>leagues</b> in their natural positions to max synergistic output!
          </p>
        </div>

        {/* Tactical Actions Module */}
        <div className="bg-slate-900/90 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 backdrop-blur shadow-xl">
          <button
            onClick={handleAIAnalyze}
            disabled={slots.filter(s => s.player !== null).length === 0}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(234,179,8,0.3)]"
          >
            <Cpu className="w-4 h-4 animate-spin-slow" />
            AI SQUAD COMMENTARY
          </button>

          <button
            onClick={() => { playFutSound('click'); setShowSaveModal(true); }}
            disabled={slots.filter(s => s.player !== null).length === 0}
            className="w-full py-3.5 rounded-xl bg-slate-800 border border-white/10 text-white hover:text-yellow-400 select-none font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            LOCK SQUAD IN DB
          </button>
        </div>
      </div>

      {/* 3. SIDE-DRAWER PANEL: PLAYER SELECTOR DOCK */}
      <AnimatePresence>
        {showSelector && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSelector(false)}
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            />

            {/* Selector Drawer Card slider */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-950 border-l border-white/10 z-50 overflow-y-auto flex flex-col shadow-2xl p-5"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    DRAFT COHORT
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono">
                    Filling Position Slot: <span className="text-yellow-400 font-bold">{activeSlotId}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowSelector(false)}
                  className="p-1 rounded bg-slate-900 border border-white/10 hover:border-red-500 hover:text-red-400 text-gray-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Filters Dock */}
              <div className="flex flex-col gap-3 mb-5 p-3.5 bg-slate-900/60 rounded-xl border border-white/5 font-mono text-xs">
                {/* Search Term input */}
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, club, nation..."
                    className="w-full pl-8 pr-3 py-1.5 bg-black border border-white/10 text-white rounded-lg focus:outline-none focus:border-yellow-400 text-xs"
                  />
                </div>

                {/* Grid selection columns */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1">ERA Filter:</label>
                    <select
                      value={eraFilter}
                      onChange={(e) => setEraFilter(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white p-1 text-[11px] rounded"
                    >
                      <option value="ALL">ALL ERAS</option>
                      <option value="Current">CURRENT STARS</option>
                      <option value="Legend">LEGENDS / ICONS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1">Rarity Class:</label>
                    <select
                      value={rarityFilter}
                      onChange={(e) => setRarityFilter(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white p-1 text-[11px] rounded"
                    >
                      <option value="ALL">ALL TYPES</option>
                      <option value="Gold">GOLD METER</option>
                      <option value="Icon">ICON</option>
                      <option value="Legend">LEGENDARY</option>
                      <option value="TOTY">TOTY DECK</option>
                      <option value="Future Star">FUTURE STAR</option>
                    </select>
                  </div>
                </div>

                {/* Aura limit checkbox */}
                <label className="flex items-center gap-2 cursor-pointer mt-2 leading-none">
                  <input
                    type="checkbox"
                    checked={auraFilter}
                    onChange={(e) => setAuraFilter(e.target.checked)}
                    className="bg-black border border-white/10 accent-green-500 rounded h-3.5 w-3.5"
                  />
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    🔥 Hype-Lord Aura (95%+)
                  </span>
                </label>
              </div>

              {/* Dynamic Draft Results list */}
              <div className="flex-1 overflow-y-auto flex flex-wrap gap-4 justify-center py-2 h-0">
                {filteredPlayers.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 font-mono text-xs w-full">
                    <ShieldAlert className="w-8 h-8 mx-auto text-yellow-500/80 mb-2" />
                    No match targets with selected prefilters!
                  </div>
                ) : (
                  filteredPlayers.map(player => {
                    const alreadyOnPitch = slots.some(s => s.player?.id === player.id);
                    return (
                      <div key={player.id} className="relative group">
                        <HolographicCard
                          player={player}
                          onClick={() => assignPlayerToSlot(player)}
                        />
                        {alreadyOnPitch && (
                          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center rounded-xl p-3 text-center border border-yellow-400/25 pointer-events-none select-none">
                            <Check className="w-8 h-8 text-yellow-400 mb-1" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                              On pitch slot
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. MODAL DRAWER: SAVE SQUAD METADATA */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setShowSaveModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-black text-white text-base tracking-wider uppercase mb-4 flex items-center gap-1.5">
                <Save className="w-5 h-5 text-yellow-400" />
                Register Tactical Squad
              </h3>

              <div className="flex flex-col gap-4 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Squad Title:</label>
                  <input
                    type="text"
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    placeholder="e.g. Dream XI Gold"
                    className="w-full bg-black border border-white/10 text-white p-2.5 rounded-lg focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Tactical Narrative:</label>
                  <textarea
                    rows={3}
                    value={squadDesc}
                    onChange={(e) => setSquadDesc(e.target.value)}
                    placeholder="Briefly summarize your tactical deployment or defensive overrides..."
                    className="w-full bg-black border border-white/10 text-white p-2.5 rounded-lg focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-lg border border-white/5">
                  <div>
                    <span className="block text-[11px] font-bold text-white uppercase tracking-wide">Public Battle Deck</span>
                    <span className="text-[9px] text-gray-500">Allow other users to challenge and vote in Battle Arena</span>
                  </div>
                  <button
                    onClick={() => { playFutSound('click'); setIsPublic(!isPublic); }}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${isPublic ? 'bg-[#10b981]' : 'bg-slate-800'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold uppercase text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSquad}
                    disabled={isSaving}
                    className="px-5 py-2 bg-yellow-400 hover:brightness-110 text-black px-4 py-2 rounded-lg font-black uppercase text-[10px]"
                  >
                    {isSaving ? 'Locking...' : 'Lock Squad'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
