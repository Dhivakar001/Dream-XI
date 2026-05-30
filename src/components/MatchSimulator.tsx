import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, CupSoda, Trophy, User, ShieldAlert, Zap, Timer, BarChart2, Star } from 'lucide-react';
import { Squad, MatchEvent, SimulationResult, Player } from '../types';
import { playFutSound } from '../utils';
import HolographicCard from './HolographicCard';

interface MatchSimulatorProps {
  userSquad: Squad | null;
  savedSquads: Squad[];
}

export default function MatchSimulator({ userSquad, savedSquads }: MatchSimulatorProps) {
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>('');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState<MatchEvent[]>([]);

  // Filter opponent lists (non-user) and stabilize reference with useMemo
  const availableOpponents = useMemo(() => {
    return savedSquads.filter(s => s.id !== userSquad?.id || s.userId === 'u-pele');
  }, [savedSquads, userSquad?.id]);

  useEffect(() => {
    if (availableOpponents.length > 0 && !selectedOpponentId) {
      setSelectedOpponentId(availableOpponents[0].id);
    }
  }, [availableOpponents, selectedOpponentId]);

  // Live countdown timeline runner
  useEffect(() => {
    if (!isSimulating || !simResult) return;

    setMinutes(0);
    setVisibleEvents([]);
    
    const interval = setInterval(() => {
      setMinutes(prev => {
        const nextMin = prev + 3;
        
        // Pick events up to the current simulated minute representation
        const currentEvents = simResult.events.filter(e => e.time <= nextMin);
        setVisibleEvents(currentEvents);

        // Sound cues for goals
        const justScored = currentEvents.some(e => e.time === nextMin && e.type === 'GOAL');
        if (justScored) playFutSound('success');

        if (nextMin >= 90) {
          clearInterval(interval);
          setIsSimulating(false);
          playFutSound('stadium');
          return 90;
        }
        return nextMin;
      });
    }, 150); // Fast simulation sequence!

    return () => clearInterval(interval);
  }, [isSimulating, simResult]);

  // Generate Simulation logic based on squads overall rating/chemistry
  const triggerSimulation = () => {
    if (!userSquad) return;
    const opponent = availableOpponents.find(o => o.id === selectedOpponentId);
    if (!opponent) return;

    playFutSound('stadium');
    setIsSimulating(true);
    setSimResult(null);

    // Get active human player profiles on pitch
    const teamAPlayers = userSquad.slots.filter(s => s.player !== null).map(s => s.player!);
    const teamBPlayers = opponent.slots.filter(s => s.player !== null).map(s => s.player!);

    if (teamAPlayers.length === 0 || teamBPlayers.length === 0) {
      alert('Ensure both squads have players configured first!');
      setIsSimulating(false);
      return;
    }

    // Strengths margins
    const ratingA = userSquad.rating + (userSquad.chemistry / 100) * 10;
    const ratingB = opponent.rating + (opponent.chemistry / 100) * 10;

    // Simulate scoreboards
    const odds = ratingA / (ratingA + ratingB); // probability of Team A scoring
    
    // Total goal chances (e.g. 2 to 6 potential goals total)
    const goalOdds = Math.floor(Math.random() * 5) + 2; 
    let scoreA = 0;
    let scoreB = 0;
    const events: MatchEvent[] = [];

    // General match highlights timeline builder
    const timelinePositions = [8, 14, 23, 31, 41, 48, 59, 68, 77, 84, 89];
    
    // Seed funny comments / occurrences
    const comedicEvents = [
      { name: 'Antony', text: 'tries a 360° spin in his own half. The crowd gasps as he spins out of bounds, losing possession entirely! 🌀' },
      { name: 'Harry Maguire', text: 'intercepts a ball with his head, shaking the pitch slightly. Absolute slabhead dominance!' },
      { name: 'Zlatan Ibrahimović', text: 'declares that the match is now a Zlatan-tribute event. The referee nods in agreement.' },
      { name: 'Lionel Messi', text: 'dribbles past 4 defenders effortlessly, leaving them searching for their compasses.' },
      { name: 'Cristiano Ronaldo', text: 'takes a deep breath, stands in his signature stance, and shoots. SIUUUU resonates through the stadium!' }
    ];

    timelinePositions.forEach(time => {
      const p = Math.random();
      
      if (p < 0.35) {
        // Goal scored chance!
        const scorerTeam = p < 0.35 * odds ? 'A' : 'B';
        const scorersList = scorerTeam === 'A' ? teamAPlayers : teamBPlayers;
        
        // Weighted probability towards strikers / overall rank
        scorersList.sort((a, b) => b.stats.sho - a.stats.sho);
        const scorer = scorersList[Math.floor(Math.random() * Math.min(3, scorersList.length))];

        if (scorerTeam === 'A') scoreA++; else scoreB++;

        // Add assist if possible
        const assistList = scorersList.filter(pl => pl.id !== scorer.id);
        const assister = assistList.length > 0 ? assistList[Math.floor(Math.random() * assistList.length)] : null;

        events.push({
          time,
          type: 'GOAL',
          playerId: scorer.id,
          playerName: scorer.name,
          team: scorerTeam,
          description: `⚽ GOAL! ${scorer.name} fires a bullet shot into the top corner! ${assister ? `Beautiful assist by ${assister.name}.` : 'Unassisted individual masterclass!'}`
        });
      } else if (p < 0.60) {
        // Card warning
        const badTeam = Math.random() > odds ? 'A' : 'B';
        const teamList = badTeam === 'A' ? teamAPlayers : teamBPlayers;
        const culprit = teamList[Math.floor(Math.random() * teamList.length)];
        const isRed = Math.random() > 0.85;

        // Comedic Maguire trigger
        const isMaguire = culprit.id === 'p34';

        events.push({
          time,
          type: isRed ? 'RED' : 'YELLOW',
          playerId: culprit.id,
          playerName: culprit.name,
          team: badTeam,
          description: isRed
            ? `🟥 RED CARD! ${culprit.name} is dismissed after a brutal slide tackle! Absolute tactical disaster.`
            : `🟨 YELLOW CARD! ${culprit.name} cautioned after a late tactical trip${isMaguire ? ' for shielding the ball with his chin.' : '.'}`
        });
      } else if (p < 0.82) {
        // Comedic commentary check
        const activeStar = [...teamAPlayers, ...teamBPlayers].find(pl => comedicEvents.some(ce => ce.name === pl.name));
        if (activeStar) {
          const ceDetails = comedicEvents.find(c => c.name === activeStar.name)!;
          events.push({
            time,
            type: 'COMMENTARY',
            team: teamAPlayers.some(pA => pA.id === activeStar.id) ? 'A' : 'B',
            description: `🎙️ COMMENTARY: ${activeStar.name} ${ceDetails.text}`
          });
        } else {
          // Standard commentary line
          const teams = ['Team A', 'Team B'];
          const matchPhrases = [
            'Riotous applause in the stadium as clinical tiki-taka passing splits the defense.',
            'Amazing defensive sliding block prevents a clear 1v1 counter goal!',
            'Fierce battles in the midfield circle as physical tackles multiply.',
            'The goalie coordinates defensive positioning. Absolute command!'
          ];
          events.push({
            time,
            type: 'COMMENTARY',
            team: Math.random() > 0.5 ? 'A' : 'B',
            description: `🎙️ ${matchPhrases[Math.floor(Math.random() * matchPhrases.length)]}`
          });
        }
      }
    });

    // Make sure we have at least one goal in timeline if scores ended > 0 and was empty
    if (scoreA === 0 && scoreB === 0 && Math.random() > 0.4) {
      const winner = Math.random() < odds ? 'A' : 'B';
      const scorer = winner === 'A' ? teamAPlayers[0] : teamBPlayers[0];
      if (winner === 'A') scoreA = 1; else scoreB = 1;
      events.push({
        time: 89,
        type: 'GOAL',
        playerId: scorer.id,
        playerName: scorer.name,
        team: winner,
        description: `⚽ GOAL! Late, dramatic match winner by ${scorer.name}! The arena is completely unhinged!`
      });
    }

    // Sort events by time
    events.sort((a, b) => a.time - b.time);

    // Choose MVP
    const mvpCandidates = scoreA >= scoreB ? teamAPlayers : teamBPlayers;
    mvpCandidates.sort((a, b) => b.rating - a.rating);
    const mvp = mvpCandidates[0];

    // Compute stats metrics based on midfields/combos
    const possessionA = Math.round(50 + (userSquad.rating - opponent.rating) * 0.5 + Math.random() * 6 - 3);
    const possessionB = 100 - possessionA;
    const shotsA = Math.floor(scoreA * 2.5 + Math.random() * 4 + 2);
    const shotsB = Math.floor(scoreB * 2.5 + Math.random() * 4 + 2);

    const matchStats = {
      possessionA: Math.min(75, Math.max(25, possessionA)),
      possessionB: Math.min(75, Math.max(25, possessionB)),
      shotsA: Math.max(1, shotsA),
      shotsB: Math.max(1, shotsB),
      foulsA: Math.floor(Math.random() * 8) + 4,
      foulsB: Math.floor(Math.random() * 8) + 4,
    };

    setSimResult({
      squadA: userSquad,
      squadB: opponent,
      scoreA,
      scoreB,
      stats: matchStats,
      events,
      mvp
    });
  };

  const getRunningScore = () => {
    if (!simResult) return { scoreA: 0, scoreB: 0 };
    const goalsSoFar = visibleEvents.filter(e => e.type === 'GOAL');
    const scoreA = goalsSoFar.filter(e => e.team === 'A').length;
    const scoreB = goalsSoFar.filter(e => e.team === 'B').length;
    return { scoreA, scoreB };
  };

  const runningScore = getRunningScore();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* 1. Preparation Warning */}
      {!userSquad && (
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-10 text-center text-gray-400 font-mono text-xs shadow-xl backdrop-blur">
          <CupSoda className="w-10 h-10 mx-auto text-yellow-500/80 mb-3 animate-[pulse_2s_infinite]" />
          <h4 className="font-black text-white text-sm uppercase tracking-wider mb-2">TELEMETRY PREPARATION</h4>
          <p className="max-w-md mx-auto leading-relaxed mb-4">
            Build your ultimate squad in the <b>DREAM XI BUILDER</b> first in natural positions before triggering match simulations.
          </p>
        </div>
      )}

      {/* Opponent selector deck */}
      {userSquad && !simResult && !isSimulating && (
        <div className="bg-slate-900/95 border border-white/5 rounded-2xl p-6 backdrop-blur shadow-2xl flex flex-col items-center select-none">
          <Trophy className="w-10 h-10 text-yellow-400 mb-3 animate-bounce" />
          <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2">BATTLE ARENA SIMULATOR</h2>
          <p className="text-xs text-gray-400 font-mono text-center max-w-md mb-6">
            Test your customized squad parameters, tactical formations, and chemistry indexes against iconic legends or community templates.
          </p>

          <div className="w-full max-w-md bg-black/40 border border-white/5 rounded-xl p-5 mb-6 flex flex-col gap-4 font-mono text-xs">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2">CHOOSE YOUR CHALLENGER:</span>
              <select
                value={selectedOpponentId}
                onChange={(e) => { playFutSound('click'); setSelectedOpponentId(e.target.value); }}
                className="w-full bg-slate-900 border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:border-yellow-400 text-xs font-bold"
              >
                {availableOpponents.map(opp => (
                  <option key={opp.id} value={opp.id}>
                    🤖 {opp.name} (OVR: {opp.rating}, CHEM: {opp.chemistry}%) - {opp.userName}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Versus preview badges */}
            <div className="flex justify-between items-center py-4 px-2 select-none">
              <div className="text-center font-sans">
                <div className="text-sm font-black text-white truncate max-w-[120px]">{userSquad.name}</div>
                <div className="text-[11px] font-mono text-emerald-400 uppercase">OVR: {userSquad.rating}</div>
              </div>
              <div className="text-xl font-black text-yellow-400 italic">VS</div>
              <div className="text-center font-sans">
                {(() => {
                  const opp = availableOpponents.find(o => o.id === selectedOpponentId);
                  return (
                    <>
                      <div className="text-sm font-black text-white truncate max-w-[120px]">{opp?.name || 'Challenger'}</div>
                      <div className="text-[11px] font-mono text-emerald-400 uppercase">OVR: {opp?.rating || 80}</div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <button
            onClick={triggerSimulation}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-xs tracking-wider uppercase flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-[0_4px_15px_rgba(234,179,8,0.3)] animate-pulse"
          >
            <Play className="w-4 h-4 fill-black" />
            START SIMULATION
          </button>
        </div>
      )}

      {/* Live Active Match Simulation */}
      {userSquad && (isSimulating || simResult) && (
        <div className="flex flex-col gap-5 select-none animate-[fade_0.3s_ease]">
          
          {/* Glowing Stadium Scoreboard card */}
          <div className="bg-slate-900/90 border border-white/5 rounded-2xl p-6 backdrop-blur shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Green neon goal lights backdrop on scoring */}
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent" />
            
            <div className="flex justify-between items-center w-full max-w-xl pb-2 border-b border-white/5 font-sans mb-5">
              <span className="text-[10px] text-[#10b981] font-black tracking-widest flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#10b981] animate-bounce" />
                STADIUM LIVE ARENA
              </span>
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 uppercase">
                <Timer className="w-3.5 h-3.5" />
                Time: <strong className="text-white">{minutes}' mins</strong>
              </span>
            </div>

            {/* Main Scoreboard layout */}
            <div className="flex w-full max-w-xl items-center justify-between font-sans px-4 select-none">
              <div className="text-center w-5/12">
                <h3 className="text-base sm:text-lg font-black text-white uppercase truncate">{userSquad.name}</h3>
                <span className="text-[10px] text-gray-500 font-mono block mt-1 uppercase">GAFFER: {userSquad.userName}</span>
              </div>

              {/* Score indicators */}
              <div className="text-center w-2/12 bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl">
                <span className="text-3xl font-black text-white leading-none tracking-tight">
                  {runningScore.scoreA} : {runningScore.scoreB}
                </span>
              </div>

              <div className="text-center w-5/12">
                <h3 className="text-base sm:text-lg font-black text-white uppercase truncate">
                  {simResult?.squadB.name || 'Opponent'}
                </h3>
                <span className="text-[10px] text-gray-500 font-mono block mt-1 uppercase">
                  GAFFER: {simResult?.squadB.userName || 'Bot'}
                </span>
              </div>
            </div>

            {/* Simulation Loading / Finishing and Action buttons */}
            {isSimulating ? (
              <div className="mt-5 w-full max-w-xs bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-150 filter drop-shadow-[0_0_2px_#10b981]"
                  style={{ width: `${(minutes / 90) * 100}%` }}
                />
              </div>
            ) : (
              <button
                onClick={() => { playFutSound('click'); setSimResult(null); }}
                className="mt-6 flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-[10px] uppercase px-4 py-2 rounded-lg border border-white/5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RE-DEBATE NEW MATCH
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 font-mono text-xs">
            {/* Live minute-by-minute Events Timeline (Col 1) */}
            <div className="md:col-span-7 bg-slate-900/90 border border-white/5 rounded-2xl p-5 backdrop-blur shadow-2xl flex flex-col">
              <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider block mb-4 border-b border-white/5 pb-2">
                MATCH TIMELINE TICKER (90')
              </span>

              {/* Scrollable event listings */}
              <div className="flex-1 max-h-[280px] overflow-y-auto flex flex-col gap-3 min-h-[220px] scrollbar-thin px-1">
                {visibleEvents.length === 0 && (
                  <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                    <Timer className="w-8 h-8 text-slate-600 mb-1.5 animate-pulse" />
                    Kickoff whistle sounded. Watching tactics play out...
                  </div>
                )}
                {visibleEvents.map((evt, idx) => {
                  let badgeColor = 'border-slate-800 bg-slate-900 text-gray-400';
                  if (evt.type === 'GOAL') badgeColor = 'border-emerald-500/20 bg-emerald-900/20 text-[#10b981]';
                  if (evt.type === 'YELLOW') badgeColor = 'border-yellow-500/20 bg-yellow-900/20 text-yellow-400';
                  if (evt.type === 'RED') badgeColor = 'border-red-500/20 bg-red-900/20 text-red-400';

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 border p-3 rounded-xl ${badgeColor}`}
                    >
                      <span className="font-extrabold text-[#ffe58f] block min-w-[28px]">{evt.time}' min</span>
                      <span className="leading-relaxed font-sans text-xs text-slate-100">{evt.description}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Scorecard statistics & MVP reveal (Col 2) */}
            {simResult && !isSimulating && (
              <div className="md:col-span-5 flex flex-col gap-4 animate-[fade_0.3s_ease]">
                {/* Statistics percentages summary */}
                <div className="bg-slate-900/90 border border-white/5 rounded-2xl p-5 backdrop-blur shadow-2xl">
                  <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider block mb-4 border-b border-white/5 pb-1">
                    <BarChart2 className="w-4 h-4 text-[#10b981] inline mr-1 mb-0.5" />
                    MATCH TELEMETRY STATS
                  </span>

                  <div className="flex flex-col gap-4">
                    {/* Possession block */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-gray-300 mb-1">
                        <span>{simResult.stats.possessionA}% POSSESSION</span>
                        <span>{simResult.stats.possessionB}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
                        <div className="bg-emerald-500 h-1.5" style={{ width: `${simResult.stats.possessionA}%` }} />
                        <div className="bg-yellow-400 h-1.5" style={{ width: `${simResult.stats.possessionB}%` }} />
                      </div>
                    </div>

                    {/* Shots block */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-gray-300 mb-1">
                        <span>{simResult.stats.shotsA} TOTAL SHOTS</span>
                        <span>{simResult.stats.shotsB}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
                        <div className="bg-emerald-500 h-1.5" style={{ width: `${(simResult.stats.shotsA / (simResult.stats.shotsA + simResult.stats.shotsB)) * 100}%` }} />
                        <div className="bg-yellow-400 h-1.5" style={{ width: `${(simResult.stats.shotsB / (simResult.stats.shotsA + simResult.stats.shotsB)) * 100}%` }} />
                      </div>
                    </div>

                    {/* Fouls block */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-gray-300 mb-1">
                        <span>{simResult.stats.foulsA} FOULS COMMITTED</span>
                        <span>{simResult.stats.foulsB}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
                        <div className="bg-emerald-500 h-1.5" style={{ width: `${(simResult.stats.foulsA / (simResult.stats.foulsA + simResult.stats.foulsB)) * 100}%` }} />
                        <div className="bg-yellow-400 h-1.5" style={{ width: `${(simResult.stats.foulsB / (simResult.stats.foulsA + simResult.stats.foulsB)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* MVP Star Flip-Card Reveal */}
                <div className="bg-gradient-to-b from-[#1c1435] to-slate-900 border border-purple-500/25 rounded-2xl p-4 shadow-xl flex flex-col items-center">
                  <span className="text-[10px] text-purple-400 font-extrabold tracking-widest uppercase mb-3 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400 animate-spin-slow" />
                    MATCH PLAYER MVP (OVR)
                  </span>

                  <AnimatePresence>
                    <motion.div
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="origin-center"
                    >
                      <HolographicCard player={simResult.mvp} size="sm" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
