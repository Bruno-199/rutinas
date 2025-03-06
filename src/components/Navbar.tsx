import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dumbbell, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Dumbbell className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">Rutinas de Ejercicio</span>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <User className="h-5 w-5 text-gray-500" />
                <span className="ml-2 text-gray-700">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-1">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;