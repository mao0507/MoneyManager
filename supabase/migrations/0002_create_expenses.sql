-- Ticket #25: expenses table + RLS
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.

-- 讓 expenses.subscription_id 可以用 (user_id, id) 複合外鍵限定同一個 owner，
-- 單欄 FK 會繞過 RLS，讓 user A 引用到 user B 的訂閱列（存在性 oracle）
alter table public.subscriptions
  add constraint subscriptions_user_id_id_key unique (user_id, id);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  amount numeric not null check (amount >= 0),
  category text not null,
  date date not null,
  payment_method text not null,
  tags text[],
  receipt text,
  subscription_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (user_id, subscription_id)
    references public.subscriptions (user_id, id) on delete set null
);

create index if not exists expenses_user_id_date_idx on public.expenses (user_id, date desc);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- reuses public.set_updated_at() defined in 0001_create_subscriptions.sql
create trigger expenses_set_updated_at
  before update on public.expenses
  for each row
  execute function public.set_updated_at();
