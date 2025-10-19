import { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import axios from 'axios';

const CATEGORIES = ['Electrical', 'Plumbing', 'Cleaning', 'Maintenance', 'Furniture', 'Internet', 'Other'];

// Generate 1-hour slots from 12 AM to 12 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const meridian = i < 12 ? 'AM' : 'PM';
    const nextHour = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
    const nextMeridian = i + 1 < 12 ? 'AM' : 'PM';
    slots.push(`${hour}:00 ${meridian} - ${nextHour}:00 ${nextMeridian}`);
  }
  return slots;
};

export function ComplaintForm({ onSuccess }) {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const userId = localStorage.getItem('user_id');
  const userName = localStorage.getItem('user_name');
  const userEmail = localStorage.getItem('user_email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!userId) {
      setError('You must be logged in to submit a complaint.');
      setLoading(false);
      return;
    }

    if (!date || !time) {
      setError('Please select a date and time slot.');
      setLoading(false);
      return;
    }

    // Combine date + time into one string for backend
    const timeSlot = `${date} ${time}`;

    try {
      const payload = {
        category,
        title,
        description,
        timeSlot,
        studentId: parseInt(userId),
      };

      const accessToken = localStorage.getItem('access_token');

const response = await axios.post(
  'http://localhost:8080/complaints/submit',
  payload,
  {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  }
);


      setSuccess(true);
      setCategory('');
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');

      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit complaint. Please try again.');
    }

    setLoading(false);
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Complaint</h2>

      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600">Complaint submitted successfully!</div>}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={userName || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={userEmail || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Select a category</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Brief title of the issue" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Provide detailed information..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        </div>

        {/* Date + Time Slot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
            <select value={time} onChange={(e) => setTime(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select time slot</option>
              {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <Send className="w-5 h-5" /> {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
