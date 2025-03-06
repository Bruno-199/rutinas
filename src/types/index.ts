export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
  duration?: number | null;
  notes?: string | null;
  created_at?: string;
  routine_id?: string;
}

export interface Routine {
  id: string;
  name: string;
  description?: string | null;
  exercises: Exercise[];
  created_at: string;
  user_id?: string;
}