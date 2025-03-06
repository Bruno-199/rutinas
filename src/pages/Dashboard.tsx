import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Routine } from '../types';
import Navbar from '../components/Navbar';
import { Calendar, Clock, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDescription, setNewRoutineDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRoutines();
    }
  }, [user]);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setRoutines(data as Routine[]);
      }
    } catch (error) {
      console.error('Error al cargar rutinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoutine = async () => {
    if (!newRoutineName.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('routines')
        .insert([
          {
            user_id: user.id,
            name: newRoutineName,
            description: newRoutineDescription || null
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Add the new routine to the state with empty exercises array
        const newRoutine: Routine = {
          ...data,
          exercises: []
        };
        
        setRoutines([newRoutine, ...routines]);
      }
      
      setNewRoutineName('');
      setNewRoutineDescription('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error al añadir rutina:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis Rutinas de Ejercicio</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            Añadir Rutina
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : routines.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Aún no tienes rutinas. ¡Crea tu primera rutina!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <Link
                to={`/routines/${routine.id}`}
                key={routine.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{routine.name}</h2>
                  {routine.description && (
                    <p className="text-gray-600 mb-4">{routine.description}</p>
                  )}
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(routine.created_at)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{routine.exercises.length} ejercicios</span>
                  </div>
                </div>
                <div className="bg-blue-50 px-6 py-3">
                  <span className="text-blue-600 font-medium">Ver Detalles</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal para Añadir Rutina */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Añadir Nueva Rutina</h2>
            
            <div className="mb-4">
              <label htmlFor="routineName" className="block text-gray-700 font-medium mb-2">
                Nombre de la Rutina
              </label>
              <input
                type="text"
                id="routineName"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej., Entrenamiento de Pecho"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="routineDescription" className="block text-gray-700 font-medium mb-2">
                Descripción (opcional)
              </label>
              <textarea
                id="routineDescription"
                value={newRoutineDescription}
                onChange={(e) => setNewRoutineDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tu rutina"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddRoutine}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Añadir Rutina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;