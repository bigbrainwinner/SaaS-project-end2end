-- Database Schema and Row-Level Security (RLS) Setup for Kiro Content Suite

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  company text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles RLS Policies
create policy "Allow users to view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Allow users to update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Automatic Profile Creator trigger on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, company, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'company',
    coalesce(new.raw_user_meta_data->>'avatar_url', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><rect width="24" height="24" fill="%23f3f4f6"/><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z"/></svg>')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. ORDERS TABLE
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content_type text not null,
  status text not null default 'Draft',
  deadline timestamp with time zone not null,
  word_count integer not null,
  target_audience text not null,
  tone_voice text not null,
  keywords text[] default '{}'::text[] not null,
  reference_links text[] default '{}'::text[] not null,
  additional_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders RLS Policies
create policy "Allow users to manage own orders" on public.orders
  for all using (auth.uid() = user_id);


-- 3. ATTACHMENTS TABLE
create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders on delete cascade not null,
  file_name text not null,
  file_path text not null,
  file_size integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on attachments
alter table public.attachments enable row level security;

-- Attachments RLS Policies
create policy "Allow users to manage own attachments" on public.attachments
  for all using (
    exists (
      select 1 from public.orders
      where orders.id = attachments.order_id
      and orders.user_id = auth.uid()
    )
  );


-- 4. STORAGE SETUP (BUCKET & POLICIES)
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "Allow authenticated users to upload attachments" on storage.objects
  for insert with check (
    bucket_id = 'attachments'
    and auth.role() = 'authenticated'
  );

create policy "Allow users to read own attachments" on storage.objects
  for select using (
    bucket_id = 'attachments'
    and auth.role() = 'authenticated'
  );

create policy "Allow users to delete own attachments" on storage.objects
  for delete using (
    bucket_id = 'attachments'
    and auth.role() = 'authenticated'
  );


-- 5. AVATARS STORAGE SETUP (PUBLIC BUCKET & POLICIES)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Allow public read access to avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Allow authenticated users to upload avatars" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );

create policy "Allow users to update own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );

create policy "Allow users to delete own avatar" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );
