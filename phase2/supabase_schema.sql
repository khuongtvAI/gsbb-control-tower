-- GSBB Supabase schema — Phase 2 Auth + RBAC
-- Apply: supabase db push  hoặc paste vào SQL editor

-- 1. User roles
CREATE TABLE IF NOT EXISTS user_roles (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('ceo','pmo','cfo','tl1','oc_owner','viewer')),
  oc_scope   INT[] DEFAULT '{}',
  full_name  TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. War Room access (restricted)
CREATE TABLE IF NOT EXISTS war_room_access (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rooms      TEXT[] NOT NULL DEFAULT '{}',  -- ['campaign','customer','plant','issue']
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Audit log (mọi access vào War Room)
CREATE TABLE IF NOT EXISTS audit_log (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id),
  action     TEXT NOT NULL,
  resource   TEXT NOT NULL,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_log_user_idx ON audit_log(user_id, created_at DESC);

-- 4. RLS
ALTER TABLE user_roles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_room_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log       ENABLE ROW LEVEL SECURITY;

-- User chỉ đọc role của chính mình
CREATE POLICY "self_read" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

-- Admin (role=ceo hoặc pmo) đọc tất cả
CREATE POLICY "admin_read_all_roles" ON user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('ceo','pmo'))
  );

-- 5. Helper function — check role
CREATE OR REPLACE FUNCTION has_role(target_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = target_role
  );
$$;

-- 6. Seed initial CEO (replace with real email)
-- INSERT INTO user_roles (user_id, role, full_name, department)
-- VALUES ('<UUID-from-auth.users>', 'ceo', 'CEO GSBB', 'Executive');
