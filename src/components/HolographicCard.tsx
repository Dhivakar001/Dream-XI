import { motion } from 'motion/react';
import { Sparkles, Star, Trophy, Shield, Zap, TrendingUp, Award, Flame, Globe } from 'lucide-react';
import { Player } from '../types';
import { playFutSound } from '../utils';
import { useTranslation } from '../lib/LanguageContext';

const getCountryAbbrev = (nation: string) => {
  if (!nation) return 'INT';
  const mapping: { [key: string]: string } = {
    'Argentina': 'ARG',
    'Portugal': 'POR',
    'Brazil': 'BRA',
    'France': 'FRA',
    'Norway': 'NOR',
    'Egypt': 'EGY',
    'Sweden': 'SWE',
    'England': 'ENG',
    'Netherlands': 'NED',
    'Belgium': 'BEL',
    'Italy': 'ITA',
    'Spain': 'ESP',
    'Croatia': 'CRO',
    'Germany': 'GER',
    'Canada': 'CAN',
    'Morocco': 'MAR',
    'Russia': 'RUS'
  };
  return mapping[nation] || nation.substring(0, 3).toUpperCase();
};

const getClubAbbrev = (club: string) => {
  if (!club) return 'FC';
  const mapping: { [key: string]: string } = {
    'Inter Miami': 'MIA',
    'Al Nassr': 'NAS',
    'Barcelona': 'BAR',
    'Real Madrid': 'RMA',
    'Man City': 'MCI',
    'Bayern': 'FCB',
    'Liverpool': 'LIV',
    'Arsenal': 'ARS',
    'PSG': 'PSG',
    'AC Milan': 'ACM',
    'Juventus': 'JUV',
    'Chelsea': 'CHE',
    'Tottenham': 'TOT',
    'Man United': 'MUN',
    'Inter': 'INT',
    'Napoli': 'NAP',
    'Dortmund': 'BVB',
    'Atletico': 'ATM'
  };
  return mapping[club] || club.substring(0, 3).toUpperCase();
};

interface HolographicCardProps {
  player: Player;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
}

export default function HolographicCard({
  player,
  onClick,
  size = 'md',
  showStats = true,
}: HolographicCardProps) {
  const { t } = useTranslation();
  const getCardStyle = (type: Player['cardType'], rating: number) => {
    // If rating is 97+, they deserve GOAT status!
    if (rating >= 97) {
      return {
        bg: 'bg-gradient-to-b from-[#18001a] via-[#3a0328] to-[#04000c] border-[#ff00a0]',
        text: 'text-white',
        ratingText: 'text-[#FBE116] drop-shadow-[0_0_10px_rgba(251,225,22,0.9)] font-graffiti',
        badge: 'border-[#ff00a0] text-[#FBE116] bg-[#1a0033] shadow-[0_0_12px_rgba(255,0,160,0.6)]',
        glow: 'shadow-[0_0_30px_rgba(255,0,160,0.7)]',
        banner: 'bg-gradient-to-r from-[#ff00a0] via-[#FBE116] to-[#009E49] text-black font-extrabold',
        label: 'FOOTBALL GOAT',
        badgeType: 'goat'
      };
    }

    switch (type) {
      case 'TOTY':
        return {
          bg: 'bg-gradient-to-b from-[#021f11] via-[#005a30] to-[#060c08] border-[#FBE116]',
          text: 'text-white',
          ratingText: 'text-[#FBE116] font-extrabold drop-shadow-[0_3px_0px_#000]',
          badge: 'border-[#FBE116] text-[#FBE116] bg-[#004221] shadow-[0_0_10px_rgba(251,225,22,0.4)]',
          glow: 'shadow-[0_0_22px_rgba(0,158,73,0.7)]',
          banner: 'bg-gradient-to-r from-[#FBE116] to-[#009E49] text-black font-black',
          label: 'TOTY SENSATION',
          badgeType: 'toty'
        };
      case 'Legend':
        return {
          bg: 'bg-gradient-to-b from-[#2a1e05] via-[#5c4302] to-[#0f0b00] border-[#FBE116]',
          text: 'text-[#fff275]',
          ratingText: 'text-[#FBE116] font-graffiti drop-shadow-[0_4px_0px_#000]',
          badge: 'border-[#FBE116] text-[#FBE116] bg-[#1a1100]',
          glow: 'shadow-[0_0_20px_rgba(251,225,22,0.6)]',
          banner: 'bg-[#FBE116] text-black font-black',
          label: 'IMMORTAL ICON',
          badgeType: 'legend'
        };
      case 'Icon':
        return {
          bg: 'bg-gradient-to-b from-[#0a1b2e] via-[#10305a] to-[#01050d] border-[#009E49]',
          text: 'text-white',
          ratingText: 'text-[#FBE116] font-extrabold drop-shadow-[0_2.5px_0px_#000]',
          badge: 'border-[#009E49] text-white bg-[#02182b]',
          glow: 'shadow-[0_0_15px_rgba(0,158,73,0.5)]',
          banner: 'bg-[#009E49] text-white font-bold',
          label: 'PITCH MASTER',
          badgeType: 'icon'
        };
      case 'Future Star':
        return {
          bg: 'bg-gradient-to-b from-[#1b002c] via-[#4d076d] to-[#09000e] border-[#ec4899]',
          text: 'text-white',
          ratingText: 'text-[#00efff] font-extrabold drop-shadow-[0_2.5px_0px_#000]',
          badge: 'border-[#ec4899] text-[#00efff] bg-[#1e002d]',
          glow: 'shadow-[0_0_24px_rgba(236,72,153,0.6)]',
          banner: 'bg-gradient-to-r from-[#ec4899] to-[#00efff] text-black font-black',
          label: 'FUTURE TALENT',
          badgeType: 'future'
        };
      default: // Gold (now designed as Elite Star)
        return {
          bg: 'bg-gradient-to-b from-[#141208] via-[#2d2911] to-[#090803] border-[#009E49]',
          text: 'text-slate-100',
          ratingText: 'text-[#FBE116] font-extrabold drop-shadow-[0_2px_0px_#000]',
          badge: 'border-[#009E49] text-[#FBE116] bg-[#0d140e]',
          glow: 'shadow-[0_0_12px_rgba(0,158,73,0.3)]',
          banner: 'bg-[#009E49] text-black font-bold',
          label: 'ELITE STAR',
          badgeType: 'gold'
        };
    }
  };

  const card = getCardStyle(player.cardType, player.rating);

  // Sizing definitions
  const dimensions = {
    sm: 'w-[145px] h-[220px] text-[10px]',
    md: 'w-[205px] h-[310px] text-xs',
    lg: 'w-[275px] h-[415px] text-sm',
  };

  const avatarSizes = {
    sm: 'w-14 h-14 mb-1 rounded-xl shrink-0',
    md: 'w-24 h-24 mb-1.5 rounded-2xl shrink-0',
    lg: 'w-32 h-32 mb-2 rounded-2xl shrink-0',
  };

  const imageSizes = {
    sm: 'w-10 h-10 mt-1',
    md: 'w-20 h-20 mt-2',
    lg: 'w-28 h-28 mt-2.5',
  };

  const fontSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-black',
  };

  const ratingSizes = {
    sm: player.rating >= 97 ? 'text-xl' : 'text-lg',
    md: player.rating >= 97 ? 'text-3.5xl' : 'text-3xl font-black',
    lg: player.rating >= 97 ? 'text-5xl' : 'text-4xl font-black',
  };

  const nationSizes = {
    sm: 'text-xs mt-0.5',
    md: 'text-sm mt-1',
    lg: 'text-base mt-1.5',
  };

  const clubLogoSizes = {
    sm: 'text-[10px] mt-0.5',
    md: 'text-xs mt-1',
    lg: 'text-sm mt-1.5',
  };

  const badgeSizes = {
    sm: 'px-1 py-0.2 text-[6px] rotate-[-2deg] scale-90',
    md: 'px-2 py-0.5 text-[8px] rotate-[-4deg] scale-95',
    lg: 'px-2.5 py-1 text-[10px] rotate-[-4deg]',
  };

  const handlePointer = () => {
    playFutSound('hover');
  };

  const handleClick = () => {
    playFutSound('click');
    if (onClick) onClick();
  };

  return (
    <motion.div
      id={`card-${player.id}`}
      whileHover={{ scale: 1.07, rotateY: 8, rotateX: -2 }}
      transition={{ type: 'spring', stiffness: 350, damping: 14 }}
      onPointerEnter={handlePointer}
      onClick={handleClick}
      className={`${dimensions[size]} ${card.bg} ${card.glow} border-[3px] rounded-2xl relative cursor-pointer overflow-hidden flex flex-col items-center p-3 select-none`}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      {/* Absolute Street Overlay details */}
      <div className="absolute inset-x-0 bottom-0 top-[65%] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0" />
      
      {/* Nike Hazard Striping Tag top ribbon overlay */}
      <div className="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(-45deg,#FBE116,#FBE116_6px,#000_6px,#00_12px)] opacity-80" />

      {/* Holographic sparkle top layer on hover with beautiful glass refraction */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-60 mix-blend-overlay pointer-events-none" />
      
      {/* Premium holographic sliding flare wave - dynamic slide scan */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FBE116]/15 via-white/20 via-[#009E49]/15 to-transparent -translate-x-full rotate-45 animate-holo-shine pointer-events-none" style={{ animationDuration: '3.5s' }} />

      {/* Sparkle effect icon on premium items */}
      {(player.cardType !== 'Gold' || player.rating >= 97) && (
        <div className="absolute top-3 right-3 animate-pulse">
          <Sparkles className="w-4.5 h-4.5 text-[#FBE116] drop-shadow-[0_0_8px_rgba(251,225,22,1)]" />
        </div>
      )}

      {/* Header Slot: Position & Nation details */}
      <div className="w-full flex justify-between items-start mb-1 select-none z-10">
        <div className="flex flex-col items-stretch text-center gap-1">
          <span className={`tracking-tighter ${card.ratingText} leading-none select-none ${ratingSizes[size]}`}>
            {player.rating}
          </span>
          <span className="font-extrabold text-[9px] uppercase text-[#FBE116] select-none tracking-widest leading-none">
            {player.position}
          </span>
          
          {/* Nation Abbrev Capsule Tag */}
          <div className="flex items-center justify-center gap-0.5 bg-black/85 border border-white/20 text-[#FBE116] text-[7.5px] font-mono font-black rounded px-1.5 py-0.5 mt-1 tracking-wider leading-none shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <Globe className="w-2 h-2 text-sky-400 animate-spin-slow shrink-0" />
            <span>{getCountryAbbrev(player.nation)}</span>
          </div>

          {/* Club Initial Label Tag */}
          <div className="flex items-center justify-center gap-0.5 bg-[#0B0B0F] border border-[#009E49]/55 text-white text-[7px] font-sans font-black rounded-md px-1 py-0.5 leading-none shadow-[0_1.5px_3px_rgba(0,0,0,0.6)]">
            <Shield className="w-1.5 h-1.5 text-emerald-500 shrink-0" />
            <span>{getClubAbbrev(player.club)}</span>
          </div>
        </div>
        
        {/* Playstyle Tag / Street Stamp Badge */}
        <div className={`border-2 rounded-lg uppercase tracking-tighter font-extrabold font-mono select-none flex items-center gap-1 ${card.badge} ${badgeSizes[size]}`}>
          {card.badgeType === 'goat' && <Award className="w-2.5 h-2.5 text-[#FBE116] animate-pulse" />}
          {card.badgeType === 'toty' && <Flame className="w-2.5 h-2.5 text-orange-400 animate-bounce" />}
          {card.badgeType === 'legend' && <Trophy className="w-2.5 h-2.5 text-yellow-500 animate-bounce" />}
          {card.badgeType === 'icon' && <Zap className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />}
          {card.badgeType === 'future' && <TrendingUp className="w-2.5 h-2.5 text-pink-500 animate-bounce" />}
          {card.badgeType === 'gold' && <Shield className="w-2.5 h-2.5 text-emerald-400" />}
          <span>{t(card.label)}</span>
        </div>
      </div>

      {/* Player Avatar with Stadium Crowd and Glowing Arena background glow */}
      <div className={`relative ${avatarSizes[size]} flex items-center justify-center bg-black/60 border border-white/10 select-none overflow-hidden z-10`}>
        {/* Colorful street aura flash behind cutout */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#009E49]/30 to-[#FBE116]/30 animate-pulse opacity-40 blur-sm" />
        
        <img
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.avatarSeed}`}
          alt={player.name}
          className={`${imageSizes[size]} object-cover drop-shadow-[0_5px_8px_rgba(0,0,0,0.8)] z-10 hover:scale-110 transition duration-300`}
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute bottom-0 w-full text-center py-0.5 bg-black/80 border-t border-white/5 text-[7px] text-[#FBE116] font-graffiti select-none tracking-widest uppercase z-10 truncate px-1">
          {player.playstyle}
        </div>
      </div>

      {/* Name Display */}
      <div className={`w-full text-center ${size === 'sm' ? 'mb-1' : 'mb-2.5'} select-none z-10`}>
        <h3 className={`font-black tracking-tighter text-white uppercase truncate flex items-center justify-center gap-1 ${fontSizes[size]}`}>
          {player.name}
          {player.rating >= 96 && <Star className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} fill-[#FBE116] text-[#FBE116] inline`} />}
        </h3>
        <p className={`${size === 'sm' ? 'text-[8.5px]' : 'text-[10px]'} text-gray-400 font-mono tracking-wide truncate`}>
          {player.club} • {player.league}
        </p>
      </div>

      {/* Football Statistics Panel (Street Magazine Style) */}
      {showStats && size !== 'sm' && (
        <div className="w-full grid grid-cols-6 gap-0 border-y border-white/10 py-1.5 mb-2 font-mono text-[9px] text-center bg-black/45 rounded-lg select-none z-10">
          <div>
            <div className="text-gray-500 uppercase font-black">PAC</div>
            <div className={`font-black ${player.stats.pac >= 90 ? 'text-[#FBE116]' : player.stats.pac >= 80 ? 'text-emerald-400' : 'text-gray-300'}`}>
              {player.stats.pac}
            </div>
          </div>
          <div>
            <div className="text-gray-500 uppercase font-black">SHO</div>
            <div className={`font-black ${player.stats.sho >= 90 ? 'text-[#FBE116]' : player.stats.sho >= 80 ? 'text-emerald-400' : 'text-gray-300'}`}>
              {player.stats.sho}
            </div>
          </div>
          <div>
            <div className="text-gray-500 uppercase font-black">PAS</div>
            <div className={`font-black ${player.stats.pas >= 90 ? 'text-[#FBE116]' : player.stats.pas >= 80 ? 'text-emerald-400' : 'text-gray-300'}`}>
              {player.stats.pas}
            </div>
          </div>
          <div>
            <div className="text-gray-500 uppercase font-black">DRI</div>
            <div className={`font-black ${player.stats.dri >= 90 ? 'text-[#FBE116]' : player.stats.dri >= 80 ? 'text-emerald-400' : 'text-gray-300'}`}>
              {player.stats.dri}
            </div>
          </div>
          <div>
            <div className="text-gray-500 uppercase font-black">DEF</div>
            <div className={`font-black ${player.stats.def >= 90 ? 'text-[#FBE116]' : player.stats.def >= 80 ? 'text-emerald-400' : 'text-gray-300'}`}>
              {player.stats.def}
            </div>
          </div>
          <div>
            <div className="text-gray-500 uppercase font-black">PHY</div>
            <div className={`font-black ${player.stats.phy >= 90 ? 'text-[#FBE116]' : player.stats.phy >= 80 ? 'text-emerald-400' : 'text-gray-300'}`}>
              {player.stats.phy}
            </div>
          </div>
        </div>
      )}

      {/* Aura Rating Bottom Meter */}
      <div className="w-full mt-auto select-none z-10">
        <div className="flex justify-between items-center text-[9px] text-[#009E49] font-mono mb-1 select-none">
          <span className="flex items-center gap-1 font-black tracking-wide">
            {t("⚡ AURA INDEX:")}
          </span>
          <span className="font-extrabold text-[#FBE116] tracking-widest text-right select-none">
            {player.auraRating}%
          </span>
        </div>
        <div className="w-full bg-slate-900/90 rounded-full h-1.5 overflow-hidden select-none border border-white/5">
          <div
            className="bg-gradient-to-r from-[#009E49] via-[#FBE116] to-[#00efff] h-1.5 rounded-full filter drop-shadow-[0_0_4px_#FBE116]"
            style={{ width: `${Math.min(100, player.auraRating)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
