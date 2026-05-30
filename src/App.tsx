import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Trophy,
  Activity,
  User,
  Swords,
  Compass,
  Scale,
  Cpu,
  Bookmark,
  ChevronRight,
  Flame
} from 'lucide-react';

import { Player, Squad, Battle, SocialPost, UserProfile } from './types';
import { playFutSound } from './utils';

// Import Modular Components
import PitchBuilder from './components/PitchBuilder';
import AIAnalysis from './components/AIAnalysis';
import MatchSimulator from './components/MatchSimulator';
import BattleArena from './components/BattleArena';
import SocialFeed from './components/SocialFeed';
import LegendsDatabase from './components/LegendsDatabase';
import UserProfileView from './components/UserProfileView';
import LeaderboardsView from './components/LeaderboardsView';

type TabName = 'builder' | 'simulator' | 'arena' | 'feed' | 'database' | 'profile' | 'leaderboards';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('builder');

  // Core telemetry States
  const [loading, setLoading] = useState(true);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [squadsList, setSquadsList] = useState<Squad[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [feedPosts, setFeedPosts] = useState<SocialPost[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Active sandbox entities
  const [activeSquad, setActiveSquad] = useState<Squad | undefined>(undefined);
  const [squadForAnalysis, setSquadForAnalysis] = useState<Squad | null>(null);

  // Load all telemetry endpoints concurrently on startup
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [resPlayers, resSquads, resBattles, resFeed, resProfile] = await Promise.all([
          fetch('/api/players'),
          fetch('/api/squads'),
          fetch('/api/battles'),
          fetch('/api/feed'),
          fetch('/api/profile'),
        ]);

        const [players, squads, battlesList, feed, userProfile] = await Promise.all([
          resPlayers.json(),
          resSquads.json(),
          resBattles.json(),
          resFeed.json(),
          resProfile.json(),
        ]);

        setAvailablePlayers(players);
        setSquadsList(squads);
        setBattles(battlesList);
        setFeedPosts(feed);
        setProfile(userProfile);
      } catch (err) {
        console.error('Failed to boot telemetry metrics', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const refreshSquadsList = async () => {
    try {
      const res = await fetch('/api/squads');
      const data = await res.json();
      setSquadsList(data);
    } catch (e) {
      console.error('Failed to sync squads list', e);
    }
  };

  const refreshBattlesFeed = async () => {
    try {
      const res = await fetch('/api/battles');
      const data = await res.json();
      setBattles(data);
    } catch (e) {
      console.error('Failed to sync battle feed', e);
    }
  };

  const refreshFeedPosts = async () => {
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      setFeedPosts(data);
    } catch (e) {
      console.error('Failed to sync social posts', e);
    }
  };

  const handleSetSquadInPitch = (squad: Squad) => {
    setActiveSquad(squad);
    refreshSquadsList();
    refreshFeedPosts(); // Shared squads embed in client feeds
  };

  const handleAnalyzeSquadTrigger = (squad: Squad) => {
    setSquadForAnalysis(squad);
    setActiveTab('builder'); // Ensure viewer focuses on builder context with analysis pane
  };

  const handleTabChange = (tab: TabName) => {
    playFutSound('click');
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono text-center">
        <div className="relative mb-4">
          <Activity className="w-12 h-12 text-[#10b981] animate-pulse" />
          <Trophy className="w-5 h-5 text-yellow-500 absolute bottom-0 right-0 animate-bounce" />
        </div>
        <p className="text-xs uppercase tracking-widest text-[#10b981] italic font-bold">
          CONSTRUCTING DREAM XI LABS TELEMETRY...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans select-none antialiased relative">
      
      {/* Ambient stadium halo lamps background graphics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none select-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none select-none" />

      {/* 1. Header Toolbar Banner */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-30 select-none">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleTabChange('builder')}>
            <span className="bg-gradient-to-tr from-[#10b981] to-emerald-400 p-2 rounded-xl text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Trophy className="w-5 h-5 text-black fill-black" />
            </span>
            <div className="leading-none">
              <h1 className="text-base font-black tracking-tighter text-white flex items-center gap-1">
                DREAM XI <span className="text-[10px] text-yellow-400 font-mono tracking-widest bg-yellow-400/10 px-1.5 py-0.5 rounded leading-none">LABS</span>
              </h1>
              <p className="text-[9px] text-[#22c55e] font-mono tracking-wider font-extrabold uppercase mt-1">
                stadium telemetry active
              </p>
            </div>
          </div>

          {/* Activity status ticker bento box */}
          <div className="hidden sm:flex items-center gap-5 font-mono text-[10px] text-gray-400 uppercase leading-none">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ffe58f]" />
              GAFFERS: <strong className="text-white">Active</strong>
            </span>
            <span className="flex items-center gap-1.5 border-l border-white/10 pl-5">
              👑 STREAK: <strong className="text-yellow-400">Level 4</strong>
            </span>
            <span className="flex items-center gap-1.5 border-l border-white/10 pl-5">
              🔥 LIVELY ARENA: <strong className="text-white">{battles.length} active</strong>
            </span>
          </div>

        </div>
      </header>

      {/* 2. Navigation Dashboard tab panels */}
      <nav className="border-b border-white/5 bg-slate-950/40 py-2 select-none">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto font-mono text-xs whitespace-nowrap scrollbar-none">
          
          <button
            onClick={() => handleTabChange('builder')}
            className={`px-4.5 py-3 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-slate-900 text-white border-b-2 border-yellow-400 shadow-[0_4px_12px_rgba(250,204,21,0.15)]'
                : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            📋 Pitch Builder
          </button>

          <button
            onClick={() => handleTabChange('feed')}
            className={`px-4.5 py-3 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-slate-900 text-white border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            📢 Social Feed
          </button>

          <button
            onClick={() => handleTabChange('arena')}
            className={`px-4.5 py-3 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'arena'
                ? 'bg-slate-900 text-white border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            🛡️ Match Debates
          </button>

          <button
            onClick={() => handleTabChange('simulator')}
            className={`px-4.5 py-3 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-slate-900 text-white border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            🤖 Match Sims
          </button>

          <button
            onClick={() => handleTabChange('database')}
            className={`px-4.5 py-3 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'database'
                ? 'bg-slate-900 text-white border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            🔍 Player DB
          </button>

          <button
            onClick={() => handleTabChange('leaderboards')}
            className={`px-4.5 py-3 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'leaderboards'
                ? 'bg-slate-900 text-white border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            🏆 Leaderboard
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`px-4.5 py-3 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            👤 My Gaffer
          </button>

        </div>
      </nav>

      {/* 3. Main content body renderers */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'builder' && (
              <div className="flex flex-col gap-6">
                <PitchBuilder
                  userId={profile?.id || 'u-user'}
                  userName={profile?.userName || 'Gaffer_XI'}
                  availablePlayers={availablePlayers}
                  activeSquad={activeSquad}
                  onSetSquad={handleSetSquadInPitch}
                  onAnalyzeSquad={handleAnalyzeSquadTrigger}
                />

                {/* Inline visual drawer representing Gemini AI Analysis */}
                <AIAnalysis squad={squadForAnalysis} />
              </div>
            )}

            {activeTab === 'feed' && (
              <SocialFeed
                userId={profile?.id || 'u-user'}
                userName={profile?.userName || 'Gaffer_XI'}
                userBio={profile?.bio || 'Hype-Lord coach.'}
                feedPosts={feedPosts}
                onSetSquad={handleSetSquadInPitch}
                onRefreshFeed={refreshFeedPosts}
                onSwitchTab={(t) => setActiveTab(t as TabName)}
              />
            )}

            {activeTab === 'arena' && (
              <BattleArena
                userId={profile?.id || 'u-user'}
                userName={profile?.userName || 'Gaffer_XI'}
                battles={battles}
                squadsList={squadsList}
                onRefreshBattles={refreshBattlesFeed}
              />
            )}

            {activeTab === 'simulator' && (
              <MatchSimulator
                userSquad={activeSquad || squadsList.find(s => s.userId === profile?.id) || null}
                savedSquads={squadsList}
              />
            )}

            {activeTab === 'database' && (
              <LegendsDatabase />
            )}

            {activeTab === 'leaderboards' && (
              <LeaderboardsView squadsList={squadsList} />
            )}

            {activeTab === 'profile' && profile && (
              <UserProfileView
                profile={profile}
                squadsList={squadsList}
                onUpdateProfile={(p) => setProfile(p)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-white/5 bg-slate-950/60 py-6 text-center select-none mt-auto">
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-none">
          © {new Date().getFullYear()} DREAM XI INC • STADIUM HYBRID SYSTEMS INC
        </p>
      </footer>

    </div>
  );
}
