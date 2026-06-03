import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Vote, MessageSquare, Flame, CheckCircle, PlusCircle, AlertCircle, X, Plus } from 'lucide-react';
import { Battle, Comment, Squad } from '../types';
import { playFutSound } from '../utils';
import { useTranslation } from '../lib/LanguageContext';

interface BattleArenaProps {
  userId: string;
  userName: string;
  battles: Battle[];
  squadsList: Squad[];
  onRefreshBattles: () => void;
}

export default function BattleArena({
  userId,
  userName,
  battles,
  squadsList,
  onRefreshBattles,
}: BattleArenaProps) {
  const { t } = useTranslation();
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [activeComments, setActiveComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // New battle creator form controls
  const [showAddBattleModal, setShowAddBattleModal] = useState(false);
  const [squadAId, setSquadAId] = useState('');
  const [squadBId, setSquadBId] = useState('');
  const [submittingBattle, setSubmittingBattle] = useState(false);

  // Prefilter squads available for battles
  const battleEligibleSquads = squadsList;

  useEffect(() => {
    if (battles.length > 0 && !activeBattleId) {
      setActiveBattleId(battles[0].id);
    }
  }, [battles, activeBattleId]);

  // Sync active comments
  useEffect(() => {
    if (!activeBattleId) return;

    let ignore = false;
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/comments/${activeBattleId}`);
        if (ignore) return;
        const data = await res.json();
        setActiveComments(data);
      } catch (err: any) {
        if (ignore) return;
        console.warn('Failed to load active discussion comment threads', err?.message || err);
      } finally {
        if (!ignore) {
          setLoadingComments(false);
        }
      }
    };

    fetchComments();

    return () => {
      ignore = true;
    };
  }, [activeBattleId]);

  const castVote = async (battleId: string, team: 'A' | 'B') => {
    playFutSound('success');
    try {
      const res = await fetch(`/api/battles/${battleId}/vote`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ userId, team }),
      });
      const data = await res.json();
      
      if (data.error) {
         alert(data.error);
         return;
      }
      
      onRefreshBattles();
    } catch (e: any) {
      console.warn('Failed to register tactical vote', e?.message || e);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeBattleId) return;

    playFutSound('click');
    const commentPayload = {
      targetId: activeBattleId,
      userId,
      userName,
      text: commentText,
    };

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentPayload),
      });
      const data = await res.json();
      if (data.success) {
        setCommentText('');
        // Append directly
        setActiveComments(prev => [...prev, data.comment]);
        onRefreshBattles();
      }
    } catch (e: any) {
      console.warn('Failed to post discussion take', e?.message || e);
    }
  };

  const createBattle = async () => {
    if (!squadAId || !squadBId) {
      alert(t('Must select two valid hybrid squads to initiate combat!'));
      return;
    }
    if (squadAId === squadBId) {
      alert(t('Cannot battle a squad against itself! That breaks match laws.'));
      return;
    }

    setSubmittingBattle(true);
    playFutSound('success');
    
    try {
      const res = await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ squadA_id: squadAId, squadB_id: squadBId }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddBattleModal(false);
        setSquadAId('');
        setSquadBId('');
        onRefreshBattles();
        setActiveBattleId(data.battle.id);
      }
    } catch (e: any) {
      console.warn('Failed to challenge teams', e?.message || e);
    } finally {
      setSubmittingBattle(false);
    }
  };

  const activeBattle = battles.find(b => b.id === activeBattleId);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 select-none">
      
      {/* Debate Header */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5 flex-wrap gap-4 select-none">
        <div>
          <span className="text-[10px] text-yellow-400 font-black uppercase tracking-widest flex items-center gap-1 mb-1">
            <Flame className="w-3.5 h-3.5 fill-yellow-400 animate-pulse text-yellow-400" />
            {t("LIVE COMMUNITY DEBATES")}
          </span>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">{t("SQUAD COMBAT ARENA")}</h1>
        </div>
        
        <button
          onClick={() => { playFutSound('click'); setShowAddBattleModal(true); }}
          className="flex items-center gap-1.5 bg-yellow-400 hover:brightness-110 text-black px-4 py-2.5 rounded-xl text-xs font-black shadow-[0_0_12px_rgba(250,204,21,0.3)] transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t("CHALLENGE IN BATTLE")}
        </button>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Battle selector list (Col 1) */}
        <div className="lg:col-span-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold mb-1">{t("ACTIVE DUELS:")}</span>
          {battles.length === 0 ? (
            <div className="text-center py-10 bg-slate-900 border border-white/5 rounded-2xl text-gray-500">
              {t("No active duels compiled. Launch a duel above!")}
            </div>
          ) : (
            battles.map(bat => {
              const active = bat.id === activeBattleId;
              const totalV = bat.votesA + bat.votesB;

              return (
                <button
                  key={bat.id}
                  onClick={() => { playFutSound('click'); setActiveBattleId(bat.id); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-sans ${
                    active
                      ? 'bg-slate-900 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Swords className="w-3 h-3 text-emerald-400" /> {t("Duel")}
                    </span>
                    <span className="text-[9px] text-[#ffe58f] font-mono uppercase tracking-widest">
                      {totalV} {t("Votes")}
                    </span>
                  </div>
                  <div className="text-white font-black truncate uppercase mb-1">{bat.squadA.name}</div>
                  <div className="text-yellow-400 font-extrabold text-[10px] italic mb-1">{t("VS")}</div>
                  <div className="text-white font-black truncate uppercase">{bat.squadB.name}</div>
                </button>
              );
            })
          )}
        </div>

        {/* Selected Duel Debate Area (Col 2) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {activeBattle ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Squad Voting card deck */}
              <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl relative overflow-hidden shadow-xl">
                
                {/* Voting percentages metrics */}
                {(() => {
                  const total = activeBattle.votesA + activeBattle.votesB || 1;
                  const pctA = Math.round((activeBattle.votesA / total) * 100);
                  const pctB = 100 - pctA;

                  return (
                    <div className="flex flex-col gap-5">
                      
                      {/* Versus Header layout */}
                      <div className="flex justify-between items-center sm:px-6 flex-col sm:flex-row gap-4 select-none">
                        
                        {/* Squad A */}
                        <div className="text-center sm:text-left flex-1 font-sans">
                          <h3 className="font-extrabold text-sm uppercase text-gray-500 font-mono tracking-widest leading-none mb-1">{t("SQUAD A")}</h3>
                          <h2 className="text-base font-black text-white uppercase truncate">{activeBattle.squadA.name}</h2>
                          <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wide mt-1">{t("OVR")}: {activeBattle.squadA.rating} • {t("CHEMISTRY:")} {activeBattle.squadA.chemistry}%</div>
                          <button
                            onClick={() => castVote(activeBattle.id, 'A')}
                            className="mt-3 bg-emerald-900/40 border border-emerald-500/25 text-emerald-400 hover:text-white hover:bg-emerald-800 transition px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                          >
                            {t("Vote")} {activeBattle.squadA.name}
                          </button>
                        </div>

                        <div className="text-center font-sans">
                          <div className="text-2xl font-black text-yellow-400 italic">{t("VS")}</div>
                          <span className="text-[9px] font-mono text-gray-500 block mt-1 uppercase">{t("ARENA POLL")}</span>
                        </div>

                        {/* Squad B */}
                        <div className="text-center sm:text-right flex-1 font-sans">
                          <h3 className="font-extrabold text-sm uppercase text-gray-500 font-mono tracking-widest leading-none mb-1">{t("SQUAD B")}</h3>
                          <h2 className="text-base font-black text-white uppercase truncate">{activeBattle.squadB.name}</h2>
                          <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wide mt-1">{t("OVR")}: {activeBattle.squadB.rating} • {t("CHEMISTRY:")} {activeBattle.squadB.chemistry}%</div>
                          <button
                            onClick={() => castVote(activeBattle.id, 'B')}
                            className="mt-3 bg-emerald-900/40 border border-emerald-500/25 text-emerald-400 hover:text-white hover:bg-emerald-800 transition px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                          >
                            {t("Vote")} {activeBattle.squadB.name}
                          </button>
                        </div>
                      </div>

                      {/* Vote share charts bar */}
                      <div className="w-full bg-slate-800 rounded-2xl h-8 relative overflow-hidden flex font-sans font-black text-xs text-white">
                        <div
                          className="bg-[#10b981] h-full transition-all duration-350 flex items-center pl-4 filter drop-shadow-[0_0_3px_#10b981]"
                          style={{ width: `${pctA}%` }}
                        >
                          {pctA > 15 && `${pctA}%`}
                        </div>
                        <div
                          className="bg-yellow-400 h-full transition-all duration-350 flex items-center justify-end pr-4 text-black"
                          style={{ width: `${pctB}%` }}
                        >
                          {pctB > 15 && `${pctB}%`}
                        </div>
                      </div>

                      <div className="flex justify-between text-[10px] text-gray-400 font-bold select-none px-1">
                        <span>{activeBattle.votesA} {t("TOTAL VOTES CAST")}</span>
                        <span>{activeBattle.votesB} {t("VOTES CAST")}</span>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Debate Feed comment chain */}
              <div className="bg-slate-900/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block border-b border-white/5 pb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-yellow-400 inline mr-1 mb-0.5" />
                  {t("TACTICAL DISCUSSION FEED")} ({activeComments.length})
                </span>

                {/* Submit opinion Form */}
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t("Publish your squad analytical counter-theory or trash talk...")}
                    className="flex-1 bg-black border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-yellow-400 text-xs text-xs font-bold font-sans"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-black uppercase text-[10px] font-mono cursor-pointer hover:brightness-110 active:scale-95 transition"
                  >
                    {t("POST OPINION")}
                  </button>
                </form>

                {/* Discussions lists comments */}
                <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto">
                  {loadingComments ? (
                    <div className="text-center py-6 text-gray-500">{t("Loading opinions...")}</div>
                  ) : activeComments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                      <Flame className="w-6 h-6 text-slate-700 mb-1" />
                      {t("Debates are cool down. Post first take to ignite fire!")}
                    </div>
                  ) : (
                    activeComments.map(c => (
                      <div key={c.id} className="bg-black/30 border border-white/5 p-3 rounded-xl flex flex-col gap-1 text-xs">
                        <div className="flex justify-between items-baseline font-mono">
                          <span className="font-extrabold text-yellow-400">@{c.userName}</span>
                          <span className="text-[9px] text-gray-500">
                            {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed font-sans">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="p-10 text-center bg-slate-900/60 border border-white/5 rounded-2xl text-gray-400 font-mono">
              {t("Choose an active duel on the left to review telemetry debate statistics or cast votes!")}
            </div>
          )}
        </div>

      </div>

      {/* CREATE BATTLE CHALLENGE MODAL DRAW */}
      <AnimatePresence>
        {showAddBattleModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setShowAddBattleModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-black text-white text-base tracking-wider uppercase mb-4 flex items-center gap-1.5 font-sans">
                <Swords className="w-5 h-5 text-yellow-400" />
                {t("Trigger Squad Combat")}
              </h3>

              <div className="flex flex-col gap-5 font-mono text-xs">
                
                {/* Squad 1 selection */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">{t("CHALLENGE SQUAD A:")}</label>
                  <select
                    value={squadAId}
                    onChange={(e) => { playFutSound('click'); setSquadAId(e.target.value); }}
                    className="w-full bg-black border border-white/10 text-white rounded-lg p-3 font-mono font-bold"
                  >
                    <option value="">{t("-- PICK COMBATANT SQUAD --")}</option>
                    {battleEligibleSquads.map(sq => (
                      <option key={sq.id} value={sq.id}>
                        🛡️ {sq.name} ({t("OVR")}: {sq.rating}, {t("CHEMISTRY:")} {sq.chemistry}%) - @{sq.userName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-center text-yellow-500 font-extrabold italic text-sm py-1 font-sans">
                  {t("VERSUS")}
                </div>

                {/* Squad 2 selection */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1 font-mono">{t("CHALLENGE SQUAD B:")}</label>
                  <select
                    value={squadBId}
                    onChange={(e) => { playFutSound('click'); setSquadBId(e.target.value); }}
                    className="w-full bg-black border border-white/10 text-white rounded-lg p-3 font-mono font-bold"
                  >
                    <option value="">{t("-- PICK COMBATANT SQUAD --")}</option>
                    {battleEligibleSquads.map(sq => (
                      <option key={sq.id} value={sq.id}>
                        🛡️ {sq.name} ({t("OVR")}: {sq.rating}, {t("CHEMISTRY:")} {sq.chemistry}%) - @{sq.userName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 flex gap-2.5 items-start mt-1">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-400 leading-normal font-sans">
                    {t("Locking this duel creates a public voting deck. Fans can review overall ratings, chemistry linkages, playstyle, and cast live votes!")}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5 font-mono">
                  <button
                    onClick={() => setShowAddBattleModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold uppercase text-[10px]"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    onClick={createBattle}
                    disabled={submittingBattle || !squadAId || !squadBId}
                    className="px-5 py-2 bg-yellow-400 hover:brightness-110 text-black rounded-lg font-black uppercase text-[10px] disabled:opacity-40"
                  >
                    {submittingBattle ? t('LAUNCHING...') : t('LAUNCH DUEL')}
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
