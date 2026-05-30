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
  Flame,
  Tv,
  MessageCircle,
  TrendingUp,
  Share2,
  ShieldAlert
} from 'lucide-react';

import { Player, Squad, Battle, SocialPost, UserProfile } from './types';
import { playFutSound } from './utils';

// Import Auth hooks & Subpages
import { useAuth } from './hooks/useAuth';
import LoginPage from './app/login/page';
import SignupPage from './app/signup/page';
import { loadSquadsFromCloud } from './lib/supabaseDb';
import { supabase } from './lib/supabase';

// Import Modular Components
import PitchBuilder from './components/PitchBuilder';
import AIAnalysis from './components/AIAnalysis';
import MatchSimulator from './components/MatchSimulator';
import BattleArena from './components/BattleArena';
import SocialFeed from './components/SocialFeed';
import LegendsDatabase from './components/LegendsDatabase';
import UserProfileView from './components/UserProfileView';
import LeaderboardsView from './components/LeaderboardsView';
import HolographicCard from './components/HolographicCard';
import UserDropdown from './components/UserDropdown';
import ProtectedRoute from './components/ProtectedRoute';
import MySquadsView from './components/MySquadsView';

type TabName = 'builder' | 'simulator' | 'arena' | 'feed' | 'database' | 'profile' | 'leaderboards' | 'my-squads' | 'settings';

// Demo top stars for the floating hero showcase
const HERO_SHOWCASE_PLAYERS: Player[] = [
  {
    id: 'hero-messi',
    name: 'Lionel Messi',
    rating: 98,
    position: 'ST',
    category: 'ST',
    nation: 'Argentina',
    nationFlag: '🇦🇷',
    club: 'Inter Miami',
    clubLogo: '🦩',
    league: 'MLS',
    era: 'Current',
    playstyle: 'Technical Dribbler',
    cardType: 'TOTY',
    auraRating: 99,
    avatarSeed: 'messi',
    stats: { pac: 91, sho: 96, pas: 98, dri: 99, def: 40, phy: 72 }
  },
  {
    id: 'hero-ronaldo',
    name: 'Cristian Ronaldo',
    rating: 97,
    position: 'ST',
    category: 'ST',
    nation: 'Portugal',
    nationFlag: '🇵🇹',
    club: 'Al Nassr',
    clubLogo: '🟡',
    league: 'Saudi Pro',
    era: 'Current',
    playstyle: 'Power Finisher',
    cardType: 'Legend',
    auraRating: 99,
    avatarSeed: 'ronaldo',
    stats: { pac: 93, sho: 98, pas: 82, dri: 88, def: 35, phy: 90 }
  },
  {
    id: 'hero-ronaldinho',
    name: 'Ronaldinho',
    rating: 95,
    position: 'LW',
    category: 'ST',
    nation: 'Brazil',
    nationFlag: '🇧🇷',
    club: 'Barcelona',
    clubLogo: '🔵🔴',
    league: 'Icons',
    era: 'Legend',
    playstyle: 'Trickster Supreme',
    cardType: 'Icon',
    auraRating: 98,
    avatarSeed: 'ronaldinho',
    stats: { pac: 94, sho: 89, pas: 91, dri: 97, def: 38, phy: 81 }
  }
];

export default function App() {
  const { user, profile: authProfile, loading: authLoading, setProfile: setAuthProfile } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');

  const [activeTab, setActiveTab] = useState<TabName>('builder');

  // Core telemetry States
  const [loading, setLoading] = useState(true);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [squadsList, setSquadsList] = useState<Squad[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [feedPosts, setFeedPosts] = useState<SocialPost[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active sandbox entities
  const [activeSquad, setActiveSquad] = useState<Squad | undefined>(undefined);
  const [squadForAnalysis, setSquadForAnalysis] = useState<Squad | null>(null);

  // Set premium authProfile if loaded from Supabase Cloud
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
    }
  }, [authProfile]);

  // Listen for Google Auth success from popup window
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { hash, search } = event.data;
        try {
          if (search) {
            const params = new URLSearchParams(search);
            const code = params.get('code');
            if (code) {
              const { error } = await supabase.auth.exchangeCodeForSession(code);
              if (error) {
                console.error('Error exchanging code for session:', error.message);
              } else {
                console.log('Successfully completed PKCE OAuth session exchange.');
              }
            }
          }
          
          if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            const access_token = hashParams.get('access_token');
            const refresh_token = hashParams.get('refresh_token');
            if (access_token && refresh_token) {
              const { error } = await supabase.auth.setSession({
                access_token,
                refresh_token
              });
              if (error) {
                console.error('Error setting OAuth session from hash:', error.message);
              } else {
                console.log('Successfully completed Implicit OAuth session set.');
              }
            }
          }
        } catch (err) {
          console.error('Failed to parse and complete OAuth session:', err);
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  // Load all telemetry endpoints concurrently on startup
  useEffect(() => {
    let ignore = false;
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      let attempts = 0;
      const maxAttempts = 6;
      let delay = 1000;

      while (attempts < maxAttempts) {
        try {
          if (ignore) return;
          const [resPlayers, resSquads, resBattles, resFeed, resProfile] = await Promise.all([
            fetch('/api/players'),
            fetch('/api/squads'),
            fetch('/api/battles'),
            fetch('/api/feed'),
            fetch('/api/profile'),
          ]);

          if (!resPlayers.ok || !resSquads.ok || !resBattles.ok || !resFeed.ok || !resProfile.ok) {
            throw new Error(`Non-ok API response received (Players: ${resPlayers.status}, Squads: ${resSquads.status}, Battles: ${resBattles.status})`);
          }

          if (ignore) return;

          const [players, squads, battlesList, feed, userProfile] = await Promise.all([
            resPlayers.json(),
            resSquads.json(),
            resBattles.json(),
            resFeed.json(),
            resProfile.json(),
          ]);

          if (ignore) return;

          setAvailablePlayers(players);
          
          if (user) {
            try {
              const cloudSquads = await loadSquadsFromCloud(user.id);
              if (ignore) return;
              const mergedSquads = [
                ...cloudSquads,
                ...squads.filter((s: Squad) => !cloudSquads.some(cs => cs.id === s.id))
              ];
              setSquadsList(mergedSquads);
            } catch (cloudErr) {
              console.warn('Could not integrate cloud squads, using seed squads:', cloudErr);
              if (ignore) return;
              setSquadsList(squads);
            }
          } else {
            setSquadsList(squads);
          }

          setBattles(battlesList);
          setFeedPosts(feed);
          if (authProfile) {
            setProfile(authProfile);
          } else {
            setProfile(userProfile);
          }
          
          setError(null);
          break; // Successfully booted all endpoints!
        } catch (err) {
          attempts++;
          console.warn(`[Dream XI System] Telemetry boot attempt ${attempts}/${maxAttempts} failed:`, err);
          if (attempts >= maxAttempts) {
            if (!ignore) {
              setError(`Could not establish connection with tactical database server. Make sure dev server is run on port 3000.`);
            }
          } else {
            // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 1.5;
          }
        }
      }

      if (!ignore) {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadInitialData();
    }

    return () => {
      ignore = true;
    };
  }, [user, authLoading, authProfile]);

  const refreshSquadsList = async () => {
    try {
      const res = await fetch('/api/squads');
      const seedSquads = await res.json();
      
      if (user) {
        const cloudSquads = await loadSquadsFromCloud(user.id);
        const mergedSquads = [
          ...cloudSquads,
          ...seedSquads.filter((s: Squad) => !cloudSquads.some(cs => cs.id === s.id))
        ];
        setSquadsList(mergedSquads);
      } else {
        setSquadsList(seedSquads);
      }
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
    // Smooth scroll to top of pitch/tabs area
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07060b] text-white flex flex-col items-center justify-center font-mono text-center px-4 relative overflow-hidden">
        {/* Glowing background spotlights */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 rounded-full border-t-2 border-l-2 border-emerald-500 border-r-2 border-r-transparent shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          />
          <Trophy className="w-6 h-6 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
        </div>
        <p className="text-xs font-black tracking-[0.2em] text-emerald-400 uppercase leading-none select-none">
          SECURE SQUAD CHECK IN...
        </p>
        <p className="text-[9px] text-gray-500 mt-2.5 uppercase tracking-widest leading-none">VERIFYING STADIUM CREDENTIALS</p>
      </div>
    );
  }



  if (error) {
    return (
      <div className="min-h-screen bg-[#07060b] text-white flex flex-col items-center justify-center font-mono text-center px-4 relative overflow-hidden">
        {/* Glowing background spotlights */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mb-6">
          <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
        </div>
        <p className="text-xs font-black tracking-[0.2em] text-red-500 uppercase italic leading-none">
          TELEMETRY OFFLINE
        </p>
        <p className="text-[10px] text-gray-400 mt-2.5 max-w-md uppercase leading-normal tracking-wide">
          {error}
        </p>
        
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            window.location.reload();
          }}
          className="mt-6 px-5 py-2 border border-red-500/30 hover:border-emerald-500 text-red-300 hover:text-emerald-400 text-[10px] uppercase font-black tracking-widest rounded-md bg-transparent hover:bg-emerald-500/10 cursor-pointer shadow-sm hover:shadow-emerald-500/20 active:scale-95 transition-all animate-bounce"
        >
          FORCE RELOAD METRICS
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07060b] text-white flex flex-col items-center justify-center font-mono text-center px-4 relative overflow-hidden">
        {/* Glowing background spotlights */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 rounded-full border-t-2 border-l-2 border-emerald-500 border-r-2 border-r-transparent"
          />
          <Trophy className="w-6 h-6 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-xs font-black tracking-[0.2em] text-emerald-400 uppercase italic leading-none">
          GENERATING FUTURISTIC STADIUM TELEMETRY...
        </p>
        <p className="text-[9px] text-gray-500 mt-2.5 uppercase tracking-widest leading-none">LET THEM COOK • DREAM XI LABS</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen custom-grid-bg text-slate-100 flex flex-col font-sans select-none antialiased relative pb-20 sm:pb-8">
      
      {/* Heavy colorful glowing neon ambient backdrops */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none select-none" />
      <div className="absolute top-1/4 right-1/4 w-[650px] h-[450px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none select-none" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none select-none" />

      {/* 1. Header Navigation Bar */}
      <header className="border-b border-white/10 bg-[#0B0B0F]/90 backdrop-blur sticky top-0 z-30 select-none">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between flex-wrap gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTabChange('builder')}>
            <span className="bg-gradient-to-tr from-emerald-400 via-purple-500 to-pink-500 p-2.5 rounded-2xl text-black shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:scale-105 transition-all duration-300">
              <Trophy className="w-5 h-5 text-black fill-black" />
            </span>
            <div className="leading-none">
              <h1 className="text-lg font-black tracking-tighter text-white flex items-center gap-1">
                DREAM XI <span className="text-[10px] text-yellow-400 font-mono tracking-widest bg-yellow-400/10 px-1.5 py-0.5 rounded leading-none">LABS</span>
              </h1>
              <p className="text-[9px] text-emerald-400 font-mono tracking-wider font-black uppercase mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE STADIUM FEED
              </p>
            </div>
          </div>

          {/* Activity status ticker bento box */}
          <div className="hidden md:flex items-center gap-5 font-mono text-[10px] text-gray-300 uppercase leading-none bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              STATUS: <strong className="text-white">COOKING</strong>
            </span>
            <span className="flex items-center gap-1.5 border-l border-white/10 pl-5">
              👑 STREAK: <strong className="text-yellow-400">Level 4</strong>
            </span>
            <span className="flex items-center gap-1.5 border-l border-white/10 pl-5">
              🔥 ARENAS: <strong className="text-pink-400">{battles.length} active</strong>
            </span>
          </div>

          {/* User Auth Action Segment */}
          <div className="flex items-center gap-3" id="header-auth-status">
            {user && profile ? (
              <UserDropdown
                profile={profile}
                onNavigate={(tab) => {
                  playFutSound('click');
                  setActiveTab(tab);
                }}
                onLogout={async () => {
                  playFutSound('click');
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
              />
            ) : (
              <div className="flex items-center gap-2 font-mono text-[10px]" id="header-auth-buttons">
                <button
                  onClick={() => {
                    playFutSound('click');
                    setActiveTab('profile'); // Switch to profile page which prompts login
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition font-black uppercase cursor-pointer"
                  id="header-login-btn"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    playFutSound('click');
                    setActiveTab('profile'); // Switch to profile page which prompts login
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:scale-105 active:scale-95 text-black font-sans font-black uppercase transition cursor-pointer shadow-[0_0_10px_rgba(52,211,153,0.2)]"
                  id="header-signup-btn"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. TikTok Meets FIFA Spectacular Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 border-b border-white/10 bg-gradient-to-b from-purple-950/10 via-black/40 to-[#0B0B0F]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center leading-none text-left select-none relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest mb-6 w-fit animate-pulse">
              <Flame className="w-4 h-4 text-emerald-400" /> Gen Z Football Headquarters
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none uppercase mb-6 drop-shadow-md">
              Build The Squad <br /> 
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                Everyone Will Argue About.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-medium font-sans leading-relaxed tracking-tight max-w-xl mb-8">
              Create your Dream XI lineups with absolute custom tactics. Pitch your team in match simulations, trigger real-time expert AI analysis, vote in live debate face-offs, and showcase your sovereign coach Aura Score.
            </p>

            {/* Micro Engagement Stats Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mb-8">
              <div className="bg-[#0B0B0F]/60 border border-white/5 p-4 rounded-2xl relative overflow-hidden backdrop-blur">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">99+</div>
                <div className="text-[10px] text-gray-400 uppercase font-mono mt-1 font-bold">Aura Capacity</div>
              </div>
              <div className="bg-[#0B0B0F]/60 border border-white/5 p-4 rounded-2xl relative overflow-hidden backdrop-blur">
                <div className="text-2xl sm:text-3xl font-black text-purple-400">100%</div>
                <div className="text-[10px] text-gray-400 uppercase font-mono mt-1 font-bold">Unfiltered Takes</div>
              </div>
              <div className="bg-[#0B0B0F]/60 border border-white/5 p-4 rounded-2xl relative overflow-hidden backdrop-blur">
                <div className="text-2xl sm:text-3xl font-black text-pink-400">Live</div>
                <div className="text-[10px] text-gray-400 uppercase font-mono mt-1 font-bold">Vibe Battleground</div>
              </div>
            </div>

            {/* Quick Action CTA Button */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleTabChange('builder')}
                className="px-6 py-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-black font-black uppercase text-xs tracking-wider rounded-2xl hover:scale-105 active:scale-95 transition shadow-[0_0_25px_rgba(34,197,94,0.4)] cursor-pointer"
              >
                🔥 Start Drafting My XI
              </button>
              <button
                onClick={() => handleTabChange('feed')}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-xs tracking-wider rounded-2xl transition cursor-pointer"
              >
                📢 Read Trench Takes
              </button>
            </div>
          </div>

          {/* Hero Right Column: Spectacular Floating Collectible Cards */}
          <div className="lg:col-span-5 relative h-[380px] flex items-center justify-center select-none mt-6 lg:mt-0">
            {/* Live stadium vibe circular backing */}
            <div className="absolute w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-3xl animate-spin-slow pointer-events-none" />

            {/* Card 1 Floating left */}
            <div className="absolute left-2 top-4 select-none transform -rotate-12 hover:rotate-0 hover:z-30 transition-all duration-300 animate-float-slow origin-bottom-left">
              <HolographicCard player={HERO_SHOWCASE_PLAYERS[2]} size="sm" showStats={false} />
            </div>

            {/* Card 2 Floating center foreground */}
            <div className="absolute z-20 top-8 select-none scale-105 hover:scale-110 transition-all duration-300 animate-float origin-center shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <HolographicCard player={HERO_SHOWCASE_PLAYERS[0]} size="md" showStats={true} />
            </div>

            {/* Card 3 Floating right */}
            <div className="absolute right-2 top-10 select-none transform rotate-12 hover:rotate-0 hover:z-30 transition-all duration-300 animate-float-fast origin-bottom-right">
              <HolographicCard player={HERO_SHOWCASE_PLAYERS[1]} size="sm" showStats={false} />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Segmented Navigation Bar - Premium Pill Capsules */}
      <nav id="navigation-root" className="border-b border-white/10 bg-[#0B0B0F]/80 py-4 select-none sticky top-[66px] z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex gap-2.5 overflow-x-auto font-mono text-xs whitespace-nowrap scrollbar-none items-center justify-start sm:justify-center">
          
          <button
            onClick={() => handleTabChange('builder')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'builder'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            📋 Tactical Pitch
          </button>

          <button
            onClick={() => handleTabChange('feed')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'feed'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            📢 Trench Feed
          </button>

          <button
            onClick={() => handleTabChange('arena')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'arena'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            ⚔️ Live Debates
          </button>

          <button
            onClick={() => handleTabChange('simulator')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            🤖 Match Sims
          </button>

          <button
            onClick={() => handleTabChange('database')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'database'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            🔍 Star DB
          </button>

          <button
            onClick={() => handleTabChange('leaderboards')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'leaderboards'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            🏆 Rankings
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-[#22c55e] to-sky-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                : 'bg-white/5 text-gray-300 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            👤 Premium profile
          </button>

        </div>
      </nav>

      {/* 4. Main content body renderers with smooth view fade-in */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-6 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activeTab === 'builder' && (
              <ProtectedRoute user={user} id="protected-builder">
                <div className="flex flex-col gap-6">
                  <PitchBuilder
                    userId={profile?.id || 'u-user'}
                    userName={profile?.username || 'Gaffer_XI'}
                    availablePlayers={availablePlayers}
                    activeSquad={activeSquad}
                    onSetSquad={handleSetSquadInPitch}
                    onAnalyzeSquad={handleAnalyzeSquadTrigger}
                  />

                  {/* Inline visual drawer representing Gemini AI Analysis */}
                  <AIAnalysis squad={squadForAnalysis} />
                </div>
              </ProtectedRoute>
            )}

            {activeTab === 'feed' && (
              <SocialFeed
                userId={profile?.id || 'u-user'}
                userName={profile?.username || 'Gaffer_XI'}
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
                userName={profile?.username || 'Gaffer_XI'}
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
              <LegendsDatabase onSetSquad={handleSetSquadInPitch} />
            )}

            {activeTab === 'leaderboards' && (
              <LeaderboardsView squadsList={squadsList} />
            )}

            {activeTab === 'profile' && (
              <ProtectedRoute user={user} id="protected-profile">
                {profile && (
                  <div key="profile-view" className="w-full">
                    <UserProfileView
                      profile={profile}
                      squadsList={squadsList}
                      onUpdateProfile={(p) => {
                        setProfile(p);
                        setAuthProfile(p);
                      }}
                      onLoadSquad={(sq) => {
                        setActiveSquad(sq);
                        setActiveTab('builder');
                        window.scrollTo({ top: 320, behavior: 'smooth' });
                      }}
                      onDeleteSquad={() => {
                        refreshSquadsList();
                      }}
                    />
                  </div>
                )}
              </ProtectedRoute>
            )}

            {activeTab === 'settings' && (
              <ProtectedRoute user={user} id="protected-settings">
                {profile && (
                  <div key="settings-view" className="w-full">
                    <UserProfileView
                      profile={profile}
                      squadsList={squadsList}
                      onUpdateProfile={(p) => {
                        setProfile(p);
                        setAuthProfile(p);
                      }}
                      onLoadSquad={(sq) => {
                        setActiveSquad(sq);
                        setActiveTab('builder');
                        window.scrollTo({ top: 320, behavior: 'smooth' });
                      }}
                      onDeleteSquad={() => {
                        refreshSquadsList();
                      }}
                      initialEditing={true}
                    />
                  </div>
                )}
              </ProtectedRoute>
            )}

            {activeTab === 'my-squads' && (
              <ProtectedRoute user={user} id="protected-my-squads">
                {profile && (
                  <MySquadsView
                    userId={profile.id}
                    squadsList={squadsList}
                    onLoadSquad={(sq) => {
                      setActiveSquad(sq);
                      setActiveTab('builder');
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                    onDeleteSquad={() => {
                      refreshSquadsList();
                    }}
                    onGoToBuilder={() => {
                      setActiveTab('builder');
                    }}
                  />
                )}
              </ProtectedRoute>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. Mobile Native-inspired Fixed Bottom Bar Navigation for TikTok-like experience */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-[#0B0B0F]/95 border-t border-white/10 py-2.5 px-4 z-40 flex justify-between items-center backdrop-blur-lg rounded-t-3xl shadow-[0_-10px_25px_rgba(0,0,0,0.5)] font-mono text-[9px]">
        <button
          onClick={() => { playFutSound('click'); setActiveTab('builder'); }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition ${activeTab === 'builder' ? 'text-emerald-400 font-extrabold translate-y-[-2px]' : 'text-gray-400'}`}
        >
          <Compass className="w-5 h-5 text-current" />
          <span>Pitch</span>
        </button>
        <button
          onClick={() => { playFutSound('click'); setActiveTab('feed'); }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition ${activeTab === 'feed' ? 'text-purple-400 font-extrabold translate-y-[-2px]' : 'text-gray-400'}`}
        >
          <MessageCircle className="w-5 h-5 text-current" />
          <span>Trench</span>
        </button>
        <button
          onClick={() => { playFutSound('click'); setActiveTab('arena'); }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition ${activeTab === 'arena' ? 'text-pink-400 font-extrabold translate-y-[-2px]' : 'text-gray-400'}`}
        >
          <Swords className="w-5 h-5 text-current" />
          <span>Debates</span>
        </button>
        <button
          onClick={() => { playFutSound('click'); setActiveTab('simulator'); }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition ${activeTab === 'simulator' ? 'text-cyan-400 font-extrabold translate-y-[-2px]' : 'text-gray-400'}`}
        >
          <Tv className="w-5 h-5 text-current" />
          <span>Sims</span>
        </button>
        <button
          onClick={() => { playFutSound('click'); setActiveTab('database'); }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition ${activeTab === 'database' ? 'text-yellow-400 font-extrabold translate-y-[-2px]' : 'text-gray-400'}`}
        >
          <Sparkles className="w-5 h-5 text-current" />
          <span>Stars</span>
        </button>
        <button
          onClick={() => { playFutSound('click'); setActiveTab('profile'); }}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition ${activeTab === 'profile' ? 'text-orange-400 font-extrabold translate-y-[-2px]' : 'text-gray-400'}`}
        >
          <User className="w-5 h-5 text-current" />
          <span>Gaffer</span>
        </button>
      </div>

      {/* 6. Footer */}
      <footer className="border-t border-white/10 bg-[#0B0B0F] py-8 text-center select-none mt-auto">
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-none">
          © {new Date().getFullYear()} DREAM XI INC • STADIUM HYBRID SYSTEMS INC
        </p>
      </footer>

    </div>
  );
}
