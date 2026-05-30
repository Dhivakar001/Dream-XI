import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.warn('Profile mismatch or not yet persistent in trigger. Auto-creating client side fallback profile:', error);
        
        // Let's attempt to insert the fallback profile directly if DB trigger didn't execute yet
        const fallbackProfile: UserProfile = {
          id: userId,
          username: email.split('@')[0],
          email: email,
          favoriteClub: 'Real Madrid',
          winRate: 50,
          footballIQ: 100,
          followers: 0,
          following: 0,
          badges: ['Rookie Builder'],
          squadsCount: 0,
          bio: 'New Dream XI Gaffer!'
        };

        const { data: insertedData } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: email.split('@')[0],
            favorite_club: 'Real Madrid',
            win_rate: 50,
            football_iq: 100,
            followers: 0,
            following: 0,
            bio: 'New Dream XI Gaffer!',
            badges: ['Rookie Builder'],
            squads_count: 0
          })
          .select()
          .single();

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
            bio: insertedData.bio
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
          bio: data.bio
        });
      }
    } catch (e) {
      console.error('Error in fetchProfile cycle:', e);
    }
  };

  useEffect(() => {
    // Sync initial session status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email ?? '');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Handle authentication state modifications
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email ?? '');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
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
