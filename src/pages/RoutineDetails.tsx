import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Routine, Exercise } from '../types';
import Navbar from '../components/Navbar';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const RoutineDetails = () => {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state for adding/editing exercise
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState(3);
  const [exerciseReps, setExerciseReps] = useState(10);
  const [exerciseWeight, setExerciseWeight] = useState<number | undefined>(undefined);
  const [exerciseDuration, setExerciseDuration] = useState<number | undefined>(undefined);
  const [exerciseNotes, setExerciseNotes] = useState('');

  useEffect(() => {
    if (routineId && user) {
      fetchRoutineDetails();
    }
  }, [routineId, user]);

  const fetchRoutineDetails = async () => {
    try {
      setLoading(true);
      
      if (!routineId || !user) return;

      const { data, error } = await supabase
        .from('routines')
        .select(`
          id,
          name,
          description,
          created_at,
          exercises (
            id,
            name,
            sets,
            reps,
            weight,
            duration,
            notes
          )
        `)
        .eq('id', routineId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error al cargar rutina:', error);
        navigate('/');
        return;
      }

      if (data) {
        setRoutine(data as Routine);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error al cargar detalles de la rutina:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const resetExerciseForm = () => {
    setExerciseName('');
    setExerciseSets(3);
    setExerciseReps(10);
    setExerciseWeight(undefined);
    setExerciseDuration(undefined);
    setExerciseNotes('');
    setEditingExerciseId(null);
  };

  const handleAddExercise = async () => {
    if (!routine || !exerciseName.trim() || !routineId) return;
    
    try {
      const newExercise = {
        routine_id: routineId,
        name: exerciseName,
        sets: exerciseSets,
        reps: exerciseReps,
        weight: exerciseWeight || null,
        duration: exerciseDuration || null,
        notes: exerciseNotes || null
      };
      
      const { data, error } = await supabase
        .from('exercises')
        .insert([newExercise])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data && routine) {
        const updatedRoutine = {
          ...routine,
          exercises: [...routine.exercises, data as Exercise]
        };
        
        setRoutine(updatedRoutine);
      }
      
      resetExerciseForm();
      setShowAddExerciseModal(false);
    } catch (error) {
      console.error('Error al añadir ejercicio:', error);
    }
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id);
    setExerciseName(exercise.name);
    setExerciseSets(exercise.sets);
    setExerciseReps(exercise.reps);
    setExerciseWeight(exercise.weight || undefined);
    setExerciseDuration(exercise.duration || undefined);
    setExerciseNotes(exercise.notes || '');
    setShowAddExerciseModal(true);
  };

  const handleSaveEditedExercise = async () => {
    if (!routine || !exerciseName.trim() || !editingExerciseId) return;
    
    try {
      const updatedExercise = {
        name: exerciseName,
        sets: exerciseSets,
        reps: exerciseReps,
        weight: exerciseWeight || null,
        duration: exerciseDuration || null,
        notes: exerciseNotes || null
      };
      
      const { data, error } = await supabase
        .from('exercises')
        .update(updatedExercise)
        .eq('id', editingExerciseId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data && routine) {
        const updatedExercises = routine.exercises.map(ex => 
          ex.id === editingExerciseId ? data as Exercise : ex
        );
        
        const updatedRoutine = {
          ...routine,
          exercises: updatedExercises
        };
        
        setRoutine(updatedRoutine);
      }
      
      resetExerciseForm();
      setShowAddExerciseModal(false);
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!routine) return;
    
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);
      
      if (error) {
        throw error;
      }
      
      const updatedExercises = routine.exercises.filter(ex => ex.id !== exerciseId);
      
      const updatedRoutine = {
        ...routine,
        exercises: updatedExercises
      };
      
      setRoutine(updatedRoutine);
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Rutina no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-blue-500 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver a Rutinas
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{routine.name}</h1>
          {routine.description && (
            <p className="text-gray-600 mb-4">{routine.description}</p>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Ejercicios</h2>
          <button
            onClick={() => {
              resetExerciseForm();
              setShowAddExerciseModal(true);
            }}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            Añadir Ejercicio
          </button>
        </div>
        
        {routine.exercises.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Aún no hay ejercicios añadidos a esta rutina.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ejercicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Series
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Repeticiones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peso/Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routine.exercises.map((exercise) => (
                  <tr key={exercise.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{exercise.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {exercise.sets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {exercise.reps}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {exercise.weight ? `${exercise.weight} kg` : ''}
                      {exercise.duration ? `${exercise.duration} seg` : ''}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="max-w-xs truncate">{exercise.notes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditExercise(exercise)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal para Añadir/Editar Ejercicio */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingExerciseId ? 'Editar Ejercicio' : 'Añadir Nuevo Ejercicio'}
              </h2>
              <button
                onClick={() => {
                  resetExerciseForm();
                  setShowAddExerciseModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="exerciseName" className="block text-gray-700 font-medium mb-2">
                Nombre del Ejercicio
              </label>
              <input
                type="text"
                id="exerciseName"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej., Press de Banca"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="exerciseSets" className="block text-gray-700 font-medium mb-2">
                  Series
                </label>
                <input
                  type="number"
                  id="exerciseSets"
                  value={exerciseSets}
                  onChange={(e) => setExerciseSets(parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="exerciseReps" className="block text-gray-700 font-medium mb-2">
                  Repeticiones
                </label>
                <input
                  type="number"
                  id="exerciseReps"
                  value={exerciseReps}
                  onChange={(e) => setExerciseReps(parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="exerciseWeight" className="block text-gray-700 font-medium mb-2">
                  Peso (kg, opcional)
                </label>
                <input
                  type="number"
                  id="exerciseWeight"
                  value={exerciseWeight === undefined ? '' : exerciseWeight}
                  onChange={(e) => setExerciseWeight(e.target.value ? parseInt(e.target.value) : undefined)}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="exerciseDuration" className="block text-gray-700 font-medium mb-2">
                  Duración (seg, opcional)
                </label>
                <input
                  type="number"
                  id="exerciseDuration"
                  value={exerciseDuration === undefined ? '' : exerciseDuration}
                  onChange={(e) => setExerciseDuration(e.target.value ? parseInt(e.target.value) : undefined)}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="exerciseNotes" className="block text-gray-700 font-medium mb-2">
                Notas (opcional)
              </label>
              <textarea
                id="exerciseNotes"
                value={exerciseNotes}
                onChange={(e) => setExerciseNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Añade cualquier nota o instrucción"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  resetExerciseForm();
                  setShowAddExerciseModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingExerciseId ? handleSaveEditedExercise : handleAddExercise}
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                <Save className="h-5 w-5 mr-1" />
                {editingExerciseId ? 'Guardar Cambios' : 'Añadir Ejercicio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineDetails;