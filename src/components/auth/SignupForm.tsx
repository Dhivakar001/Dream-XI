import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Eye, EyeOff, Loader, Sparkles, Trophy, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { playFutSound } from '../../utils';
import { useTranslation } from '../../lib/LanguageContext';

interface SignupFormProps {
  onToggleForm: () => void;
  onSuccess: () => void;
}

export default function SignupForm({ onToggleForm, onSuccess }: SignupFormProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Field validation states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // Password strength calculator
  const checkPasswordStrength = (pass: string) => {
    if (!pass) return { rating: t('UNRANKED'), color: 'text-gray-600', width: 'w-0' };
    if (pass.length < 6) return { rating: t('WARM WATER COOK (TRASH)'), color: 'text-red-500', width: 'w-1/4 bg-red-500' };
    if (pass.length < 8) return { rating: t('ROOKIE GAFFER (MID)'), color: 'text-orange-500', width: 'w-2/4 bg-orange-500' };
    
    // Check complexity
    const hasNumbers = /\d/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    
    if (hasNumbers && hasSpecial && pass.length >= 10) {
      return { rating: t('AURA KING LEVEL (GOD)'), color: 'text-yellow-400', width: 'w-full bg-gradient-to-r from-yellow-400 to-emerald-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]' };
    }
    
    return { rating: t('TACTICIAN MASTER (STRONG)'), color: 'text-emerald-400', width: 'w-3/4 bg-emerald-400' };
  };

  const strength = checkPasswordStrength(password);

  const validate = () => {
    let isValid = true;
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setErrorMsg('');

    if (!username) {
      setUsernameError(t('Choose your gaffer nick/username!'));
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError(t('Min 3 tactical coordinates required!'));
      isValid = false;
    }

    if (!email) {
      setEmailError(t('Email is required, Gaffer!'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('Input a valid tactical transfer-window email address!'));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t('Gaffer credentials need coordinates!'));
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError(t('Min 8 premium characters required!'));
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError(t('Security keys mismatch! Realign coordinates.'));
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      playFutSound('click');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
        playFutSound('click');
      } else {
        setSuccessMsg(t("ACCOUNT REGISTERED SUCCESSFULLY! Auto-syncing profile."));
        playFutSound('success');
        
        // Supposing everything works, proceed to success trigger
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || t('Signup pipeline failed. Verify coordinates!'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
          setErrorMsg(t('Please allow popups for this site to register with Google!'));
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

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md bg-[#12111c]/95 border-2 border-violet-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden select-none font-sans"
    >
      {/* Visual glowing aura effects */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Futuristic football header badge */}
      <div className="flex justify-center mb-6">
        <span className="bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-3 rounded-2xl text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-1.5">
          {t("Create Account")} <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        </h2>
        <p className="text-gray-400 text-xs mt-1.5 font-mono">
          {t("Join the community and build legendary football squads.")}
        </p>
      </div>

      {/* Global alerts */}
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

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        {/* Username */}
        <div>
          <label className="text-[9px] text-gray-500 font-mono tracking-widest uppercase block mb-1.5 pl-1.5">{t("GAFFER NICKNAME (@)")}</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="gafer_xi"
              className="w-full bg-[#08070d] border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-fuchsia-400 font-mono transition"
            />
          </div>
          {usernameError && (
            <p className="text-red-400 text-[9px] font-mono uppercase mt-1 pl-1.5">⚠️ {usernameError}</p>
          )}
        </div>

        {/* Email */}
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
              className="w-full bg-[#08070d] border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-fuchsia-400 font-mono transition"
            />
          </div>
          {emailError && (
            <p className="text-red-400 text-[9px] font-mono uppercase mt-1 pl-1.5">⚠️ {emailError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-[9px] text-gray-500 font-mono tracking-widest uppercase block mb-1.5 pl-1.5">{t("SECURITY KEY")}</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#08070d] border border-white/10 text-white rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-fuchsia-400 font-mono transition"
            />
            <button
              type="button"
              onClick={() => { playFutSound('click'); setShowPassword(!showPassword); }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Strength meter bar layout */}
          {password && (
            <div className="mt-2.5 pl-1.5 pr-1.5">
              <div className="flex justify-between font-mono text-[8px] uppercase tracking-wider mb-1">
                <span>{t("SECURITY LEVEL:")}</span>
                <span className={`font-black ${strength.color}`}>{strength.rating}</span>
              </div>
              <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strength.width}`} />
              </div>
            </div>
          )}

          {passwordError && (
            <p className="text-red-400 text-[9px] font-mono uppercase mt-1 pl-1.5">⚠️ {passwordError}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="text-[9px] text-gray-500 font-mono tracking-widest uppercase block mb-1.5 pl-1.5">{t("CONFIRM SECURITY KEY")}</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#08070d] border border-white/10 text-white rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-fuchsia-400 font-mono transition"
            />
          </div>
          {confirmError && (
            <p className="text-red-400 text-[9px] font-mono uppercase mt-1 pl-1.5">⚠️ {confirmError}</p>
          )}
        </div>

        {/* Form CTA lock button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.01] hover:brightness-110 active:scale-95 transition shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin text-white" />
          ) : (
            <>
              🏆 {t("CREATE ACCOUNT")}
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
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full py-3 bg-[#0c0b11] hover:bg-[#161521] border border-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-xl active:scale-95 hover:border-fuchsia-500/40 transition cursor-pointer flex items-center justify-center gap-2"
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
        <span>{t("REGISTER WITH Google")}</span>
      </button>

      {/* Switch Form button */}
      <div className="text-center mt-6">
        <button
          onClick={() => { playFutSound('click'); onToggleForm(); }}
          className="text-gray-400 hover:text-yellow-400 font-mono text-[10px] uppercase tracking-wider transition cursor-pointer"
        >
          {t("Already have an account?")} <strong className="text-fuchsia-400 hover:underline">{t("Login")}</strong>
        </button>
      </div>
    </motion.div>
  );
}
