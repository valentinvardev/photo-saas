-- Auto-create a public.User row whenever a new Supabase auth user is created.
-- Run this once in Supabase SQL Editor (Database → SQL Editor → New query).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id, email, name, "avatarUrl", "createdAt", "updatedAt")
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop old trigger if it exists so this script is idempotent
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
