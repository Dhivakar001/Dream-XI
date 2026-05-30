import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Trophy, KeyRound } from 'lucide-react';
import LoginPage from '../app/login/page';
import SignupPage from '../app/signup/page';
import { playFutSound } from '../utils';

interface ProtectedRouteProps {
  user: any;
  children: React.ReactNode;
  id?: string;
}

export default function ProtectedRoute({ user, children, id }: ProtectedRouteProps) {
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  if (user) {
    return <>{children}</>;
  }

  return (
    <div
      id={id || "protected-route-gate"}
      className="w-full flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden select-none"
    >
      {/* Small floating lock screen notice card before transitioning into form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-[#12111c] to-[#08070d] border-2 border-dashed border-purple-500/30 p-8 rounded-3xl text-center shadow-xl backdrop-blur relative z-10"
      >
        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 mx-auto mb-6">
          <KeyRound className="w-6 h-6 animate-pulse" />
        </div>
        
        <h3 className="font-sans font-black text-white text-lg uppercase tracking-tight">
          Sovereign Gaffer Gate Locked
        </h3>
        <p className="text-gray-400 text-xs font-mono mt-2 uppercase tracking-wide leading-relaxed">
          Lock in your stadium credentials to draft premium tactical squads, check simulation diagnostics, and customize your coach profile.
        </p>
      </motion.div>

      {/* Render form directly in place beautifully */}
      <div className="w-full mt-8 relative z-10">
        <AnimatePresence mode="wait">
          {authView === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <LoginPage
                onToggleForm={() => {
                  playFutSound('click');
                  setAuthView('signup');
                }}
                onSuccess={() => {
                  playFutSound('success');
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <SignupPage
                onToggleForm={() => {
                  playFutSound('click');
                  setAuthView('login');
                }}
                onSuccess={() => {
                  playFutSound('success');
                  setAuthView('login');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
