-- ═══════════════════════════════════════════════════════════════════
-- GSBB — Users Schema for Supabase (PostgreSQL)
-- Converted from SQL Server schema (MSSQL → PostgreSQL)
-- Apply: paste vào Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. LOOKUP TABLES (tạo trước vì Users có FK đến đây) ─────────────

CREATE TABLE IF NOT EXISTS public."ListDepartment" (
  "Code"        CHAR(3)       PRIMARY KEY,
  "Name"        VARCHAR(100)  NOT NULL,
  "Description" VARCHAR(200)  NULL,
  "IsActive"    BOOLEAN       NOT NULL DEFAULT true,
  "CreateDate"  TIMESTAMPTZ   DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."ListRank" (
  "RankCode"    VARCHAR(3)    PRIMARY KEY,
  "RankName"    VARCHAR(100)  NOT NULL,
  "Description" VARCHAR(200)  NULL,
  "IsActive"    BOOLEAN       NOT NULL DEFAULT true,
  "CreateDate"  TIMESTAMPTZ   DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."Roles" (
  "RoleCode"    VARCHAR(3)    PRIMARY KEY,
  "RoleName"    VARCHAR(100)  NOT NULL,
  "Description" VARCHAR(200)  NULL,
  "IsActive"    BOOLEAN       NOT NULL DEFAULT true,
  "CreateDate"  TIMESTAMPTZ   DEFAULT now()
);

-- ── 2. USERS TABLE ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public."Users" (
  "ID"              UUID            NOT NULL DEFAULT gen_random_uuid(),
  "UserName"        VARCHAR(50)     NOT NULL,
  "PassWord"        VARCHAR(200)    NULL,         -- store hashed only (bcrypt/argon2)
  "Email"           VARCHAR(50)     NULL,
  "FullName"        VARCHAR(30)     NULL,
  "Phone"           VARCHAR(11)     NULL,
  "DepartCode"      CHAR(3)         NULL,
  "RoleCode"        VARCHAR(3)      NOT NULL,
  "RankCode"        VARCHAR(3)      NOT NULL,
  "UserWindow"      VARCHAR(50)     NULL,
  "Key"             VARCHAR(50)     NULL,
  "Short"           NUMERIC(18, 0)  NULL,
  "Decription"      VARCHAR(50)     NULL,
  "IsActice"        BOOLEAN         NOT NULL DEFAULT true,
  "DateLock"        TIMESTAMPTZ     NULL,
  "Auth_Type"       VARCHAR(30)     NULL,         -- 'local' | 'google' | 'sso'
  "IsAdministrator" BOOLEAN         NOT NULL DEFAULT false,
  "IsOnOFF"         BOOLEAN         NOT NULL DEFAULT false,
  "CreateBy"        VARCHAR(50)     NULL,
  "ModifileBy"      VARCHAR(50)     NULL,
  "CreateDate"      TIMESTAMPTZ     DEFAULT now(),
  "ChangeDate"      TIMESTAMPTZ     DEFAULT now(),

  -- Primary Key (giữ nguyên cấu trúc composite như SQL Server gốc)
  CONSTRAINT "PK_Users" PRIMARY KEY ("ID", "UserName"),

  -- Foreign Keys
  CONSTRAINT "FK_Users_ListDepartment"
    FOREIGN KEY ("DepartCode") REFERENCES public."ListDepartment" ("Code"),

  CONSTRAINT "FK_Users_ListRank"
    FOREIGN KEY ("RankCode")   REFERENCES public."ListRank" ("RankCode"),

  CONSTRAINT "FK_Users_Roles"
    FOREIGN KEY ("RoleCode")   REFERENCES public."Roles" ("RoleCode")
);

-- Index tìm kiếm nhanh theo UserName và Email
CREATE UNIQUE INDEX IF NOT EXISTS "UX_Users_UserName"
  ON public."Users" ("UserName");

CREATE INDEX IF NOT EXISTS "IX_Users_Email"
  ON public."Users" ("Email");

CREATE INDEX IF NOT EXISTS "IX_Users_DepartCode"
  ON public."Users" ("DepartCode");

-- Auto-update ChangeDate khi có UPDATE
CREATE OR REPLACE FUNCTION update_change_date()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW."ChangeDate" = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER "TR_Users_ChangeDate"
  BEFORE UPDATE ON public."Users"
  FOR EACH ROW EXECUTE FUNCTION update_change_date();

-- ── 3. ROW LEVEL SECURITY (Supabase) ────────────────────────────────

ALTER TABLE public."ListDepartment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ListRank"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Roles"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Users"          ENABLE ROW LEVEL SECURITY;

-- Lookup tables: mọi user đã đăng nhập đều đọc được
CREATE POLICY "authenticated_read_departments"
  ON public."ListDepartment" FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "authenticated_read_ranks"
  ON public."ListRank" FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "authenticated_read_roles"
  ON public."Roles" FOR SELECT
  TO authenticated USING (true);

-- Users: user chỉ đọc record của chính mình
CREATE POLICY "users_read_self"
  ON public."Users" FOR SELECT
  TO authenticated
  USING ("UserName" = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Admin đọc/ghi tất cả
CREATE POLICY "admin_full_access"
  ON public."Users" FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Users" u
      WHERE u."UserName" = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND u."IsAdministrator" = true
        AND u."IsActice" = true
    )
  );

-- ── 4. SEED DATA — Lookup tables ─────────────────────────────────────

INSERT INTO public."ListDepartment" ("Code", "Name") VALUES
  ('CEO', 'Ban Giám đốc'),
  ('PMO', 'Văn phòng Quản trị Dự án'),
  ('FIN', 'Tài chính - Kế toán'),
  ('SAL', 'Kinh doanh'),
  ('MFG', 'Sản xuất'),
  ('QUA', 'Chất lượng'),
  ('SCM', 'Chuỗi cung ứng'),
  ('HRD', 'Nhân sự'),
  ('ICT', 'Công nghệ thông tin')
ON CONFLICT ("Code") DO NOTHING;

INSERT INTO public."ListRank" ("RankCode", "RankName") VALUES
  ('L1', 'Nhân viên'),
  ('L2', 'Chuyên viên'),
  ('L3', 'Trưởng nhóm'),
  ('L4', 'Trưởng phòng'),
  ('L5', 'Giám đốc'),
  ('L6', 'CEO / Chủ tịch')
ON CONFLICT ("RankCode") DO NOTHING;

INSERT INTO public."Roles" ("RoleCode", "RoleName") VALUES
  ('ADM', 'Administrator'),
  ('CEO', 'CEO View'),
  ('PMO', 'PMO Lead'),
  ('CFO', 'CFO View'),
  ('MGR', 'Manager'),
  ('OWN', 'OC Owner'),
  ('VIW', 'Viewer')
ON CONFLICT ("RoleCode") DO NOTHING;

-- ── 5. SEED USER — Admin mặc định ───────────────────────────────────
-- Thay 'admin@gsbb.vn' bằng email thật sau khi tạo user trong Supabase Auth

-- INSERT INTO public."Users"
--   ("UserName","FullName","Email","RoleCode","RankCode","DepartCode","IsAdministrator","IsActice","Auth_Type","CreateBy")
-- VALUES
--   ('admin@gsbb.vn','Admin GSBB','admin@gsbb.vn','ADM','L5','ICT', true, true,'local','system');
