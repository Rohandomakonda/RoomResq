import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, LogOut, User, Home, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function Navbar() {
  const navigate = useNavigate();
  const storedRoles = localStorage.getItem('user_roles');
  const role = storedRoles ? JSON.parse(storedRoles) : [];
  
  
  const profile = {
    full_name: localStorage.getItem('user_name'),
    email: localStorage.getItem('user_email'),
    role,
  };
  const location = useLocation();  
  

  const isActive = (path) => location.pathname === path;
  const handleLogout = () => {
    // 1️⃣ Clear all stored data
    localStorage.clear();
    console.log("loggin out");
    // 2️⃣ Redirect to root route
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RoomResQ</span>
          </Link>

          {profile && (
            <div className="flex items-center gap-4">
              <Link
                to={profile.role.includes('STUDENT') ? '/dashboard' : '/staff'}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive(profile.role === 'student' ? '/dashboard' : '/staff')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {profile.role === 'student' && (
                <Link
                  to="/complaints/new"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isActive('/complaints/new')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">New Complaint</span>
                </Link>
              )}

              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive('/profile')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{profile.full_name}</span>
              </Link>

              <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
