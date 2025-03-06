/*
  # Initial Schema for Workout Routine App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, not null)
      - `created_at` (timestamp with time zone, default now())
    - `routines`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `name` (text, not null)
      - `description` (text)
      - `created_at` (timestamp with time zone, default now())
    - `exercises`
      - `id` (uuid, primary key)
      - `routine_id` (uuid, references routines.id)
      - `name` (text, not null)
      - `sets` (integer, not null)
      - `reps` (integer, not null)
      - `weight` (integer)
      - `duration` (integer)
      - `notes` (text)
      - `created_at` (timestamp with time zone, default now())
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table that extends the auth.users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create routines table
CREATE TABLE IF NOT EXISTS routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight INTEGER,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for routines
CREATE POLICY "Users can view their own routines"
  ON routines
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own routines"
  ON routines
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines"
  ON routines
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines"
  ON routines
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for exercises
CREATE POLICY "Users can view exercises in their routines"
  ON exercises
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM routines WHERE id = routine_id
    )
  );

CREATE POLICY "Users can create exercises in their routines"
  ON exercises
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM routines WHERE id = routine_id
    )
  );

CREATE POLICY "Users can update exercises in their routines"
  ON exercises
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM routines WHERE id = routine_id
    )
  );

CREATE POLICY "Users can delete exercises in their routines"
  ON exercises
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM routines WHERE id = routine_id
    )
  );

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();