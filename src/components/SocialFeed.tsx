import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Share2, Flame, User, Send, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { SocialPost, Comment, Squad } from '../types';
import { playFutSound } from '../utils';
import { useTranslation } from '../lib/LanguageContext';

interface SocialFeedProps {
  userId: string;
  userName: string;
  userBio: string;
  feedPosts: SocialPost[];
  onSetSquad: (squad: Squad) => void;
  onRefreshFeed: () => void;
  onSwitchTab: (tab: string) => void;
}

export default function SocialFeed({
  userId,
  userName,
  userBio,
  feedPosts,
  onSetSquad,
  onRefreshFeed,
  onSwitchTab,
}: SocialFeedProps) {
  const { t } = useTranslation();
  const [postText, setPostText] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Trending sidebar hashtags list
  const trendingTags = [
    { tag: '#Antony360', count: `14.2k ${t('takes')}` },
    { tag: '#TacticsHybrid', count: `9.8k ${t('gafers')}` },
    { tag: '#BallonDor', count: `8.4k ${t('votes')}` },
    { tag: '#AuraIndex', count: `6.1k ${t('ratings')}` },
    { tag: '#PeleSamba', count: `4.2k ${t('duels')}` }
  ];

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    playFutSound('success');
    const payload = {
      userId,
      userName,
      userBio,
      text: postText,
    };

    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setPostText('');
        onRefreshFeed();
      }
    } catch (err: any) {
      console.warn('Failed to create take', err?.message || err);
    }
  };

  const handleLikePost = async (postId: string) => {
    playFutSound('click');
    try {
      const res = await fetch(`/api/feed/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        onRefreshFeed();
      }
    } catch (err: any) {
      console.warn('Failed to register like metric', err?.message || err);
    }
  };

  const openCommentDrawer = async (postId: string) => {
    playFutSound('click');
    setActiveCommentsPostId(postId);
    setLoadingComments(true);
    setPostComments([]);

    try {
      const res = await fetch(`/api/comments/${postId}`);
      const data = await res.json();
      setPostComments(data);
    } catch (e: any) {
      console.warn('Failed to query post comment threads', e?.message || e);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeCommentsPostId) return;

    playFutSound('click');
    const commentPayload = {
      targetId: activeCommentsPostId,
      userId,
      userName,
      text: commentText,
    };

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentPayload),
      });
      const data = await res.json();
      if (data.success) {
        setCommentText('');
        setPostComments(prev => [...prev, data.comment]);
        onRefreshFeed();
      }
    } catch (err: any) {
      console.warn('Failed to publish take reply', err?.message || err);
    }
  };

  const handleInspectSquad = (squad: Squad) => {
    playFutSound('success');
    onSetSquad(squad);
    onSwitchTab('builder');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 select-none">
      
      {/* Feed Layout columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Main Feed panel (Col 1) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {/* Create take editor box */}
          <div className="bg-[#12111a] border border-white/10 p-5 rounded-2xl shadow-xl flex gap-4 backdrop-blur relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Interactive Creator profile halo ring */}
            <div className="w-11 h-11 bg-gradient-to-tr from-[#10b981] via-emerald-400 to-yellow-300 p-[2px] rounded-full shrink-0 select-none flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="flex-1 flex flex-col gap-3 font-mono text-xs">
              <textarea
                rows={2}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder={t("Publish a tactical take or squad override... Rate Antony? Defend Mudryk?")}
                className="w-full bg-[#08070d] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-400 font-sans text-xs font-bold leading-normal resize-none"
              />

              <div className="flex justify-between items-center select-none pt-1">
                <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1.5 uppercase font-black">
                  <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-bounce" />
                  {t("POSTING AS")} @{userName}
                </span>

                <button
                  type="submit"
                  disabled={!postText.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-[#10b981] to-emerald-400 text-black font-black uppercase text-[10px] rounded-lg tracking-wider flex items-center gap-1 cursor-pointer hover:brightness-110 active:scale-95 disabled:opacity-30 transition shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                >
                  <Send className="w-3 h-3 fill-black" />
                  {t("PUBLISH TAKE")}
                </button>
              </div>
            </form>
          </div>

          {/* Social posts display lists */}
          <div className="flex flex-col gap-5">
            {feedPosts.length === 0 ? (
              <div className="text-center py-12 bg-slate-900 border border-white/5 rounded-2xl text-gray-400">
                {t("Silence on the feed index. Share a take!")}
              </div>
            ) : (
              feedPosts.map(post => {
                const totalLikes = post.likes || 0;
                const totalComments = post.commentsCount || 0;
                const hasLiked = post.likedBy?.includes(userId);

                return (
                  <div key={post.id} className="bg-[#12121e] border-2 border-white/5 hover:border-violet-500/20 p-5 rounded-2xl backdrop-blur shadow-2xl flex gap-4 relative font-sans transition duration-300">
                    
                    {/* Glowing outer gradient creator avatar for premium TikTok vibe */}
                    <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 via-fuchsia-600 to-yellow-400 p-[2.5px] rounded-full shrink-0 select-none flex items-center justify-center shadow-[0_0_12px_rgba(219,39,119,0.15)]">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-mono text-base">
                        ⚽
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name fields */}
                      <div className="flex flex-col mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs hover:text-pink-400 transition cursor-pointer">@{post.userName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-violet-950/40 text-[8px] uppercase font-mono border border-violet-500/20 tracking-wider text-fuchsia-400">
                            {t("VERIFIED CREATOR")}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-500 truncate leading-none mt-1 font-mono">{post.userBio}</span>
                      </div>

                      {/* Content block */}
                      <p className="text-xs text-slate-100 leading-relaxed mb-4 font-sans font-black tracking-wide">
                        {post.text}
                      </p>

                      {/* Embed interactive Squad Preview block if attached! */}
                      {post.squad && (
                        <div className="bg-gradient-to-r from-emerald-950/25 via-[#13111d] to-[#08070c] border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between gap-4 mb-4 shadow-xl relative overflow-hidden select-none">
                          <div className="absolute top-0 right-0 p-2.5">
                            <Sparkles className="w-4 h-4 text-emerald-400/20 animate-pulse" />
                          </div>

                          <div className="min-w-0 leading-tight">
                            <span className="text-[8px] bg-emerald-900/30 text-[#10b981] border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-widest block w-max mb-1.5">
                              {t("SHARED HYBRID SQUAD")}
                            </span>
                            <h4 className="font-black text-sm text-white uppercase truncate">{post.squad.name}</h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-1">
                              {t("RATING:")} <strong className="text-white">{post.squad.rating} {t("OVR")}</strong> • {t("CHEMISTRY:")} <strong className="text-[#10b981]">{post.squad.chemistry}%</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => handleInspectSquad(post.squad!)}
                            className="bg-emerald-400 hover:bg-emerald-300 text-black px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)] transition"
                          >
                            {t("Inspect XI")}
                          </button>
                        </div>
                      )}

                      {/* Micro-Slang quick review bar to feel like Gen Z soccer debates */}
                      <div className="flex flex-wrap gap-1.5 mb-4 select-none">
                        {[
                          { text: t('🔥 W TAKE'), class: 'bg-emerald-900/35 border-emerald-500/20 text-emerald-400 text-[8px]' },
                          { text: t('💀 COLD'), class: 'bg-indigo-900/35 border-indigo-500/20 text-indigo-400 text-[8px]' },
                          { text: t('👑 HE COOKS'), class: 'bg-amber-900/35 border-amber-500/20 text-amber-400 text-[8px]' },
                          { text: t('🤡 NAH'), class: 'bg-red-900/35 border-red-500/20 text-red-500 text-[8px]' }
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              playFutSound('success');
                              alert(t("Debate started: You agreed \"{text}\" on @{userName}'s take!").replace("{text}", p.text).replace("{userName}", post.userName));
                            }}
                            className={`px-2 py-1 select-none font-black font-mono border rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition ${p.class}`}
                          >
                            {p.text}
                          </button>
                        ))}
                      </div>

                      {/* Action buttons (Like, Comment, Share) */}
                      <div className="flex items-center gap-5 pt-1 text-xs text-gray-400 font-mono select-none">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 hover:text-red-400 transition cursor-pointer select-none ${hasLiked ? 'text-red-400 font-black' : ''}`}
                        >
                          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          {totalLikes}
                        </button>
                        <button
                          onClick={() => openCommentDrawer(post.id)}
                          className="flex items-center gap-1.5 hover:text-yellow-400 transition cursor-pointer select-none"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {totalComments}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Sidebar trending sections (Col 2) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Spotify-Wrapped styled Hot Trends Card */}
          <div className="bg-[#110f1c] border-2 border-fuchsia-500/15 p-5 rounded-2xl shadow-xl backdrop-blur relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <span className="text-[10px] text-fuchsia-400 font-black uppercase tracking-widest block mb-4 border-b border-fuchsia-500/25 pb-2.5">
              <Compass className="w-4 h-4 text-fuchsia-400 inline mr-1 mb-0.5 animate-spin-slow" />
              {t("HOT FOOTBALL TRENDS")}
            </span>

            <div className="flex flex-col gap-3.5">
              {trendingTags.map((tItem, idx) => (
                <div key={idx} className="flex gap-3 items-center py-2.5 border-b border-white/5 last:border-0 leading-tight group">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-black text-white text-[10px] shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans font-bold text-xs text-white block group-hover:text-yellow-400 cursor-pointer transition truncate">{tItem.tag}</span>
                    <span className="text-[9px] text-gray-500 font-mono">{tItem.count}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold tracking-tight bg-emerald-950/40 px-1.5 py-0.5 rounded leading-none">
                    {t("🔥 HOT")}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* COMMENTS SUB-DRAWER SHEET overlay */}
      <AnimatePresence>
        {activeCommentsPostId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
            
            {/* Backdrop click closer */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveCommentsPostId(null)} />

            {/* Comments side-sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-slate-950 border-l border-white/10 h-full p-5 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10 select-none">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{t("Comments Feed")}</h3>
                  <p className="text-[9px] text-gray-500 font-mono">{t("Participate in the soccer debate chain")}</p>
                </div>
                <button
                  onClick={() => setActiveCommentsPostId(null)}
                  className="p-1 rounded bg-slate-900 border border-white/10 hover:border-red-500 hover:text-red-400 text-gray-400 cursor-pointer text-[10px]"
                >
                  {t("Close")}
                </button>
              </div>

              {/* Chat replies Lists */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 h-0 pr-1 mb-4">
                {loadingComments ? (
                  <div className="text-center py-8 text-gray-500 font-mono text-xs">{t("Loading replies...")}</div>
                ) : postComments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 font-mono flex flex-col items-center">
                    <MessageSquare className="w-8 h-8 text-slate-700 mb-1" />
                    {t("No match observations. Share your hot reply take!")}
                  </div>
                ) : (
                  postComments.map(comment => (
                    <div key={comment.id} className="bg-slate-900/40 border border-white/5 p-3 rounded-xl flex flex-col gap-1 text-xs">
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="font-extrabold text-[#ffe58f]">@{comment.userName}</span>
                        <span className="text-[9px] text-gray-500">
                          {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed font-sans">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Publish Reply */}
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t("Draft your take, counter-argument...")}
                  className="flex-1 bg-black border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-yellow-400 text-xs text-xs font-bold leading-none font-sans"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-3 bg-yellow-400 text-black font-black uppercase text-[10px] rounded-xl hover:brightness-110 cursor-pointer disabled:opacity-40 transition"
                >
                  {t("REPLY")}
                </button>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
