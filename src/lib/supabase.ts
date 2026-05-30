import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://jvitfacvsmtpdycaohcl.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_l4HAsxyEgkU4o37AIuVPxg_J-Ra5ypB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

