/*
  # RoomResQ Database Schema - Hostel Complaint Management System

  ## Overview
  Creates the complete database structure for RoomResQ including user profiles, 
  complaints, staff assignments, and authentication management.

  ## 1. New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text, unique) - User email address
  - `full_name` (text) - User's full name
  - `room_number` (text, nullable) - Hostel room number (for students)
  - `role` (text) - User role: 'student' or 'staff'
  - `phone` (text, nullable) - Contact phone number
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `complaints`
  - `id` (uuid, primary key) - Unique complaint identifier
  - `student_id` (uuid, foreign key) - References profiles(id)
  - `category` (text) - Complaint category (Electrical, Plumbing, Cleaning, Maintenance, Other)
  - `title` (text) - Brief complaint title
  - `description` (text) - Detailed complaint description
  - `status` (text) - Current status: 'Submitted', 'In Progress', 'Resolved', 'Closed'
  - `priority` (text) - Priority level: 'Low', 'Medium', 'High', 'Urgent'
  - `assigned_to` (uuid, nullable, foreign key) - References profiles(id) for staff
  - `room_number` (text) - Room where issue occurred
  - `created_at` (timestamptz) - Complaint submission time
  - `updated_at` (timestamptz) - Last status update time
  - `resolved_at` (timestamptz, nullable) - Resolution timestamp

  ### `complaint_history`
  - `id` (uuid, primary key) - History entry identifier
  - `complaint_id` (uuid, foreign key) - References complaints(id)
  - `changed_by` (uuid, foreign key) - References profiles(id)
  - `old_status` (text) - Previous status
  - `new_status` (text) - New status
  - `comment` (text, nullable) - Optional comment about the change
  - `created_at` (timestamptz) - When the change occurred

  ## 2. Security (Row Level Security)
  - Enable RLS on all tables
  - Students can view/create their own complaints
  - Students can update their own profiles
  - Staff can view all complaints and update assigned complaints
  - Staff can view all profiles
  - All authenticated users can read their own profile
  - Complaint history is readable by complaint owners and staff

  ## 3. Indexes
  - Index on complaints(student_id) for fast student complaint lookup
  - Index on complaints(assigned_to) for staff workload queries
  - Index on complaints(status) for filtering
  - Index on complaint_history(complaint_id) for history lookup
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  room_number text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff')),
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('Electrical', 'Plumbing', 'Cleaning', 'Maintenance', 'Furniture', 'Internet', 'Other')),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'In Progress', 'Resolved', 'Closed')),
  priority text DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  room_number text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create complaint history table for audit trail
CREATE TABLE IF NOT EXISTS complaint_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  changed_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  old_status text,
  new_status text NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_complaints_student_id ON complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaint_history_complaint_id ON complaint_history(complaint_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'staff'
    )
  );

-- RLS Policies for complaints table
CREATE POLICY "Students can view own complaints"
  ON complaints FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Staff can view all complaints"
  ON complaints FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'staff'
    )
  );

CREATE POLICY "Students can create complaints"
  ON complaints FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Staff can update complaints"
  ON complaints FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'staff'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'staff'
    )
  );

CREATE POLICY "Students can update own unassigned complaints"
  ON complaints FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() AND status = 'Submitted')
  WITH CHECK (student_id = auth.uid() AND status = 'Submitted');

-- RLS Policies for complaint_history table
CREATE POLICY "Users can view history of their complaints"
  ON complaint_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM complaints
      WHERE complaints.id = complaint_history.complaint_id
      AND complaints.student_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all complaint history"
  ON complaint_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'staff'
    )
  );

CREATE POLICY "Authenticated users can insert history"
  ON complaint_history FOR INSERT
  TO authenticated
  WITH CHECK (changed_by = auth.uid());

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log complaint status changes
CREATE OR REPLACE FUNCTION log_complaint_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO complaint_history (complaint_id, changed_by, old_status, new_status)
    VALUES (NEW.id, auth.uid(), OLD.status, NEW.status);
    
    IF NEW.status = 'Resolved' AND OLD.status != 'Resolved' THEN
      NEW.resolved_at = now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically log status changes
CREATE TRIGGER log_complaint_status
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION log_complaint_status_change();