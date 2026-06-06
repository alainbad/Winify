-- 1. Pools table so the trigger knows each pool's ticket total
create table if not exists pools (
  id integer primary key,
  total integer not null
);

insert into pools (id, total) values
  (1, 10),  (2, 10),   -- MICRO
  (3, 30),  (4, 30),   -- VOLUME
  (5, 150), (6, 300)   -- MEGA
on conflict (id) do update set total = excluded.total;

-- 2. Prevent duplicate winners for the same pool
alter table winners drop constraint if exists winners_pool_id_unique;
alter table winners add constraint winners_pool_id_unique unique (pool_id);

-- 3. HTTP extension for calling the edge function from a trigger
create extension if not exists pg_net;

-- 4. Trigger function: fires after every entry insert
create or replace function trigger_draw_if_full()
returns trigger as $$
declare
  v_pool_total  integer;
  v_entry_count bigint;
begin
  -- Look up the pool's ticket limit
  select total into v_pool_total from pools where id = NEW.pool_id;
  if v_pool_total is null then return NEW; end if;

  -- Count how many entries this pool now has
  select count(*) into v_entry_count from entries where pool_id = NEW.pool_id;

  -- If full and no winner yet, call the edge function
  if v_entry_count >= v_pool_total then
    if not exists (select 1 from winners where pool_id = NEW.pool_id) then
      perform net.http_post(
        url     := 'https://dwjghqslnrkcjhaoaneq.supabase.co/functions/v1/draw-winner',
        body    := json_build_object('pool_id', NEW.pool_id)::jsonb,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amdocXNsbnJrY2poYW9hbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDM1NTgsImV4cCI6MjA5NjMxOTU1OH0.Q-q70ee0ViQpcPSTgRIe_-T6GorXrEo4uuc2dvb5UJE',
          'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amdocXNsbnJrY2poYW9hbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDM1NTgsImV4cCI6MjA5NjMxOTU1OH0.Q-q70ee0ViQpcPSTgRIe_-T6GorXrEo4uuc2dvb5UJE'
        )
      );
    end if;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- 5. Attach the trigger to the entries table
drop trigger if exists auto_draw_on_entry_full on entries;
create trigger auto_draw_on_entry_full
  after insert on entries
  for each row execute function trigger_draw_if_full();
