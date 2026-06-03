import { supabase } from './supabase';
import { Squad } from '../types';

/**
 * Save squad with exact parameters to Supabase.
 * Automatically handles UUID generation for initial client mock IDs.
 */
export async function saveSquadToCloud(squad: Squad, userId: string): Promise<{ success: boolean; squad?: Squad; error?: any }> {
  try {
    // Check if ID is a standard mock ID. If so, let Supabase auto-generate a valid UUID.
    const isMock = squad.id.startsWith('s-') && squad.id.length < 15;
    const dbId = isMock ? undefined : squad.id;

    const payload = {
      id: dbId,
      user_id: userId,
      user_name: squad.userName,
      name: squad.name,
      formation: squad.formation,
      slots: squad.slots,
      likes: squad.likes || 0,
      liked_by: squad.likedBy || [],
      chemistry: squad.chemistry || 0,
      rating: squad.rating || 0,
      is_public: squad.isPublic ?? true,
      description: squad.description || '',
      aura_score: squad.auraScore || 0,
    };

    const { data, error } = await supabase
      .from('squads')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Supabase squads upsert warning:', error.message);
      return { success: false, error };
    }

    // Also sync to squad_players table to satisfy deep relation targets
    try {
      if (data && data.id) {
        // Clear previous squad slots
        await supabase.from('squad_players').delete().eq('squad_id', data.id);

        const playersToInsert = squad.slots
          .filter(slot => slot.player !== null)
          .map(slot => ({
            squad_id: data.id,
            position_id: slot.positionId,
            player_data: slot.player
          }));

        if (playersToInsert.length > 0) {
          await supabase.from('squad_players').insert(playersToInsert);
        }
      }
    } catch (pe: any) {
      console.warn('Relational squad_players trigger warning:', pe.message);
    }

    const savedSquad: Squad = {
      id: data.id,
      name: data.name,
      userId: data.user_id,
      userName: data.user_name,
      formation: data.formation,
      slots: data.slots,
      chemistry: data.chemistry,
      rating: data.rating,
      isPublic: data.is_public,
      description: data.description,
      likes: data.likes,
      likedBy: data.liked_by,
      auraScore: data.aura_score,
      createdAt: data.created_at,
    };

    return { success: true, squad: savedSquad };
  } catch (err: any) {
    console.warn('Failed to upsert to Supabase:', err?.message || err);
    return { success: false, error: err };
  }
}

/**
 * Loads premium squads from Supabase.
 */
export async function loadSquadsFromCloud(userId?: string): Promise<Squad[]> {
  try {
    let query = supabase.from('squads').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const queryPromise = query.order('created_at', { ascending: false });
    const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) => {
      setTimeout(() => resolve({ error: new Error('loadSquadsFromCloud request timed out'), data: null }), 1200);
    });

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
    if (error || !data) {
      console.warn('Supabase squads retrieve warning or timeout:', error?.message);
      return [];
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      userId: row.user_id,
      userName: row.user_name,
      formation: row.formation,
      slots: row.slots,
      chemistry: row.chemistry,
      rating: row.rating,
      isPublic: row.is_public,
      description: row.description,
      likes: row.likes,
      likedBy: row.liked_by,
      auraScore: row.aura_score,
      createdAt: row.created_at,
    }));
  } catch (err: any) {
    console.warn('loadSquadsFromCloud crashed:', err?.message || err);
    return [];
  }
}

/**
 * Deletes squad from Supabase.
 */
export async function deleteSquadFromCloud(squadId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('squads').delete().eq('id', squadId);
    if (error) {
      console.warn('deleteSquadFromCloud warning:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('deleteSquadFromCloud crashed:', err?.message || err);
    return false;
  }
}
