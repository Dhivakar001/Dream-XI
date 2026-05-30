import React from 'react';
import { UserProfile } from '../types';

interface UserAvatarProps {
  profile: UserProfile | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  id?: string;
}

export default function UserAvatar({
  profile,
  size = 'md',
  className = '',
  onClick,
  id,
}: UserAvatarProps) {
  const avatarChar = profile?.avatar || '👑';

  // Size dimensions map
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  };

  // Get size class or default
  const dims = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      id={id || `user-avatar-${profile?.id || 'guest'}`}
      onClick={onClick}
      className={`relative shrink-0 flex items-center justify-center rounded-full bg-slate-950 border-2 border-emerald-500/30 hover:border-emerald-400 select-none cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] group ${dims} ${className}`}
    >
      {/* Premium animated halo outline ring */}
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none blur-sm" />
      
      {/* Inner Avatar Character */}
      <span className="relative z-10">{avatarChar}</span>
    </div>
  );
}
