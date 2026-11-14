-- LUNAR COMMAND: one cloud mission per authenticated Supabase user
create table if not exists public.user_missions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_missions enable row level security;

drop policy if exists "Users can read their own mission" on public.user_missions;
create policy "Users can read their own mission"
on public.user_missions for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own mission" on public.user_missions;
create policy "Users can insert their own mission"
on public.user_missions for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own mission" on public.user_missions;
create policy "Users can update their own mission"
on public.user_missions for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
