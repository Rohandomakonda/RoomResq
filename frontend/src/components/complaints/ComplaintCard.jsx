import React from 'react';
import { Clock, AlertCircle, CheckCircle, XCircle, User } from 'lucide-react';

const statusConfig = {
  Submitted: {
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  'In Progress': {
    icon: AlertCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  Resolved: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  Closed: {
    icon: XCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

const priorityColors = {
  Low: 'text-gray-600 bg-gray-100',
  Medium: 'text-blue-600 bg-blue-100',
  High: 'text-orange-600 bg-orange-100',
  Urgent: 'text-red-600 bg-red-100',
};

export function ComplaintCard({ complaint, onClick }) {
  const config = statusConfig[complaint.status];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border ${config.borderColor} p-4 hover:shadow-md transition-shadow cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[complaint.priority]}`}>
            {complaint.priority}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {complaint.category}
          </span>
        </div>
        <div className={`flex items-center gap-1 ${config.color}`}>
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{complaint.status}</span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{complaint.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>Room {complaint.room_number}</span>
        </div>
        <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
