-- Thêm cột can_edit và can_view vào users_functions
ALTER TABLE public.users_functions
  ADD COLUMN IF NOT EXISTS can_edit BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_view BOOLEAN NOT NULL DEFAULT true;

-- Index hỗ trợ tra cứu theo username
CREATE INDEX IF NOT EXISTS uf_username_func_idx ON public.users_functions (username, function_id);
