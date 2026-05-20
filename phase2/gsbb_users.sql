-- ============================================================
-- Bảng Users GSBB
-- Nguồn: Users/Template/Users.xlsx — sheet "Users"
-- Tên cột giữ nguyên tiếng Anh → snake_case
-- Apply: chạy qua supabase CLI hoặc SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (

  -- ── ĐỊNH DANH ──────────────────────────────────────────────
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  username          VARCHAR(100)  NOT NULL UNIQUE,      -- UserName
  password_hash     TEXT,                               -- PassWord (hashed)
  email             VARCHAR(255)  UNIQUE,               -- Email

  -- ── THÔNG TIN CÁ NHÂN ─────────────────────────────────────
  full_name         VARCHAR(255),                       -- FullName
  phone             VARCHAR(20),                        -- Phone

  -- ── PHÂN LOẠI / PHÂN QUYỀN ────────────────────────────────
  depart_code       INTEGER,                            -- DepartCode
  role_code         INTEGER,                            -- RoleCode
  rank_code         VARCHAR(20),                        -- RankCode (I / II / III / IV …)

  -- ── HỆ THỐNG ─────────────────────────────────────────────
  user_window       VARCHAR(100),                       -- UserWindow (Windows login)
  key               TEXT,                               -- Key
  short             VARCHAR(50),                        -- Short
  description       TEXT,                               -- Decription (typo kept from source)

  -- ── TRẠNG THÁI ───────────────────────────────────────────
  is_active         BOOLEAN       NOT NULL DEFAULT true,  -- IsActice
  date_lock         TIMESTAMPTZ,                          -- DateLock
  auth_type         VARCHAR(50)   DEFAULT 'Application',  -- Auth_Type
  is_administrator  BOOLEAN       NOT NULL DEFAULT false, -- IsAdministrator
  is_on_off         BOOLEAN       NOT NULL DEFAULT false, -- IsOnOFF

  -- ── AUDIT ────────────────────────────────────────────────
  create_by         VARCHAR(100),                       -- CreateBy
  modified_by       VARCHAR(100),                       -- ModifileBy
  create_date       TIMESTAMPTZ   DEFAULT now(),        -- CreateDate
  change_date       TIMESTAMPTZ   DEFAULT now()         -- ChangeDate
);

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS users_username_idx    ON public.users (username);
CREATE INDEX IF NOT EXISTS users_email_idx       ON public.users (email);
CREATE INDEX IF NOT EXISTS users_depart_code_idx ON public.users (depart_code);
CREATE INDEX IF NOT EXISTS users_role_code_idx   ON public.users (role_code);
CREATE INDEX IF NOT EXISTS users_is_active_idx   ON public.users (is_active);

-- ── AUTO-UPDATE change_date ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_users_change_date()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.change_date = now(); RETURN NEW; END;
$$;

CREATE TRIGGER users_change_date_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_users_change_date();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User đọc thông tin của chính mình
CREATE POLICY "users_self_read" ON public.users
  FOR SELECT USING (username = current_user OR
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('ceo','pmo'))
  );

-- Admin (ceo/pmo) quản lý tất cả
CREATE POLICY "users_admin_all" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('ceo','pmo'))
  );

-- ── COMMENT ──────────────────────────────────────────────────
COMMENT ON TABLE public.users IS 'Danh sách người dùng GSBB — nguồn: Users/Template/Users.xlsx';
COMMENT ON COLUMN public.users.id            IS 'UUID tự sinh — thay thế ID cũ từ SQL Server';
COMMENT ON COLUMN public.users.password_hash IS 'Mật khẩu đã hash — KHÔNG lưu plain text';
COMMENT ON COLUMN public.users.rank_code     IS 'Cấp bậc: I / II / III / IV';
COMMENT ON COLUMN public.users.auth_type     IS 'Application | Windows | SSO';
COMMENT ON COLUMN public.users.is_on_off     IS 'TRUE = đang online';
