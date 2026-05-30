import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Layers, Settings, LogOut, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';
import UserAvatar from './UserAvatar';
import { playFutSound } from '../utils';

interface UserDropdownProps {
  profile: UserProfile | null;
  onNavigate: (tab: any) => void;
  onLogout: () => void;
  id?: string;
}

export default function UserDropdown({
  profile,
  onNavigate,
  onLogout,
  id,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!profile) return null;

  return (
    <div
      ref={dropdownRef}
      id={id || "user-dropdown-container"}
      className="relative select-none z-50 font-mono text-xs"
    >
      <button
        onClick={() => {
          playFutSound('click');
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition duration-300 group text-left outline-none"
        id="user-dropdown-trigger"
      >
        <UserAvatar profile={profile} size="sm" />
        <div className="hidden sm:block leading-tight text-[11px] truncate max-w-[100px]">
          <p className="font-sans font-black text-white group-hover:text-emerald-400 transition truncate uppercase">
            {profile.username}
          </p>
          <span className="text-[8px] text-gray-400 tracking-widest block uppercase">
            GAFFER XI
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-[#0B0B0F] border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.8)] overflow-hidden"
            id="user-dropdown-menu"
          >
            {/* Quick Profile Summary Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-none">Logged In As</p>
              <p className="font-sans font-black text-white text-sm uppercase mt-1.5 truncate">
                {profile.username}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 truncate font-sans">
                {profile.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="p-1.5 flex flex-col gap-1">
              <button
                onClick={() => {
                  playFutSound('click');
                  setIsOpen(false);
                  onNavigate('profile');
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-emerald-500/10 text-gray-300 hover:text-emerald-400 transition flex items-center gap-3"
                id="menu-item-profile"
              >
                <User className="w-4 h-4" />
                <span className="font-sans font-bold">My Profile</span>
              </button>

              <button
                onClick={() => {
                  playFutSound('click');
                  setIsOpen(false);
                  onNavigate('my-squads');
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-purple-500/10 text-gray-300 hover:text-purple-400 transition flex items-center gap-3"
                id="menu-item-squads"
              >
                <Layers className="w-4 h-4" />
                <span className="font-sans font-bold">My Squads</span>
              </button>

              <button
                onClick={() => {
                  playFutSound('click');
                  setIsOpen(false);
                  onNavigate('settings');
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-500/10 text-gray-300 hover:text-sky-400 transition flex items-center gap-3"
                id="menu-item-settings"
              >
                <Settings className="w-4 h-4" />
                <span className="font-sans font-bold">Settings</span>
              </button>
            </div>

            {/* Logout Item */}
            <div className="p-1.5 border-t border-white/5 bg-white/[0.01]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-red-400 hover:bg-red-950/20 hover:text-red-300 transition flex items-center gap-3"
                id="menu-item-logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-sans font-bold">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
