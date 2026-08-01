import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://jvitfacvsmtpdycaohcl.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_l4HAsxyEgkU4o37AIuVPxg_J-Ra5ypB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

