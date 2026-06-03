import { motion } from 'motion/react';
import {
  Trophy,
  Users,
  MessageCircle,
  Swords,
  Tv,
  Sparkles,
  Flame,
  Search,
  Bookmark,
  TrendingUp,
  User,
  Settings,
  Award
} from 'lucide-react';
import { Player, Battle } from '../types';
import HolographicCard from '../components/HolographicCard';
import { playFutSound } from '../utils';
import { useTranslation } from '../lib/LanguageContext';

// Demo top stars for the floating hero showcase (directly within the Page to isolate)
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

interface HomePageProps {
  onNavigate: (tab: any) => void;
  battlesCount: number;
}

export default function HomePage({ onNavigate, battlesCount }: HomePageProps) {
  const { t } = useTranslation();

  const handleFeatureClick = (tab: string) => {
    playFutSound('click');
    onNavigate(tab);
  };

  const featureCards = [
    {
      id: 'builder',
      title: t('Tactical Pitch'),
      description: t('Tactical Pitch Detail'),
      badge: t('POPULAR'),
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: Users,
      hoverBorder: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    },
    {
      id: 'feed',
      title: t('Trench Feed'),
      description: t('Trench Feed Detail'),
      badge: t('COMMUNITY'),
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      icon: MessageCircle,
      hoverBorder: 'hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
    },
    {
      id: 'arena',
      title: t('Live Debates'),
      description: t('Live Debates Detail'),
      badge: `${battlesCount} ${t('ACTIVE')}`,
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      icon: Swords,
      hoverBorder: 'hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
    },
    {
      id: 'simulator',
      title: t('Match Sims'),
      description: t('Match Sims Detail'),
      badge: t('AI DRIVEN'),
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      icon: Tv,
      hoverBorder: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
    },
    {
      id: 'database',
      title: t('Star DB'),
      description: t('Legends Database Detail'),
      badge: t('DATABASE'),
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      icon: Search,
      hoverBorder: 'hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]'
    },
    {
      id: 'leaderboards',
      title: t('Rankings'),
      description: t('Rankings Detail'),
      badge: t('HONORS'),
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      icon: Trophy,
      hoverBorder: 'hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]'
    }
  ];

  return (
    <div id="football-home-page-root" className="flex flex-col gap-14 w-full">
      {/* 1. TikTok Meets FIFA Spectacular Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-6 rounded-3xl border-3 border-black bg-gradient-to-br from-[#009E49]/10 via-black/30 to-[#0c0914] select-none shadow-[8px_8px_0px_#000]">
        {/* Dynamic diagonal stripe texture */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,158,73,0.015),rgba(0,158,73,0.015)_20px,transparent_20px,transparent_40px)] pointer-events-none rounded-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center leading-none text-left relative">
            <div className="inline-flex items-center gap-2 bg-[#009E49]/20 border-2 border-[#009E49]/30 px-3.5 py-1.5 rounded-xl text-[10px] font-mono font-black text-[#FBE116] uppercase tracking-widest mb-6 w-fit animate-pulse rotate-[-1.5deg]">
              <Flame className="w-4 h-4 text-[#FBE116]" />
              <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              {t("GLOBAL FOOTBALL LABS")}
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none uppercase mb-6 drop-shadow-md font-outfit italic">
              {t("DRAFT THE XI")} <br /> 
              <span className="bg-gradient-to-r from-[#FBE116] via-[#009E49] to-[#00efff] bg-clip-text text-transparent italic">
                {t("EVERYONE WILL DEBATE.")}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-medium font-sans leading-relaxed tracking-tight max-w-xl mb-8">
              {t("Create your Dream XI lineups with raw street tactics. Pitch your roster in competitive virtual match sims, gain instant tactical gaffer analysis, spark community debates, and unlock your supreme manager clout.")}
            </p>

            {/* Micro Engagement Stats Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mb-8">
              <div className="bg-black/85 border-2 border-black street-shadow-yellow p-4 rounded-xl relative overflow-hidden backdrop-blur">
                <div className="text-2xl sm:text-3xl font-black text-[#FBE116] font-graffiti">99+</div>
                <div className="text-[9px] text-[#009E49] uppercase font-mono mt-1 font-black">{t("Aura Badge")}</div>
              </div>
              <div className="bg-black/85 border-2 border-black street-shadow-green p-4 rounded-xl relative overflow-hidden backdrop-blur">
                <div className="text-2xl sm:text-3xl font-black text-[#009E49] font-graffiti">100%</div>
                <div className="text-[9px] text-gray-400 uppercase font-mono mt-1 font-black">{t("Community Feed")}</div>
              </div>
              <div className="bg-black/85 border-2 border-black street-shadow-blue p-4 rounded-xl relative overflow-hidden backdrop-blur">
                <div className="text-2xl sm:text-3xl font-black text-sky-450 font-graffiti">{t("Live")}</div>
                <div className="text-[9px] text-[#FBE116] uppercase font-mono mt-1 font-black">{t("Soccer Sims")}</div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleFeatureClick('builder')}
                className="px-6 py-4 bg-gradient-to-r from-[#FBE116] to-[#009E49] text-black border-2 border-black font-black uppercase text-xs tracking-wider rounded-xl hover:scale-105 active:scale-95 flex items-center gap-2 transition shadow-[4px_4px_0px_#000] cursor-pointer"
              >
                <Flame className="w-4 h-4 text-black animate-pulse" />
                {t("DRAFT MY SQUAD")}
              </button>
              <button
                onClick={() => handleFeatureClick('feed')}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 border-2 border-black text-white font-black uppercase text-xs tracking-wider rounded-xl flex items-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#FBE116]" />
                {t("VIEW COMMUNITY TAKES")}
              </button>
            </div>
          </div>

          {/* Hero Right Column: Floating Collectible Cards */}
          <div className="lg:col-span-5 relative h-[360px] flex items-center justify-center select-none mt-6 lg:mt-0">
            {/* Live stadium vibe circular backing */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-[#009E49]/20 to-[#FBE116]/20 blur-3xl animate-spin-slow pointer-events-none" />

            {/* Card 1 Floating left */}
            <div className="absolute left-2 top-4 select-none transform -rotate-12 hover:rotate-2 hover:scale-105 hover:z-30 transition-all duration-300 animate-float-slow origin-bottom-left">
              <HolographicCard player={HERO_SHOWCASE_PLAYERS[2]} size="sm" showStats={false} />
            </div>

            {/* Card 2 Floating center foreground */}
            <div className="absolute z-20 top-8 select-none scale-105 hover:scale-110 hover:-rotate-2 transition-all duration-300 animate-float origin-center shadow-[0_20px_45px_rgba(0,0,0,0.9)]">
              <HolographicCard player={HERO_SHOWCASE_PLAYERS[0]} size="md" showStats={true} />
            </div>

            {/* Card 3 Floating right */}
            <div className="absolute right-2 top-10 select-none transform rotate-12 hover:rotate-[-2deg] hover:scale-105 hover:z-30 transition-all duration-300 animate-float-fast origin-bottom-right">
              <HolographicCard player={HERO_SHOWCASE_PLAYERS[1]} size="sm" showStats={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento Grid Interactive Hub Guide */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-[#009E49] animate-bounce" />
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic font-outfit">
              {t("Global Football Laboratories Hub")}
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5 uppercase tracking-wider">
              {t("Explore dedicated compartments below. Your managership, profile state, and drafts are fully compartmentalized.")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className={`group bg-[#0B0B0F]/90 border-2 border-black p-6 rounded-2xl relative flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#FBE116] ${feature.hoverBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-0.5 border text-[9px] font-mono font-black uppercase rounded ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                    <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 group-hover:scale-110 transition duration-300" />
                  </div>
                  
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-2 group-hover:text-yellow-400 flex items-center gap-2 transition">
                    <IconComponent className="w-5 h-5 text-[#FBE116] animate-pulse" />
                    {feature.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-[10px] text-[#FBE116] font-mono uppercase font-black tracking-widest gap-1 group-hover:gap-2 transition-all">
                  {t("ENTER LABORATORY")} <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
