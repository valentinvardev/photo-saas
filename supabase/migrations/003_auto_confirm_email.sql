-- MVP: auto-confirm every new auth user at the DB level, so signup works
-- without the email-confirmation step (Supabase's built-in mailer is
-- rate-limited and unreliable). Runs BEFORE INSERT on auth.users and stamps
-- email_confirmed_at, which is what GoTrue checks at login.
--
-- For production: drop this trigger and configure a real SMTP provider +
-- re-enable email confirmation in Authentication settings.

create or replace function public.auto_confirm_email()
returns trigger
language plpgsql
security definer set search_path = auth
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists auto_confirm_email_trigger on auth.users;

create trigger auto_confirm_email_trigger
  before insert on auth.users
  for each row execute procedure public.auto_confirm_email();
