export const Database = {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: '',
            email: '',
            full_name: '',
            room_number: null,
            role: 'student', // or 'staff'
            phone: null,
            created_at: '',
            updated_at: '',
          },
          Insert: {
            id: '',
            email: '',
            full_name: '',
            room_number: null,
            role: 'student', // or 'staff'
            phone: null,
            created_at: '',
            updated_at: '',
          },
          Update: {
            id: undefined,
            email: undefined,
            full_name: undefined,
            room_number: undefined,
            role: undefined,
            phone: undefined,
            created_at: undefined,
            updated_at: undefined,
          },
        },
        complaints: {
          Row: {
            id: '',
            student_id: '',
            category: 'Electrical', // or other categories
            title: '',
            description: '',
            status: 'Submitted', // or 'In Progress', 'Resolved', 'Closed'
            priority: 'Medium', // or 'Low', 'High', 'Urgent'
            assigned_to: null,
            room_number: '',
            created_at: '',
            updated_at: '',
            resolved_at: null,
          },
          Insert: {
            student_id: '',
            category: 'Electrical',
            title: '',
            description: '',
            status: 'Submitted',
            priority: 'Medium',
            assigned_to: null,
            room_number: '',
            created_at: '',
            updated_at: '',
            resolved_at: null,
          },
          Update: {
            id: undefined,
            student_id: undefined,
            category: undefined,
            title: undefined,
            description: undefined,
            status: undefined,
            priority: undefined,
            assigned_to: undefined,
            room_number: undefined,
            created_at: undefined,
            updated_at: undefined,
            resolved_at: undefined,
          },
        },
        complaint_history: {
          Row: {
            id: '',
            complaint_id: '',
            changed_by: '',
            old_status: null,
            new_status: '',
            comment: null,
            created_at: '',
          },
          Insert: {
            complaint_id: '',
            changed_by: '',
            old_status: null,
            new_status: '',
            comment: null,
            created_at: '',
          },
          Update: {
            id: undefined,
            complaint_id: undefined,
            changed_by: undefined,
            old_status: undefined,
            new_status: undefined,
            comment: undefined,
            created_at: undefined,
          },
        },
      },
    },
  };
  