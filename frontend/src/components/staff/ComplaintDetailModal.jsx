import React, { useState, useEffect } from 'react';
import { X, User, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const STATUS_OPTIONS = ['Submitted', 'In Progress', 'Resolved', 'Closed'];

export function ComplaintDetailModal({ complaint, onClose, onUpdate, currentUserId }) {
  const [status, setStatus] = useState(complaint.status);
  const [comment, setComment] = useState('');
  const [assignedTo, setAssignedTo] = useState(complaint.assigned_to || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchStudentProfile();
    fetchStaffMembers();
    fetchHistory();
  }, []);

  const fetchStudentProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', complaint.student_id)
      .maybeSingle();

    if (data) setStudentProfile(data);
  };

  const fetchStaffMembers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'staff')
      .order('full_name');

    if (data) setStaffMembers(data);
  };

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('complaint_history')
      .select('*')
      .eq('complaint_id', complaint.id)
      .order('created_at', { ascending: false });

    if (data) setHistory(data);
  };

  const handleUpdate = async () => {
    setError('');
    setLoading(true);

    const updates = { status, assigned_to: assignedTo || null };

    const { error: updateError } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', complaint.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      if (comment.trim()) {
        await supabase.from('complaint_history').insert({
          complaint_id: complaint.id,
          changed_by: currentUserId,
          old_status: complaint.status,
          new_status: status,
          comment: comment.trim(),
        });
      }
      onUpdate();
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">{complaint.category}</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">Priority: {complaint.priority}</span>
            </div>
            <p className="text-gray-700">{complaint.description}</p>
          </div>

          {studentProfile && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Student Information</h4>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <p>Name: {studentProfile.full_name}</p>
                <p>Email: {studentProfile.email}</p>
                <p>Room: {complaint.room_number}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Assign to Staff Member</label>
              <select
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id}>{staff.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Optional comment about this update..."
              />
            </div>
          </div>

          {history.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                History
              </h4>
              <div className="space-y-3">
                {history.map((entry) => (
                  <div key={entry.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {entry.old_status || 'Created'} → {entry.new_status}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(entry.created_at).toLocaleString()}</span>
                    </div>
                    {entry.comment && <p className="text-gray-700">{entry.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-4">
            <span>Created: {new Date(complaint.created_at).toLocaleString()}</span>
            <span>Updated: {new Date(complaint.updated_at).toLocaleString()}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Complaint'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
