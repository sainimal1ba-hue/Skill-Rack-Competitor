# Supabase Setup Guide for Antigravity-Style App

To fully deploy this application with a working backend, you need to set up a free Supabase project.

## 1. Create a Supabase Project
1.  Go to [database.new](https://database.new) and sign in with GitHub.
2.  Click **"New Project"**.
3.  Enter a Name (e.g., `SkillRackCompetitor`).
4.  Enter a Database Password (save this password!).
5.  Choose a Region close to you.
6.  Click **"Create new project"**.

## 2. Get API Keys
Once the project is created (it takes a minute):
1.  Go to **Project Settings** (cog icon at the bottom of the left sidebar).
2.  Click on **API**.
3.  Find the `Project URL` and `anon` / `public` Key.
4.  **Create a file named `.env` in the root of your project folder** (same level as `package.json`).
5.  Paste the content below into `.env`, replacing the values with yours:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Database Setup (SQL Editor)
1.  In Supabase, go to the **SQL Editor** (terminal icon on the left).
2.  Click **"New Query"**.
3.  Paste the following SQL to create the necessary tables and policies:

```sql
-- Create table for chapters (needed for question organization)
create table chapters (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  branch_id text -- For now text, assuming refactor later or keeping simple
);

-- Creates a table for questions
create table questions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  input_format text,
  output_format text,
  sample_input text,
  sample_output text,
  chapter_id text, -- Should ideally reference chapters(id) if UUID, but keeping loose for migration ease
  complexity text default 'Medium',
  test_cases jsonb, -- Array of {input, expectedOutput}
  total_submissions integer default 0,
  total_accepted integer default 0,
  acceptance_rate decimal default 0.0
);

-- Index for searching and filtering
create index questions_complexity_idx on questions(complexity);
create index questions_chapter_id_idx on questions(chapter_id);
-- create index questions_title_search_idx on questions using gin(to_tsvector('english', title)); -- Optional: Full text search

-- RPC Function to atomically increment stats
create or replace function increment_question_stats(q_id uuid, is_accepted boolean)
returns void as $$
begin
  update questions
  set 
    total_submissions = total_submissions + 1,
    total_accepted = total_accepted + (case when is_accepted then 1 else 0 end),
    acceptance_rate = (total_accepted + (case when is_accepted then 1 else 0 end))::decimal / (total_submissions + 1) * 100
  where id = q_id;
end;
$$ language plpgsql;

-- Creates a table for submissions
create table submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  question_id uuid references questions(id) not null,
  contest_id text,
  code text,
  language text,
  verdict text
);

-- Enable Row Level Security (RLS)
alter table chapters enable row level security;
alter table questions enable row level security;
alter table submissions enable row level security;

-- Policy: Everyone can read chapters
create policy "Public chapters are viewable by everyone"
  on chapters for select
  using ( true );

-- Policy: Everyone can read questions
create policy "Public questions are viewable by everyone"
  on questions for select
  using ( true );

-- Policy: Authenticated users can modify questions/chapters (Demo Admin Policy)
create policy "Authenticated users can modify questions"
  on questions for all
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can modify chapters"
  on chapters for all
  using ( auth.role() = 'authenticated' );

-- Policy: Users can view their own submissions
create policy "Users can view own submissions"
  on submissions for select
  using ( auth.uid() = user_id );

-- Policy: Users can insert their own submissions
create policy "Users can insert own submissions"
  on submissions for insert
  with check ( auth.uid() = user_id );

-- INSERT DEFAULT DATA (Optional)
insert into chapters (name, description, branch_id) values 
('Arrays', 'Basic array manipulation problems', 'b1'),
('Strings', 'String processing challenges', 'b1');

```

4.  Click **"Run"** in the bottom right.

## 4. Authentication Config
1.  Go to **Authentication** -> **Providers** in the sidebar.
2.  Ensure **Email** is enabled.
3.  (Optional) Disable "Confirm email" if you want to login immediately without email verification during development.
    - Go to **Authentication** -> **URL Configuration**.
    - Set "Site URL" to `http://localhost:5173` (or your production URL).

## 5. Deployment
Connect your GitHub repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the deployment platform's Environment Variables settings.

## 6. Migration (If you already have tables)

If you see an error like `policy ... already exists`, it means your database is already set up. Run this script instead to update it with Level 2 features:

```sql
-- Safe migration to add new columns if they don't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'questions' and column_name = 'test_cases') then
        alter table questions add column test_cases jsonb;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'questions' and column_name = 'total_submissions') then
        alter table questions add column total_submissions integer default 0;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'questions' and column_name = 'total_accepted') then
        alter table questions add column total_accepted integer default 0;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'questions' and column_name = 'acceptance_rate') then
        alter table questions add column acceptance_rate decimal default 0.0;
    end if;
end $$;

-- Indexes (Ignore if exists)
create index if not exists questions_complexity_idx on questions(complexity);
create index if not exists questions_chapter_id_idx on questions(chapter_id);

-- RPC Function to atomically increment stats
create or replace function increment_question_stats(q_id uuid, is_accepted boolean)
returns void as $$
begin
  update questions
  set 
    total_submissions = total_submissions + 1,
    total_accepted = total_accepted + (case when is_accepted then 1 else 0 end),
    acceptance_rate = (total_accepted + (case when is_accepted then 1 else 0 end))::decimal / (total_submissions + 1) * 100
  where id = q_id;
end;
$$ language plpgsql;
```
