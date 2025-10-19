import { useState, useEffect } from 'react';
import axios from 'axios';
import { ComplaintForm } from '../components/complaints/ComplaintForm';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { Plus, Filter } from 'lucide-react';

export function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch profile from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('user_email');
    if (userId && userName && userEmail) {
      setProfile({ id: userId, name: userName, email: userEmail });
    }
  }, []);

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    if (!profile) return;
    setLoading(true);

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await axios.get(
        `http://localhost:8080/complaints/track/${profile.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setComplaints(response.data);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      setComplaints([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, [profile]);

  const handleComplete = async (complaintId) => {
    const confirmed = window.confirm('Are you sure the complaint is resolved?');
    if (!confirmed) return;

    const accessToken = localStorage.getItem('access_token');
    try {
      await axios.put(
        `http://localhost:8080/complaints/update-status/${complaintId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      fetchComplaints(); // Refresh the list after marking as completed
    } catch (err) {
      console.error('Failed to update complaint status:', err);
      alert('Failed to mark complaint as completed.');
    }
  };

  const filteredComplaints = complaints.filter((complaint) =>
    filterStatus === 'all' ? true : complaint.status === filterStatus
  );

  const stats = {
    total: complaints.length,
    submitted: complaints.filter((c) => c.status === 'Submitted').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Complaint
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Complaints</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
          <div className="text-2xl font-bold text-yellow-600">{stats.submitted}</div>
          <div className="text-sm text-gray-600">Submitted</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-400">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-400">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
      </div>

      {showForm && (
        <ComplaintForm
          onSuccess={() => {
            setShowForm(false);
            fetchComplaints();
          }}
        />
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {filterStatus === 'all'
                ? 'No complaints yet. Submit your first complaint using the button above.'
                : `No complaints with status "${filterStatus}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id}>
                <ComplaintCard complaint={complaint} />
                {complaint.status !== 'Resolved' && (
                  <button
                    onClick={() => handleComplete(complaint.id)}
                    className="mt-2 w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
