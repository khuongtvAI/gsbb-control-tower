-- Nguồn: templates/_UsersFunctions.xlsx / sheet: UserFunction
-- Id→uf_id, Function_Id→function_id, UserName→username, User_Right→user_right

CREATE TABLE IF NOT EXISTS public.users_functions (
  id            BIGSERIAL     PRIMARY KEY,
  uf_id         SMALLINT,
  function_id   SMALLINT      NOT NULL,
  username      VARCHAR(100)  NOT NULL,
  user_right    VARCHAR(100),
  created_at    TIMESTAMPTZ   DEFAULT now(),
  updated_at    TIMESTAMPTZ   DEFAULT now(),
  CONSTRAINT uf_unique UNIQUE (username, function_id)
);

-- ── Indexes ──────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS uf_username_idx    ON public.users_functions (username);
CREATE INDEX IF NOT EXISTS uf_function_idx    ON public.users_functions (function_id);
CREATE INDEX IF NOT EXISTS uf_active_idx      ON public.users_functions (username, function_id);

-- ── Auto-update updated_at ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS uf_updated_at ON public.users_functions;
CREATE TRIGGER uf_updated_at
  BEFORE UPDATE ON public.users_functions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────
ALTER TABLE public.users_functions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_read_uf ON public.users_functions;
CREATE POLICY anon_read_uf ON public.users_functions
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS anon_write_uf ON public.users_functions;
CREATE POLICY anon_write_uf ON public.users_functions
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── Comment ───────────────────────────────────────────────────────────
COMMENT ON TABLE public.users_functions IS
  'Phân quyền User × Function — nguồn: templates/_UsersFunctions.xlsx';
