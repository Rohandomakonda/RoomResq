import React from 'react';
 import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import { AuthProvider, useAuth } from './contexts/AuthContext'; 
  import { Layout } from './components/layout/Layout'; 
  import { ProtectedRoute } from './components/ProtectedRoute'; 
  import { AuthPage } from './pages/AuthPage'; 
  import { StudentDashboard } from './pages/StudentDashboard'; 
  import { StaffDashboard } from './pages/StaffDashboard'; 
  import { ProfilePage } from './pages/ProfilePage'; 
  import { NewComplaintPage } from './pages/NewComplaintPage';
  import { Navbar } from './components/layout/Navbar';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Authentication Route */}
      <Route
        path="/"
        element={
          
            <AuthPage />
          
        }
      />
      <Route path="/profile" 
      element={
        <Layout>
         <ProfilePage />
        </Layout>
          } />

      {/* Default Redirect */}
     

      {/* Student Dashboard */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <StudentDashboard />
          </Layout>
        }
      />

      {/* Staff Dashboard */}
      <Route
        path="/staff"
        element={
          <Layout>
            <StaffDashboard />
          </Layout>
        }
      />

      {/* New Complaint Page */}
      <Route
        path="/complaints/new"
        element={
          <Layout>
            <NewComplaintPage />
          </Layout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
