-- Table structure for Estimates
CREATE TABLE estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  final_volume integer,
  net_volume integer,
  truck_space_cf integer,
  inputs_state jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Policy: Select (Managers can only view their own nested estimates)
CREATE POLICY "Managers can view own estimates"
ON estimates
FOR SELECT
USING (auth.uid() = manager_id);

-- Policy: Insert (Managers can only insert for themselves)
CREATE POLICY "Managers can insert own estimates"
ON estimates
FOR INSERT
WITH CHECK (auth.uid() = manager_id);

-- Policy: Update (Optional, if editing is required in the future)
CREATE POLICY "Managers can update own estimates"
ON estimates
FOR UPDATE
USING (auth.uid() = manager_id)
WITH CHECK (auth.uid() = manager_id);

-- Policy: Delete (Optional, if deleting is required)
CREATE POLICY "Managers can delete own estimates"
ON estimates
FOR DELETE
USING (auth.uid() = manager_id);
