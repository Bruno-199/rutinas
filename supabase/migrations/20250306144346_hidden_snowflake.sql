/*
  # Fix profiles table policies

  1. Changes
    - Add policies for profiles table to allow proper authentication flow
    - Enable RLS on profiles table
    - Add policy for public access during signup
    - Add policy for authenticated users to read their own profile

  2. Security
    - Enable RLS on profiles table
    - Add policy for public signup
    - Add policy for authenticated users
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public access for signup
CREATE POLICY "Allow public signup access" ON profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);