export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          created_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
        }
      }
      routines: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          routine_id: string
          name: string
          sets: number
          reps: number
          weight: number | null
          duration: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          routine_id: string
          name: string
          sets: number
          reps: number
          weight?: number | null
          duration?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          routine_id?: string
          name?: string
          sets?: number
          reps?: number
          weight?: number | null
          duration?: number | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}