-- Báº£ng phÃ¢n quyá»n: User Ã— Trang HTML
-- Admin dÃ¹ng trang admin.html Ä‘á»ƒ toggle checkbox, lÆ°u vÃ o báº£ng nÃ y
-- CÃ¡c trang HTML Ä‘á»c báº£ng nÃ y Ä‘á»ƒ kiá»ƒm tra xem user hiá»‡n táº¡i cÃ³ quyá»n xem khÃ´ng

CREATE TABLE IF NOT EXISTS public.user_page_access (
  id           BIGSERIAL    PRIMARY KEY,
  user_id      UUID         NOT NULL,
  function_id  SMALLINT     NOT NULL,
  is_active    BOOLEAN      NOT NULL DEFAULT true,
  granted_by   VARCHAR(100),
  created_at   TIMESTAMPTZ  DEFAULT now(),
  updated_at   TIMESTAMPTZ  DEFAULT now(),
  CONSTRAINT upa_unique UNIQUE (user_id, function_id)
);

CREATE INDEX IF NOT EXISTS upa_user_idx     ON public.user_page_access (user_id);
CREATE INDEX IF NOT EXISTS upa_func_idx     ON public.user_page_access (function_id);
CREATE INDEX IF NOT EXISTS upa_active_idx   ON public.user_page_access (user_id, function_id, is_active);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS upa_updated_at ON public.user_page_access;
CREATE TRIGGER upa_updated_at
  BEFORE UPDATE ON public.user_page_access
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.user_page_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_read_upa  ON public.user_page_access;
CREATE POLICY anon_read_upa ON public.user_page_access
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS anon_write_upa ON public.user_page_access;
CREATE POLICY anon_write_upa ON public.user_page_access
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Cho phÃ©p anon Ä‘á»c users (admin.html dÃ¹ng anon key)
-- Password_hash khÃ´ng tráº£ vá» trong query â€” admin.html chá»‰ select cÃ¡c cá»™t cáº§n thiáº¿t
DROP POLICY IF EXISTS anon_read_users ON public.users;
CREATE POLICY anon_read_users ON public.users
  FOR SELECT TO anon USING (true);

COMMENT ON TABLE public.user_page_access IS
  'PhÃ¢n quyá»n user Ã— trang HTML â€” admin quáº£n lÃ½ qua admin.html';
