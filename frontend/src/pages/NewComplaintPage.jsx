import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplaintForm } from '../components/complaints/ComplaintForm';
import { ArrowLeft } from 'lucide-react';

export function NewComplaintPage() {
  const navigate = useNavigate();

  // Get role from localStorage (or you can get it from context if available)
  const role = localStorage.getItem('user_role'); // e.g., 'student' or 'staff'

  const handleBack = () => {
    if (role === 'staff') {
      navigate('/staff');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSuccess = () => {
    if (role === 'staff') {
      navigate('/staff');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      {/* Complaint Form */}
      <ComplaintForm onSuccess={handleSuccess} />
    </div>
  );
}
