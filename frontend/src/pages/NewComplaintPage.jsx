import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplaintForm } from '../components/complaints/ComplaintForm';
import { ArrowLeft } from 'lucide-react';

export function NewComplaintPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      {/* Complaint Form */}
      <ComplaintForm onSuccess={() => navigate('/dashboard')} />
    </div>
  );
}
