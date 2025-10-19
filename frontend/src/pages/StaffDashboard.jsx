import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { Filter, Search } from 'lucide-react';

export function StaffDashboard() {
  const [profile, setProfile] = useState(null);
  const [unassignedComplaints, setUnassignedComplaints] = useState([]);
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewFilter, setViewFilter] = useState('unassigned'); // unassigned / assigned

  // Fetch profile from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('user_email');
    if (userId && userName && userEmail) {
      setProfile({ id: userId, name: userName, email: userEmail });
    }
  }, []);

  // Fetch complaints
  const fetchComplaints = async () => {
    if (!profile) return;
    setLoading(true);
    const accessToken = localStorage.getItem('access_token');

    try {
      // Fetch unassigned complaints
      const unassignedResp = await axios.get(
        `http://localhost:8080/complaints/all-unassigned`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUnassignedComplaints(unassignedResp.data);

      // Fetch assigned complaints
      const assignedResp = await axios.get(
        `http://localhost:8080/complaints/getassigned/${profile.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setAssignedComplaints(assignedResp.data);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      setUnassignedComplaints([]);
      setAssignedComplaints([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, [profile]);

  // Take up a complaint
  const takeComplaint = async (complaintId) => {
    const accessToken = localStorage.getItem('access_token');
    try {
      await axios.put(
        `http://localhost:8080/complaints/assign-staff/${complaintId}?staffId=${profile.id}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchComplaints();
    } catch (err) {
      console.error('Failed to take complaint:', err);
    }
  };

  // Decide which array to display
  const complaintsToDisplay =
    viewFilter === 'unassigned' ? unassignedComplaints : assignedComplaints;

  // Filter by status and search
  const filteredComplaints = complaintsToDisplay.filter((complaint) => {
    const matchesStatus = filterStatus === 'all' ? true : complaint.status === filterStatus;
    const matchesSearch =
      searchQuery === ''
        ? true
        : complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats based on assigned complaints only
  const stats = {
    total: assignedComplaints.length,
    inProgress: assignedComplaints.filter((c) => c.status === 'In Progress').length,
    resolved: assignedComplaints.filter((c) => c.status === 'Resolved').length,
    submitted: assignedComplaints.filter((c) => c.status === 'Submitted').length,
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Assigned</div>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaints..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <select
          value={viewFilter}
          onChange={(e) => setViewFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-1/3"
        >
          <option value="unassigned">Unassigned Complaints</option>
          <option value="assigned">Assigned to Me</option>
        </select>
      </div>

      {/* Complaint List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No complaints found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id}>
              <ComplaintCard complaint={complaint} />
              {viewFilter === 'unassigned' && !complaint.staffId && (
                <button
                  onClick={() => takeComplaint(complaint.id)}
                  className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Take Up
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
