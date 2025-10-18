import React, { useState, useEffect } from 'react';
import { User, Home, Mail, Save, Edit2 } from 'lucide-react';
import axios from 'axios';

export function ProfilePage() {
  const storedRoles = JSON.parse(localStorage.getItem('user_roles') || '[]');
  const isStudent = storedRoles.includes('STUDENT');

  const initialProfile = {
    full_name: localStorage.getItem('user_name') || '',
    email: localStorage.getItem('user_email') || '',
    role: isStudent ? 'student' : 'staff',
    room_number: isStudent ? localStorage.getItem('user_roomno') || 'A-101' : null,
  };

  const [fullName, setFullName] = useState(initialProfile.full_name);
  const [roomNumber, setRoomNumber] = useState(initialProfile.room_number || '');
  const [editingFullName, setEditingFullName] = useState(false);
  const [editingRoomNumber, setEditingRoomNumber] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // no need to reset states inside useEffect now

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    const accessToken = localStorage.getItem('access_token');

    const payload = {
      name: fullName.trim(),
      email: initialProfile.email,
      roomno: initialProfile.role === 'student' ? roomNumber.trim() : null,
      roles: [initialProfile.role.toUpperCase()]
    };
    
    try {
      const response = await axios.post(
        'http://localhost:8080/api/profile/update',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, 
          },
        }
      );
    
      // ✅ Update local storage on success
      localStorage.setItem('user_name', fullName.trim());
      if (initialProfile.role === 'student') {
        localStorage.setItem('user_roomno', roomNumber.trim());
      }
    
      

      setSuccess(true);
      setEditingFullName(false);
      setEditingRoomNumber(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">Profile updated successfully!</p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role (cannot edit) */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                <span className="capitalize font-medium text-gray-900">
                  {initialProfile.role}
                </span>
              </div>
            </div>
          </div>

          {/* Email (cannot edit) */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={initialProfile.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!editingFullName}
                  required
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>
            <Edit2
              className="ml-3 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setEditingFullName(true)}
            />
          </div>

          {/* Room Number (students only) */}
          {isStudent && (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    disabled={!editingRoomNumber}
                    placeholder="A-101"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
              <Edit2
                className="ml-3 w-5 h-5 text-gray-500 cursor-pointer"
                onClick={() => setEditingRoomNumber(true)}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
