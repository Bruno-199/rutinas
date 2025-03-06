/*
  # Añadir historial de entrenamientos

  1. Nueva Tabla
    - `workout_history`
      - `id` (uuid, clave primaria)
      - `user_id` (uuid, referencia a profiles)
      - `routine_id` (uuid, referencia a routines)
      - `exercise_id` (uuid, referencia a exercises)
      - `completed_sets` (integer)
      - `completed_reps` (integer)
      - `weight_used` (integer, opcional)
      - `duration` (integer, opcional)
      - `notes` (text, opcional)
      - `completed_at` (timestamptz)
  2. Seguridad
    - Habilitar RLS en la tabla `workout_history`
    - Añadir políticas para que los usuarios puedan ver y gestionar su propio historial
*/

CREATE TABLE IF NOT EXISTS workout_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  completed_sets INTEGER NOT NULL,
  completed_reps INTEGER NOT NULL,
  weight_used INTEGER,
  duration INTEGER,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;

-- Crear políticas para workout_history
CREATE POLICY "Los usuarios pueden ver su propio historial de entrenamientos"
  ON workout_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear registros en su historial de entrenamientos"
  ON workout_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su historial de entrenamientos"
  ON workout_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar registros de su historial de entrenamientos"
  ON workout_history
  FOR DELETE
  USING (auth.uid() = user_id);