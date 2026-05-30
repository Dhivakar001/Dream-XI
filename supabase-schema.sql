-- ==========================================
-- DREAM XI LABS - SUPABASE PRODUCTION SCHEMA
-- ==========================================

-- Disable constraints temporarily to drop smoothly
drop table if exists public.comments cascade;
drop table if exists public.likes cascade;
drop table if exists public.squad_players cascade;
drop table if exists public.squads cascade;
drop table if exists public.profiles cascade;

-- 1. Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  favorite_club text default 'Real Madrid',
  win_rate integer default 50,
  football_iq integer default 100,
  followers integer default 0,
  following integer default 0,
  bio text default 'New Dream XI Gaffer!',
  badges text[] default array['Rookie Builder']::text[],
  squads_count integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Allow public read access to profiles" on public.profiles
  for select using (true);

create policy "Allow users to update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger for profile on sign-up (automatically links to auth.users)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, bio, favorite_club, win_rate, football_iq)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'New Dream XI Gaffer!',
    'Real Madrid',
    50,
    100
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create squads table with slots redundancy
create table public.squads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text not null,
  name text not null,
  formation text not null,
  slots jsonb not null default '[]'::jsonb, -- atomic client layout
  likes integer default 0,
  liked_by text[] default array[]::text[],
  chemistry integer default 0,
  rating integer default 0,
  is_public boolean default true,
  description text,
  aura_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for squads
alter table public.squads enable row level security;

-- Squads Policies
create policy "Allow public read access to public squads" on public.squads
  for select using (is_public = true or auth.uid() = user_id);

create policy "Allow users to insert their own squads" on public.squads
  for insert with check (auth.uid() = user_id);

create policy "Allow users to update their own squads" on public.squads
  for update using (auth.uid() = user_id);

create policy "Allow users to delete their own squads" on public.squads
  for delete using (auth.uid() = user_id);

-- 3. Create squad_players table to persist each drafted position cleanly
create table public.squad_players (
  id uuid default gen_random_uuid() primary key,
  squad_id uuid references public.squads(id) on delete cascade not null,
  position_id text not null, -- e.g. 'ST', 'GK'
  player_data jsonb not null -- Detailed player attributes
);

-- Enable RLS for squad_players
alter table public.squad_players enable row level security;

create policy "Allow select access to squad_players if squad is accessible" on public.squad_players
  for select using (
    exists (
      select 1 from public.squads s 
      where s.id = squad_id and (s.is_public = true or auth.uid() = s.user_id)
    )
  );

create policy "Allow insert on squad_players for owners" on public.squad_players
  for insert with check (
    exists (
      select 1 from public.squads s 
      where s.id = squad_id and auth.uid() = s.user_id
    )
  );

create policy "Allow delete on squad_players for owners" on public.squad_players
  for delete using (
    exists (
      select 1 from public.squads s 
      where s.id = squad_id and auth.uid() = s.user_id
    )
  );

-- 4. Create likes table (to track squad reactions)
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  squad_id uuid references public.squads(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, squad_id)
);

-- Enable RLS for likes
alter table public.likes enable row level security;

create policy "Allow anyone to view likes" on public.likes
  for select using (true);

create policy "Allow users to like" on public.likes
  for insert with check (auth.uid() = user_id);

create policy "Allow users to unlike" on public.likes
  for delete using (auth.uid() = user_id);

-- 5. Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  target_id uuid not null, -- matches either a squad_id or a battle_id
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text not null,
  text text not null,
  likes integer default 0,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for comments
alter table public.comments enable row level security;

create policy "Allow anyone to view comments" on public.comments
  for select using (true);

create policy "Allow signed-in users to comment" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Allow users to delete or edit comments" on public.comments
  for all using (auth.uid() = user_id);
