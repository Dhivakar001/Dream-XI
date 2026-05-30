import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Player } from '../types';
import { playFutSound } from '../utils';

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
  const getCardStyle = (type: Player['cardType'], rating: number) => {
    // If rating is 97+, they deserve GOAT status!
    if (rating >= 97) {
      return {
        bg: 'bg-gradient-to-b from-[#120024] via-[#3a064d] to-[#04000c] border-[#ff00e5]',
        text: 'text-white',
        ratingText: 'text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] font-black',
        badge: 'border-[#ff00e5] text-[#ffd700] bg-[#1a0033] shadow-[0_0_12px_rgba(255,0,229,0.5)]',
        glow: 'shadow-[0_0_30px_rgba(255,0,229,0.6)]',
        banner: 'bg-gradient-to-r from-[#ff00e5] via-[#ffd700] to-[#00f0ff] text-black font-extrabold',
        label: '🐐 GOAT',
      };
    }

    switch (type) {
      case 'TOTY':
        return {
          bg: 'bg-gradient-to-b from-[#09153d] via-[#102a7a] to-[#020514] border-[#d2a34c]',
          text: 'text-white',
          ratingText: 'text-[#ffd700] font-black',
          badge: 'border-[#d2a34c] text-[#ffd700] bg-[#1a2d6b]',
          glow: 'shadow-[0_0_20px_rgba(210,163,76,0.6)]',
          banner: 'bg-gradient-to-r from-[#d2a34c] to-[#ffd700] text-black font-extrabold',
          label: '🔥 TOTY',
        };
      case 'Legend':
        return {
          bg: 'bg-gradient-to-b from-[#221c0f] via-[#423414] to-[#090703] border-[#ffd700]',
          text: 'text-[#ffed4a]',
          ratingText: 'text-[#ffd700] font-black',
          badge: 'border-[#ffd700] text-[#ffd700] bg-[#1d1d11]',
          glow: 'shadow-[0_0_20px_rgba(255,215,0,0.5)]',
          banner: 'bg-[#ffd700] text-black font-black',
          label: '👑 LEGEND',
        };
      case 'Icon':
        return {
          bg: 'bg-gradient-to-b from-[#1a1c1d] via-[#2d3238] to-[#08090a] border-[#a0aec0]',
          text: 'text-white',
          ratingText: 'text-[#a0aec0] font-black',
          badge: 'border-[#a0aec0] text-[#a0aec0] bg-[#1a1917]',
          glow: 'shadow-[0_0_15px_rgba(160,174,192,0.4)]',
          banner: 'bg-[#a0aec0] text-black font-bold',
          label: '✨ ICON',
        };
      case 'Future Star':
        return {
          bg: 'bg-gradient-to-b from-[#001f3f] via-[#0074d9] to-[#000d1a] border-[#00f0ff]',
          text: 'text-white',
          ratingText: 'text-[#00f0ff] font-black',
          badge: 'border-[#00f0ff] text-[#00f0ff] bg-[#001f3f]',
          glow: 'shadow-[0_0_20px_rgba(0,240,255,0.6)]',
          banner: 'bg-gradient-to-r from-[#00f0ff] to-[#39cdc4] text-black font-extrabold',
          label: '🚀 FUTURE STAR',
        };
      default: // Gold
        return {
          bg: 'bg-gradient-to-b from-[#1c191a] via-[#332f30] to-[#0a0909] border-[#22c55e]',
          text: 'text-white',
          ratingText: 'text-[#22c55e] font-black',
          badge: 'border-[#22c55e] text-[#22c55e] bg-[#0f1d13]',
          glow: 'shadow-[0_0_12px_rgba(34,197,95,0.4)]',
          banner: 'bg-[#22c55e] text-black font-bold',
          label: '🟢 STAR',
        };
    }
  };

  const card = getCardStyle(player.cardType, player.rating);

  // Sizing definitions
  const dimensions = {
    sm: 'w-[140px] h-[210px] text-[10px]',
    md: 'w-[200px] h-[300px] text-xs',
    lg: 'w-[270px] h-[400px] text-sm',
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
      whileHover={{ scale: 1.05, rotateY: 3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onPointerEnter={handlePointer}
      onClick={handleClick}
      className={`${dimensions[size]} ${card.bg} ${card.glow} border-2 rounded-xl relative cursor-pointer overflow-hidden flex flex-col items-center p-3 select-none select-none`}
      style={{ perspective: 1000 }}
    >
      {/* Holographic sparkle top layer on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40 mix-blend-overlay" />
      
      {/* Premium holographic sliding flare wave */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full rotate-45 group-hover:animate-holo-shine pointer-events-none" style={{ animationDuration: '2.5s' }} />

      {/* Sparkle effect icon on premium items */}
      {(player.cardType !== 'Gold' || player.rating >= 97) && (
        <div className="absolute top-2 right-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-[#ffe58f] drop-shadow-[0_0_5px_currentColor]" />
        </div>
      )}

      {/* Header Slot: Position & Nation details */}
      <div className="w-full flex justify-between items-start mb-1 select-none">
        <div className="flex flex-col items-center">
          <span className={`font-black text-2xl tracking-tighter ${card.ratingText} leading-none select-none`}>
            {player.rating}
          </span>
          <span className="font-extrabold text-[10px] uppercase text-gray-400 select-none">
            {player.position}
          </span>
          <span className="text-sm mt-1 select-none" title={player.nation}>
            {player.nationFlag}
          </span>
          <span className="text-sm mt-1 select-none" title={player.club}>
            {player.clubLogo}
          </span>
        </div>
        
        {/* Playstyle Tag overlay */}
        <div className={`px-2 py-0.5 border rounded text-[9px] uppercase tracking-wider font-extrabold font-mono select-none ${card.badge}`}>
          {card.label}
        </div>
      </div>

      {/* Player Avatar placeholder with dynamic custom seed styling */}
      <div className="relative w-24 h-24 mb-2 flex items-center justify-center rounded-full bg-slate-900/60 border border-white/5 select-none overflow-hidden">
        {/* Generates a high-quality human display avatar using multicharacter seed */}
        <img
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.avatarSeed}`}
          alt={player.name}
          className="w-20 h-20 object-cover mt-2 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 w-full text-center py-0.5 bg-black/60 text-[9px] text-[#22c55e] font-mono select-none">
          {player.playstyle}
        </div>
      </div>

      {/* Name Display */}
      <div className="w-full text-center mb-3 select-none">
        <h3 className="font-black tracking-tight text-white uppercase truncate text-sm">
          {player.name}
        </h3>
        <p className="text-[10px] text-gray-500 font-mono tracking-wider truncate">
          {player.club} • {player.league}
        </p>
      </div>

      {/* Football Statistics Panel (FUT style) */}
      {showStats && size !== 'sm' && (
        <div className="w-full grid grid-cols-6 gap-0 border-t border-b border-white/5 py-2 mb-2 font-mono text-[10px] text-center bg-black/30 rounded select-none">
          <div>
            <div className="text-gray-400">PAC</div>
            <div className={`font-extrabold ${player.stats.pac >= 90 ? 'text-[#22c55e]' : player.stats.pac >= 80 ? 'text-yellow-400' : 'text-gray-200'}`}>
              {player.stats.pac}
            </div>
          </div>
          <div>
            <div className="text-gray-400">SHO</div>
            <div className={`font-extrabold ${player.stats.sho >= 90 ? 'text-[#22c55e]' : player.stats.sho >= 80 ? 'text-yellow-400' : 'text-gray-200'}`}>
              {player.stats.sho}
            </div>
          </div>
          <div>
            <div className="text-gray-400">PAS</div>
            <div className={`font-extrabold ${player.stats.pas >= 90 ? 'text-[#22c55e]' : player.stats.pas >= 80 ? 'text-yellow-400' : 'text-gray-200'}`}>
              {player.stats.pas}
            </div>
          </div>
          <div>
            <div className="text-gray-400">DRI</div>
            <div className={`font-extrabold ${player.stats.dri >= 90 ? 'text-[#22c55e]' : player.stats.dri >= 80 ? 'text-yellow-400' : 'text-gray-200'}`}>
              {player.stats.dri}
            </div>
          </div>
          <div>
            <div className="text-gray-400">DEF</div>
            <div className={`font-extrabold ${player.stats.def >= 90 ? 'text-[#22c55e]' : player.stats.def >= 80 ? 'text-yellow-400' : 'text-gray-200'}`}>
              {player.stats.def}
            </div>
          </div>
          <div>
            <div className="text-gray-400">PHY</div>
            <div className={`font-extrabold ${player.stats.phy >= 90 ? 'text-[#22c55e]' : player.stats.phy >= 80 ? 'text-yellow-400' : 'text-gray-200'}`}>
              {player.stats.phy}
            </div>
          </div>
        </div>
      )}

      {/* Aura Rating Bottom Meter */}
      <div className="w-full mt-auto select-none">
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mb-1 select-none">
          <span className="flex items-center gap-1 select-none">
            ⚡ AURA INDEX:
          </span>
          <span className="font-extrabold text-[#22c55e] tracking-tight text-right select-none">
            {player.auraRating}%
          </span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden select-none">
          <div
            className="bg-gradient-to-r from-emerald-500 to-green-300 h-1.5 rounded-full filter drop-shadow-[0_0_3px_#10b981]"
            style={{ width: `${Math.min(100, player.auraRating)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
