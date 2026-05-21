-- Fix: infinite recursion in users RLS policies
-- Các policy cũ (users_self_read, users_admin_all) dùng public role gây vòng lặp
-- Xóa policy cũ, giữ policy anon đơn giản là đủ cho admin.html

DROP POLICY IF EXISTS users_self_read  ON public.users;
DROP POLICY IF EXISTS users_admin_all  ON public.users;

-- Đảm bảo RLS được bật
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- SELECT: anon được đọc tất cả (admin.html dùng anon key)
DROP POLICY IF EXISTS anon_read_users ON public.users;
CREATE POLICY anon_read_users ON public.users
  FOR SELECT TO anon USING (true);

-- UPDATE: anon được cập nhật is_active, is_on_off (admin toggle)
DROP POLICY IF EXISTS anon_update_users ON public.users;
CREATE POLICY anon_update_users ON public.users
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
