create extension if not exists vector;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.boxes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, room_id, name)
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  room_id uuid references public.rooms(id) on delete set null,
  box_id uuid references public.boxes(id) on delete set null,
  name text not null,
  description text not null default '',
  qty text not null default '1',
  unit text not null default '',
  status text not null default 'In Stock',
  source text not null default 'web',
  embedding vector(384),
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rooms_user_id_idx on public.rooms(user_id);
create index if not exists boxes_user_id_idx on public.boxes(user_id);
create index if not exists boxes_room_id_idx on public.boxes(room_id);
create index if not exists items_user_id_idx on public.items(user_id);
create index if not exists items_room_id_idx on public.items(room_id);
create index if not exists items_box_id_idx on public.items(box_id);
create index if not exists items_embedding_hnsw_idx on public.items using hnsw (embedding vector_cosine_ops);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_rooms_updated_at on public.rooms;
create trigger set_rooms_updated_at
before update on public.rooms
for each row execute function public.set_updated_at();

drop trigger if exists set_boxes_updated_at on public.boxes;
create trigger set_boxes_updated_at
before update on public.boxes
for each row execute function public.set_updated_at();

drop trigger if exists set_items_updated_at on public.items;
create trigger set_items_updated_at
before update on public.items
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.boxes enable row level security;
alter table public.items enable row level security;

drop policy if exists "Profiles are owned by users" on public.profiles;
create policy "Profiles are owned by users"
on public.profiles
for all
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Rooms are owned by users" on public.rooms;
create policy "Rooms are owned by users"
on public.rooms
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Boxes are owned by users" on public.boxes;
create policy "Boxes are owned by users"
on public.boxes
for all
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.rooms
    where rooms.id = boxes.room_id
      and rooms.user_id = auth.uid()
  )
);

drop policy if exists "Items are owned by users" on public.items;
create policy "Items are owned by users"
on public.items
for all
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and (
    room_id is null
    or exists (
      select 1 from public.rooms
      where rooms.id = items.room_id
        and rooms.user_id = auth.uid()
    )
  )
  and (
    box_id is null
    or exists (
      select 1 from public.boxes
      where boxes.id = items.box_id
        and boxes.user_id = auth.uid()
    )
  )
);

create or replace function public.match_items(
  query_embedding vector(384),
  match_count int default 20,
  min_similarity float default 0.25
)
returns table (
  id uuid,
  name text,
  description text,
  qty text,
  unit text,
  status text,
  source text,
  added_at timestamptz,
  updated_at timestamptz,
  room_id uuid,
  box_id uuid,
  room_name text,
  box_name text,
  embedding vector(384),
  score float
)
language sql
stable
security invoker
as $$
  select
    i.id,
    i.name,
    i.description,
    i.qty,
    i.unit,
    i.status,
    i.source,
    i.added_at,
    i.updated_at,
    i.room_id,
    i.box_id,
    r.name as room_name,
    b.name as box_name,
    i.embedding,
    1 - (i.embedding <=> query_embedding) as score
  from public.items i
  left join public.rooms r on r.id = i.room_id
  left join public.boxes b on b.id = i.box_id
  where i.user_id = auth.uid()
    and i.embedding is not null
    and 1 - (i.embedding <=> query_embedding) >= min_similarity
  order by i.embedding <=> query_embedding
  limit match_count;
$$;
