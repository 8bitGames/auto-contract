-- Create the contracts table
create table contracts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  template_id text not null,
  title text not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table contracts enable row level security;

-- Create policies
create policy "Users can select their own contracts"
  on contracts for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own contracts"
  on contracts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own contracts"
  on contracts for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own contracts"
  on contracts for delete
  using ( auth.uid() = user_id );
