import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Share2, Flame, User, Send, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { SocialPost, Comment, Squad } from '../types';
import { playFutSound } from '../utils';

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
  const [postText, setPostText] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Trending sidebar hashtags list
  const trendingTags = [
    { tag: '#Antony360', count: '14.2k takes' },
    { tag: '#TacticsHybrid', count: '9.8k gafers' },
    { tag: '#BallonDor', count: '8.4k votes' },
    { tag: '#AuraIndex', count: '6.1k ratings' },
    { tag: '#PeleSamba', count: '4.2k duels' }
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
    } catch (err) {
      console.error('Failed to create take', err);
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
    } catch (err) {
      console.error('Failed to register like metric', err);
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
    } catch (e) {
      console.error('Failed to query post comment threads', e);
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
    } catch (err) {
      console.error('Failed to publish take reply', err);
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
          <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl shadow-xl flex gap-3.5 backdrop-blur">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-1 select-none text-[#10b981]">
              <User className="w-5 h-5 text-[#10b981]" />
            </div>

            <form onSubmit={handleCreatePost} className="flex-1 flex flex-col gap-3 font-mono text-xs">
              <textarea
                rows={2}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What is your latest football take? Debunk Messi configs, list Antony rotation metrics..."
                className="w-full bg-black border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-yellow-400 font-sans text-xs font-bold leading-normal resize-none"
              />

              <div className="flex justify-between items-center select-none pt-1">
                <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                  POSTING AS @{userName}
                </span>

                <button
                  type="submit"
                  disabled={!postText.trim()}
                  className="px-4 py-2 bg-yellow-400 text-black font-black uppercase text-[10px] rounded-lg tracking-wider flex items-center gap-1 cursor-pointer hover:brightness-110 active:scale-95 disabled:opacity-40 transition"
                >
                  <Send className="w-3 h-3 fill-black" />
                  PUBLISH TAKE
                </button>
              </div>
            </form>
          </div>

          {/* Social posts display lists */}
          <div className="flex flex-col gap-4">
            {feedPosts.length === 0 ? (
              <div className="text-center py-12 bg-slate-900 border border-white/5 rounded-2xl text-gray-500">
                Silence on the feed index. Share a take!
              </div>
            ) : (
              feedPosts.map(post => {
                const totalLikes = post.likes || 0;
                const totalComments = post.commentsCount || 0;
                const hasLiked = post.likedBy?.includes(userId);

                return (
                  <div key={post.id} className="bg-slate-900/60 border border-white/5 p-5 rounded-2xl backdrop-blur shadow-lg flex gap-3.5 relative font-sans">
                    
                    {/* User Profile display representation */}
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 select-none font-mono">
                      ⚽
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name fields */}
                      <div className="flex flex-col mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs">@{post.userName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[8px] uppercase font-mono border border-white/5 tracking-wider text-yellow-500">
                            Gaffer XI
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 truncate leading-none mt-1 font-mono">{post.userBio}</span>
                      </div>

                      {/* Content block */}
                      <p className="text-xs text-slate-100 leading-relaxed mb-4 font-sans font-bold">
                        {post.text}
                      </p>

                      {/* Embed interactive Squad Preview block if attached! */}
                      {post.squad && (
                        <div className="bg-gradient-to-r from-emerald-950/25 to-slate-950 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between gap-4 mb-4 shadow-inner relative overflow-hidden select-none">
                          <div className="absolute top-0 right-0 p-2.5">
                            <Sparkles className="w-4 h-4 text-emerald-400/10" />
                          </div>

                          <div className="min-w-0 leading-tight">
                            <span className="text-[9px] text-[#10b981] font-mono font-black uppercase tracking-widest block mb-1">
                              SHARED HYBRID SQUAD
                            </span>
                            <h4 className="font-black text-sm text-white uppercase truncate">{post.squad.name}</h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-1">
                              Rating: <strong className="text-white">{post.squad.rating} OVR</strong> • Chemistry: <strong className="text-[#10b981]">{post.squad.chemistry}%</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => handleInspectSquad(post.squad!)}
                            className="bg-slate-800 hover:bg-slate-700 text-white border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 cursor-pointer"
                          >
                            Inspect XI
                          </button>
                        </div>
                      )}

                      {/* Action buttons (Like, Comment, Share) */}
                      <div className="flex items-center gap-5 pt-1 text-xs text-gray-400 font-mono select-none">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1 hover:text-red-400 transition cursor-pointer select-none ${hasLiked ? 'text-red-400 font-black' : ''}`}
                        >
                          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          {totalLikes}
                        </button>
                        <button
                          onClick={() => openCommentDrawer(post.id)}
                          className="flex items-center gap-1 hover:text-yellow-400 transition cursor-pointer select-none"
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
          
          <div className="bg-slate-900/90 border border-white/5 p-4 rounded-2xl shadow-xl backdrop-blur">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-4 border-b border-white/5 pb-2">
              <Compass className="w-4 h-4 text-yellow-400 inline mr-1 mb-0.5" />
              HOT FOOTBALL TRENDS
            </span>

            <div className="flex flex-col gap-4">
              {trendingTags.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0 leading-tight">
                  <div>
                    <span className="font-sans font-black text-xs text-white block hover:text-yellow-400 cursor-pointer">{t.tag}</span>
                    <span className="text-[9px] text-gray-500 font-mono">{t.count}</span>
                  </div>
                  <span className="text-[12px] text-yellow-400/80 italic font-bold">🔥 hot</span>
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
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Comments Feed</h3>
                  <p className="text-[9px] text-gray-500 font-mono">Participate in the soccer debate chain</p>
                </div>
                <button
                  onClick={() => setActiveCommentsPostId(null)}
                  className="p-1 rounded bg-slate-900 border border-white/10 hover:border-red-500 hover:text-red-400 text-gray-400 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Chat replies Lists */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 h-0 pr-1 mb-4">
                {loadingComments ? (
                  <div className="text-center py-8 text-gray-500 font-mono text-xs">Loading replies...</div>
                ) : postComments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 font-mono flex flex-col items-center">
                    <MessageSquare className="w-8 h-8 text-slate-700 mb-1" />
                    No match observations. Share your hot reply take!
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
                  placeholder="Draft your take, counter-argument..."
                  className="flex-1 bg-black border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-yellow-400 text-xs text-xs font-bold leading-none font-sans"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-3 bg-yellow-400 text-black font-black uppercase text-[10px] rounded-xl hover:brightness-110 cursor-pointer disabled:opacity-40 transition"
                >
                  REPLY
                </button>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
