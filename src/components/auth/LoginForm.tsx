import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Loader, Sparkles, Flame, Shield, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { playFutSound } from '../../utils';
import { useTranslation } from '../../lib/LanguageContext';

interface LoginFormProps {
  onToggleForm: () => void;
  onSuccess: () => void;
}

export default function LoginForm({ onToggleForm, onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setErrorMsg('');

    if (!email) {
      setEmailError(t('Email is required, Gaffer!'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('Input a valid tactical transfer-window email address!'));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t('Password is required to lock in your squad!'));
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError(t('Min 8 premium characters required!'));
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      playFutSound('click');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        playFutSound('click');
      } else {
        setSuccessMsg(t("GAFFER CREDENTIALS VERIFIED! Welcome back to the pitch."));
        playFutSound('success');
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || t('Crashed. Review internet coordinates!'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      playFutSound('click');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true
        }
      });
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      if (data?.url) {
        // Open the google oauth url directly in a popup
        const authWindow = window.open(
          data.url,
          'oauth_popup',
          'width=600,height=700'
        );
        if (!authWindow) {
          setErrorMsg(t('Please allow popups for this site to log in with Google!'));
        }
      } else {
        setErrorMsg(t('Auth URL generation succeeded but returned empty address.'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || t('Google Auth initiation failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError(t('Provide your email first to recover tactical keys!'));
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`,
      });
      if (error) {
         setErrorMsg(error.message);
      } else {
        setSuccessMsg(t('Recovery telemetry coordinates dispatched! Check email.'));
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md bg-[#12111c]/95 border-2 border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden select-none font-sans"
    >
      {/* Visual glowing aura effects */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Futuristic football header badge */}
      <div className="flex justify-center mb-6">
        <span className="bg-gradient-to-tr from-emerald-400 to-yellow-300 p-3 rounded-2xl text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center">
          <Shield className="w-5 h-5 text-black fill-black" />
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-1.5">
          {t("Welcome Back")} <Flame className="w-5 h-5 text-red-500 fill-red-500 animate-bounce" />
        </h2>
        <p className="text-gray-400 text-xs mt-1.5 font-mono">
          {t("Build your dream squad and continue your football journey.")}
        </p>
      </div>

      {/* Global telemetry alerts */}
      {errorMsg && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-[10px] p-3 rounded-xl font-mono uppercase tracking-wider mb-4 leading-normal">
          ⚠️ {t("TACTICAL ERROR")}: {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] p-3 rounded-xl font-mono uppercase tracking-wider mb-4 leading-normal">
          ✅ {t("SYSTEM")}: {successMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* Email Form Entry */}
        <div>
          <label className="text-[9px] text-gray-500 font-mono tracking-widest uppercase block mb-1.5 pl-1.5">{t("EMAIL ADDR")}</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gaffer@stadiumlabs.com"
              className="w-full bg-[#08070d] border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-400 font-mono transition"
            />
          </div>
          {emailError && (
            <p className="text-red-400 text-[9px] font-mono uppercase mt-1 pl-1.5">⚠️ {emailError}</p>
          )}
        </div>

        {/* Password Entry */}
        <div>
          <div className="flex justify-between items-center mb-1.5 pl-1.5">
            <label className="text-[9px] text-gray-500 font-mono tracking-widest uppercase block">{t("GADGET KEY")}</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[9px] text-emerald-400 hover:text-emerald-300 font-mono uppercase tracking-wider transition cursor-pointer"
            >
              {t("LOST KEY?")}
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#08070d] border border-white/10 text-white rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-emerald-400 font-mono transition"
            />
            <button
              type="button"
              onClick={() => { playFutSound('click'); setShowPassword(!showPassword); }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-400 text-[9px] font-mono uppercase mt-1 pl-1.5">⚠️ {passwordError}</p>
          )}
        </div>

        {/* Remember me bar */}
        <div className="flex items-center justify-between select-none mb-2 pl-1.5 font-mono text-[9px]">
          <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-black border-white/15 text-emerald-500 focus:ring-transparent w-3.5 h-3.5"
            />
            <span>{t("REMEMBER SQUAD CONTROLLER")}</span>
          </label>
        </div>

        {/* Form CTA lock button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.01] hover:brightness-110 active:scale-95 transition shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin text-black" />
          ) : (
            <>
              🔒 {t("CONNECT DOCK")}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Google Link divider layout */}
      <div className="flex items-center my-5 select-none">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[8px] text-gray-500 font-mono uppercase px-3 tracking-widest">{t("TACTICAL MULTI-PORTAL")}</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-3 bg-[#0c0b11] hover:bg-[#161521] border border-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-xl active:scale-95 hover:border-violet-500/40 transition cursor-pointer flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.03-1.21-.19-1.85-.63z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{t("ENTER WITH GOOGLE")}</span>
      </button>

      {/* Switch Form button */}
      <div className="text-center mt-6">
        <button
          onClick={() => { playFutSound('click'); onToggleForm(); }}
          className="text-gray-400 hover:text-yellow-400 font-mono text-[10px] uppercase tracking-wider transition cursor-pointer"
        >
          {t("Don't have an account?")} <strong className="text-emerald-400 hover:underline">{t("Sign Up")}</strong>
        </button>
      </div>
    </motion.div>
  );
}
