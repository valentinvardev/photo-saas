-- Community chat: RLS + Realtime on public."Message".
-- Writes go through tRPC (Prisma/postgres role, bypasses RLS). RLS here gates
-- the Supabase Realtime subscription, which runs as the signed-in user.

alter table public."Message" enable row level security;

drop policy if exists "messages_select_authenticated" on public."Message";
create policy "messages_select_authenticated" on public."Message"
  for select to authenticated using (true);

drop policy if exists "messages_insert_own" on public."Message";
create policy "messages_insert_own" on public."Message"
  for insert to authenticated with check ("userId" = auth.uid()::text);

-- Broadcast INSERTs over Realtime (idempotent — ignore if already added).
do $$
begin
  alter publication supabase_realtime add table public."Message";
exception when duplicate_object then null;
end $$;
