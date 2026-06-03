import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, email: string, userObj?: any) => {
    try {
      const meta = userObj?.user_metadata || {};
      const joinDate = userObj?.created_at ? new Date(userObj.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });

      const getProfilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) => {
        setTimeout(() => resolve({ error: new Error('Profile query timed out'), data: null }), 1200);
      });

      const { data, error } = await Promise.race([getProfilePromise, timeoutPromise]);

      if (error || !data) {
        console.warn('Profile mismatch, timeout or not yet persistent in trigger. Auto-creating client side fallback profile:', error);
        
        // Let's attempt to insert the fallback profile directly if DB trigger didn't execute yet
        const fallbackProfile: UserProfile = {
          id: userId,
          username: meta.username || email.split('@')[0],
          email: email,
          favoriteClub: meta.favorite_club || 'Real Madrid',
          winRate: 50,
          footballIQ: 100,
          followers: 0,
          following: 0,
          badges: ['Rookie Builder'],
          squadsCount: 0,
          bio: meta.bio || 'New Dream XI Gaffer!',
          avatar: meta.avatar || '👑',
          favoritePlayer: meta.favorite_player || 'Cristiano Ronaldo',
          createdAt: joinDate
        };

        const insertPromise = supabase
          .from('profiles')
          .insert({
            id: userId,
            username: meta.username || email.split('@')[0],
            favorite_club: meta.favorite_club || 'Real Madrid',
            win_rate: 50,
            football_iq: 100,
            followers: 0,
            following: 0,
            bio: meta.bio || 'New Dream XI Gaffer!',
            badges: ['Rookie Builder'],
            squads_count: 0
          })
          .select()
          .single();

        const insertTimeoutPromise = new Promise<{ data: any; error: any }>((resolve) => {
          setTimeout(() => resolve({ error: new Error('Insert profile request timed out'), data: null }), 1200);
        });

        const { data: insertedData } = await Promise.race([insertPromise, insertTimeoutPromise]);

        if (insertedData) {
          setProfile({
            id: insertedData.id,
            username: insertedData.username,
            email: email,
            favoriteClub: insertedData.favorite_club,
            winRate: insertedData.win_rate,
            footballIQ: insertedData.football_iq,
            followers: insertedData.followers,
            following: insertedData.following,
            badges: insertedData.badges || ['Rookie Builder'],
            squadsCount: insertedData.squads_count,
            bio: insertedData.bio,
            avatar: meta.avatar || '👑',
            favoritePlayer: meta.favorite_player || 'Cristiano Ronaldo',
            createdAt: joinDate
          });
        } else {
          setProfile(fallbackProfile);
        }
      } else {
        setProfile({
          id: data.id,
          username: data.username,
          email: email,
          favoriteClub: data.favorite_club,
          winRate: data.win_rate,
          footballIQ: data.football_iq,
          followers: data.followers,
          following: data.following,
          badges: data.badges || ['Rookie Builder'],
          squadsCount: data.squads_count,
          bio: data.bio,
          avatar: meta.avatar || '👑',
          favoritePlayer: meta.favorite_player || 'Cristiano Ronaldo',
          createdAt: joinDate
        });
      }
    } catch (e: any) {
      console.warn('Error in fetchProfile cycle:', e?.message || e);
    }
  };

  useEffect(() => {
    let active = true;

    // Sync initial session status
    const initAuth = async () => {
      try {
        const getSessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<any>((resolve) => {
          setTimeout(() => resolve({ data: { session: null }, timedOut: true }), 1200);
        });

        const { data: { session }, timedOut } = await Promise.race([getSessionPromise, timeoutPromise]);
        
        if (!active) return;

        if (timedOut) {
          console.warn('Supabase getSession timed out, continuing with guest/local profile.');
        }

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email ?? '', session.user);
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        console.warn('Error during initAuth setup:', err?.message || err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Handle authentication state modifications
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email ?? '', session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    setProfile
  };
}
