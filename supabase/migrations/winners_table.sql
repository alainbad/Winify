-- Winners table
create table if not exists winners (
  id uuid primary key default gen_random_uuid(),
  pool_id integer not null,
  entry_id uuid not null references entries(id),
  user_id uuid not null,
  winner_name text,
  winner_email text,
  random_index integer,
  total_entries integer,
  drawn_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Only admins (service role) can insert/update/delete
alter table winners enable row level security;

create policy "Anyone can read winners"
  on winners for select using (true);

create policy "Service role only for insert"
  on winners for insert with check (false);
