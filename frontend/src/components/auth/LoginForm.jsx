import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleSignIn from "./GoogleLogin.jsx";
export function LoginForm({ onToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const data = res.data;

      // Save tokens and user info in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_roles', JSON.stringify(data.roles));
      localStorage.setItem('user_id', data.id);
      


      alert('Login successful!');

      // Navigate based on role
      if (data.roles.includes('STUDENT')) {
        navigate('/dashboard');
      } else if (data.roles.includes('STAFF')) {
        navigate('/staff');
      } else {
        navigate('/dashboard'); // fallback
      }

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed');
      } else {
        setError('Network error');
      }
    }

    setLoading(false);
  };

 
  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      const backendResponse = await axios.post(`http://localhost:8080/api/auth/google`, { token: response.credential });
      const data = backendResponse.data;

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_roles', JSON.stringify(data.roles));
      localStorage.setItem('user_id', data.id);
      if (data.roles.includes('STUDENT')) navigate('/dashboard');
      else if (data.roles.includes('STAFF')) navigate('/staff');
      else navigate('/dashboard');

      setSnackbarOpen(true);
      setError(false);
      setMessage("Login successful");
      
    } catch (error) {
      console.error("Google login failed:", error);
      setSnackbarOpen(true);
      setError(true);
      setMessage("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setSnackbarOpen(true);
    setError(true);
    setMessage("Google login failed");
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In to RoomResQ</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleSignIn
                  handleGoogleSuccess={handleGoogleSuccess}
                  handleGoogleError={handleGoogleError}
                />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={onToggle} className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
